 import { useState, useEffect } from "react";
 import { useNavigate, useLocation } from "react-router-dom";
 import { motion } from "framer-motion";
 import { supabase } from "@/integrations/supabase/client";
 import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
 import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
 import { useToast } from "@/hooks/use-toast";
 import { ArrowRight, CheckCircle, Clock, Loader2, AlertCircle } from "lucide-react";
 import type { User } from "@supabase/supabase-js";
 
 interface BankAccount {
   id: string;
   bank_name: string;
   account_number: string;
   currency: string;
 }
 
 const EXCHANGE_RATES = {
   buy: 3.72,
   sell: 3.78,
 };
 
 const MIN_AMOUNT = 100;
 
 type Step = "simulate" | "confirm" | "transfer" | "complete";
 
 const Exchange = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const { toast } = useToast();
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [accounts, setAccounts] = useState<BankAccount[]>([]);
   const [step, setStep] = useState<Step>("simulate");
 
   // Form state
   const [fromCurrency, setFromCurrency] = useState<"PEN" | "USD">("PEN");
   const [amount, setAmount] = useState(location.state?.amount || "1000");
   const [result, setResult] = useState("0");
   const [sourceAccountId, setSourceAccountId] = useState("");
   const [destAccountId, setDestAccountId] = useState("");
   const [transferNumber, setTransferNumber] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);
 
   const toCurrency = fromCurrency === "PEN" ? "USD" : "PEN";
   const rate = fromCurrency === "PEN" ? EXCHANGE_RATES.sell : EXCHANGE_RATES.buy;
   const minAmount = fromCurrency === "PEN" ? MIN_AMOUNT * rate : MIN_AMOUNT;
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       if (!session) {
         navigate("/auth");
       } else {
         setUser(session.user);
         loadAccounts(session.user.id);
       }
       setIsLoading(false);
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (!session) {
         navigate("/auth");
       } else {
         setUser(session.user);
         loadAccounts(session.user.id);
       }
       setIsLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, [navigate]);
 
   useEffect(() => {
     const numAmount = parseFloat(amount) || 0;
     const converted = fromCurrency === "PEN" 
       ? numAmount / rate 
       : numAmount * rate;
     setResult(converted.toFixed(2));
   }, [amount, fromCurrency, rate]);
 
   const loadAccounts = async (userId: string) => {
     const { data } = await supabase
       .from("bank_accounts")
       .select("*")
       .eq("user_id", userId);
     setAccounts(data || []);
   };
 
   const sourceAccounts = accounts.filter((acc) => acc.currency === fromCurrency);
   const destAccounts = accounts.filter((acc) => acc.currency === toCurrency);
 
   const handleConfirm = () => {
     const numAmount = parseFloat(amount) || 0;
     if (numAmount < minAmount) {
       toast({
         title: "Monto inválido",
         description: `El monto mínimo es ${fromCurrency === "PEN" ? "S/" : "$"}${minAmount.toFixed(2)}`,
         variant: "destructive",
       });
       return;
     }
 
     if (!sourceAccountId || !destAccountId) {
       toast({
         title: "Selecciona las cuentas",
         description: "Debes seleccionar una cuenta de origen y destino.",
         variant: "destructive",
       });
       return;
     }
 
     setStep("confirm");
   };
 
   const handleTransfer = () => {
     setStep("transfer");
   };
 
   const handleComplete = async () => {
     if (!transferNumber.trim()) {
       toast({
         title: "Número requerido",
         description: "Ingresa el número de operación bancaria.",
         variant: "destructive",
       });
       return;
     }
 
     setIsSubmitting(true);
 
     // Simulate operation creation
     const { error } = await supabase.from("exchange_operations").insert({
       user_id: user?.id,
       source_currency: fromCurrency,
       target_currency: toCurrency,
       source_amount: parseFloat(amount),
       target_amount: parseFloat(result),
       exchange_rate: rate,
       source_account_id: sourceAccountId,
       target_account_id: destAccountId,
       transfer_number: transferNumber,
       status: "pending",
     });
 
     if (error) {
       toast({
         title: "Error",
         description: "No se pudo registrar la operación.",
         variant: "destructive",
       });
     } else {
       setStep("complete");
       toast({
         title: "¡Operación registrada!",
         description: "Tu cambio está siendo procesado.",
       });
     }
 
     setIsSubmitting(false);
   };
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-emerald" />
       </div>
     );
   }
 
   const hasNoAccounts = accounts.length === 0;
 
   return (
     <div className="min-h-screen bg-background">
       <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
 
       <div className="lg:pl-64">
         <DashboardHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} />
 
         <main className="p-4 md:p-6 lg:p-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="max-w-2xl mx-auto"
           >
             {/* Progress Steps */}
             <div className="flex items-center justify-center gap-2 mb-8">
               {["simulate", "confirm", "transfer", "complete"].map((s, i) => (
                 <div key={s} className="flex items-center">
                   <div
                     className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                       step === s || ["simulate", "confirm", "transfer", "complete"].indexOf(step) > i
                         ? "bg-emerald text-white"
                         : "bg-muted text-muted-foreground"
                     }`}
                   >
                     {i + 1}
                   </div>
                   {i < 3 && (
                     <div
                       className={`w-12 h-1 mx-2 ${
                         ["simulate", "confirm", "transfer", "complete"].indexOf(step) > i
                           ? "bg-emerald"
                           : "bg-muted"
                       }`}
                     />
                   )}
                 </div>
               ))}
             </div>
 
             {/* No accounts warning */}
             {hasNoAccounts && step === "simulate" && (
               <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                 <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                 <div>
                   <p className="font-medium text-foreground">Registra tus cuentas primero</p>
                   <p className="text-sm text-muted-foreground">
                     Necesitas registrar al menos una cuenta en soles y una en dólares.
                   </p>
                   <Button
                     variant="link"
                     className="text-emerald p-0 h-auto mt-1"
                     onClick={() => navigate("/accounts")}
                   >
                     Ir a Mis Cuentas →
                   </Button>
                 </div>
               </div>
             )}
 
             {/* Step Content */}
             <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg">
               {step === "simulate" && (
                 <>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Simula tu Cambio
                   </h2>
 
                   <div className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Envías</Label>
                         <Input
                           type="number"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           className="input-field text-lg font-semibold"
                         />
                         <Select value={fromCurrency} onValueChange={(v) => setFromCurrency(v as "PEN" | "USD")}>
                           <SelectTrigger className="input-field">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="PEN">🇵🇪 Soles</SelectItem>
                             <SelectItem value="USD">🇺🇸 Dólares</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label>Recibes</Label>
                         <Input
                           value={result}
                           readOnly
                           className="input-field text-lg font-semibold bg-muted/30"
                         />
                         <div className="h-10 px-3 flex items-center bg-muted/30 rounded-md text-sm">
                           {toCurrency === "PEN" ? "🇵🇪 Soles" : "🇺🇸 Dólares"}
                         </div>
                       </div>
                     </div>
 
                     <div className="p-3 bg-muted/50 rounded-lg text-center">
                       <span className="text-sm text-muted-foreground">
                         Tipo de cambio: <strong className="text-foreground">S/ {rate.toFixed(2)}</strong>
                       </span>
                     </div>
 
                     <div className="grid md:grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Cuenta Origen ({fromCurrency})</Label>
                         <Select value={sourceAccountId} onValueChange={setSourceAccountId}>
                           <SelectTrigger className="input-field">
                             <SelectValue placeholder="Selecciona cuenta" />
                           </SelectTrigger>
                           <SelectContent>
                             {sourceAccounts.map((acc) => (
                               <SelectItem key={acc.id} value={acc.id}>
                                 {acc.bank_name} - {acc.account_number}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                       <div className="space-y-2">
                         <Label>Cuenta Destino ({toCurrency})</Label>
                         <Select value={destAccountId} onValueChange={setDestAccountId}>
                           <SelectTrigger className="input-field">
                             <SelectValue placeholder="Selecciona cuenta" />
                           </SelectTrigger>
                           <SelectContent>
                             {destAccounts.map((acc) => (
                               <SelectItem key={acc.id} value={acc.id}>
                                 {acc.bank_name} - {acc.account_number}
                               </SelectItem>
                             ))}
                           </SelectContent>
                         </Select>
                       </div>
                     </div>
                   </div>
 
                   <Button
                     onClick={handleConfirm}
                     disabled={hasNoAccounts}
                     className="w-full mt-6 btn-accent h-12 text-base"
                   >
                     Confirmar Operación
                     <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                 </>
               )}
 
               {step === "confirm" && (
                 <>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                     Confirma tu Operación
                   </h2>
 
                   <div className="space-y-4 bg-muted/30 rounded-xl p-4">
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Envías:</span>
                       <span className="font-semibold">
                         {fromCurrency === "PEN" ? "S/" : "$"} {parseFloat(amount).toFixed(2)} {fromCurrency}
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Recibes:</span>
                       <span className="font-semibold text-emerald">
                         {toCurrency === "PEN" ? "S/" : "$"} {result} {toCurrency}
                       </span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-muted-foreground">Tipo de Cambio:</span>
                       <span className="font-semibold">S/ {rate.toFixed(2)}</span>
                     </div>
                   </div>
 
                   <div className="flex gap-3 mt-6">
                     <Button variant="outline" onClick={() => setStep("simulate")} className="flex-1">
                       Volver
                     </Button>
                     <Button onClick={handleTransfer} className="flex-1 btn-accent">
                       Proceder a Transferir
                     </Button>
                   </div>
                 </>
               )}
 
               {step === "transfer" && (
                 <>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                     Realiza la Transferencia
                   </h2>
                   <p className="text-muted-foreground mb-6">
                     Transfiere el monto a nuestra cuenta y registra el número de operación.
                   </p>
 
                   <div className="bg-emerald/10 border border-emerald/30 rounded-xl p-4 mb-6">
                     <p className="text-sm text-muted-foreground mb-2">Transfiere a:</p>
                     <p className="font-semibold text-foreground">BCP - 191-12345678-0-99</p>
                     <p className="text-sm text-muted-foreground">CambioYa S.A.C.</p>
                     <p className="text-2xl font-bold text-emerald mt-2">
                       {fromCurrency === "PEN" ? "S/" : "$"} {parseFloat(amount).toFixed(2)}
                     </p>
                   </div>
 
                   <div className="space-y-2">
                     <Label>Número de Operación Bancaria</Label>
                     <Input
                       value={transferNumber}
                       onChange={(e) => setTransferNumber(e.target.value)}
                       placeholder="Ej: 123456789"
                       className="input-field"
                     />
                   </div>
 
                   <div className="flex gap-3 mt-6">
                     <Button variant="outline" onClick={() => setStep("confirm")} className="flex-1">
                       Volver
                     </Button>
                     <Button onClick={handleComplete} disabled={isSubmitting} className="flex-1 btn-accent">
                       {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Confirmar Transferencia
                     </Button>
                   </div>
                 </>
               )}
 
               {step === "complete" && (
                 <div className="text-center py-8">
                   <div className="w-20 h-20 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-6">
                     <CheckCircle className="h-10 w-10 text-emerald" />
                   </div>
                   <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                     ¡Operación Registrada!
                   </h2>
                   <p className="text-muted-foreground mb-6">
                     Estamos verificando tu transferencia. Te notificaremos cuando el depósito esté listo.
                   </p>
 
                   <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
                     <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                       <Clock className="h-4 w-4" />
                       <span>Tiempo estimado: 5-10 minutos</span>
                     </div>
                     <div className="flex justify-between py-2 border-b border-border/50">
                       <span className="text-muted-foreground">Recibirás:</span>
                       <span className="font-semibold text-emerald">
                         {toCurrency === "PEN" ? "S/" : "$"} {result}
                       </span>
                     </div>
                   </div>
 
                   <Button onClick={() => navigate("/dashboard")} className="btn-accent">
                     Volver al Inicio
                   </Button>
                 </div>
               )}
             </div>
           </motion.div>
         </main>
       </div>
     </div>
   );
 };
 
 export default Exchange;