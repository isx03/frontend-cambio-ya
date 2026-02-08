 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { ArrowDownUp, TrendingUp, Info } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { useNavigate } from "react-router-dom";
 
 const EXCHANGE_RATES = {
   buy: 3.72,
   sell: 3.78,
 };
 
 const MIN_AMOUNT = 100;
 
 export const ExchangeWidget = () => {
   const navigate = useNavigate();
   const [fromCurrency, setFromCurrency] = useState<"PEN" | "USD">("PEN");
   const [amount, setAmount] = useState<string>("1000");
   const [result, setResult] = useState<string>("0");
   const [error, setError] = useState<string>("");
 
   const toCurrency = fromCurrency === "PEN" ? "USD" : "PEN";
   const rate = fromCurrency === "PEN" ? EXCHANGE_RATES.sell : EXCHANGE_RATES.buy;
   const minAmount = fromCurrency === "PEN" ? MIN_AMOUNT * rate : MIN_AMOUNT;
 
   useEffect(() => {
     const numAmount = parseFloat(amount) || 0;
     
     if (numAmount < minAmount && numAmount > 0) {
       setError(`Monto mínimo: ${fromCurrency === "PEN" ? "S/" : "$"}${minAmount.toFixed(2)}`);
     } else {
       setError("");
     }
     
     const converted = fromCurrency === "PEN" 
       ? numAmount / rate 
       : numAmount * rate;
     setResult(converted.toFixed(2));
   }, [amount, fromCurrency, rate, minAmount]);
 
   const toggleCurrency = () => {
     setFromCurrency(fromCurrency === "PEN" ? "USD" : "PEN");
   };
 
   const handleStartExchange = () => {
     const numAmount = parseFloat(amount) || 0;
     if (numAmount >= minAmount) {
       navigate("/exchange", { 
         state: { amount, fromCurrency, result, rate } 
       });
     }
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
     >
       {/* Header */}
       <div className="flex items-center justify-between mb-6">
         <div>
           <h2 className="font-display text-xl font-bold text-foreground">Simular Cambio</h2>
           <p className="text-sm text-muted-foreground">Tipo de cambio en tiempo real</p>
         </div>
         <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-1 rounded-full">
           <TrendingUp className="h-4 w-4" />
           <span className="text-sm font-bold">S/ {EXCHANGE_RATES.sell.toFixed(2)}</span>
         </div>
       </div>
 
       <div className="grid md:grid-cols-2 gap-6">
         {/* From */}
         <div className="space-y-2">
           <label className="text-sm text-muted-foreground">Envías</label>
           <div className="relative">
             <Input
               type="number"
               value={amount}
               onChange={(e) => setAmount(e.target.value)}
               className={`input-field pr-20 text-lg h-14 font-semibold ${error ? "border-destructive" : ""}`}
               placeholder="0.00"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <span className="text-xl">{fromCurrency === "PEN" ? "🇵🇪" : "🇺🇸"}</span>
               <span className="font-semibold">{fromCurrency}</span>
             </div>
           </div>
           {error && <p className="text-sm text-destructive">{error}</p>}
         </div>
 
         {/* Toggle on desktop */}
         <div className="hidden md:flex items-center justify-center">
           <button
             onClick={toggleCurrency}
             className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
           >
             <ArrowDownUp className="h-5 w-5 text-muted-foreground group-hover:text-emerald transition-colors rotate-90" />
           </button>
         </div>
 
         {/* Toggle on mobile */}
         <div className="flex md:hidden justify-center -my-2">
           <button
             onClick={toggleCurrency}
             className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
           >
             <ArrowDownUp className="h-5 w-5 text-muted-foreground group-hover:text-emerald transition-colors" />
           </button>
         </div>
 
         {/* To */}
         <div className="space-y-2 md:col-start-1">
           <label className="text-sm text-muted-foreground">Recibes</label>
           <div className="relative">
             <Input
               type="text"
               value={result}
               readOnly
               className="input-field pr-20 text-lg h-14 font-semibold bg-muted/30"
             />
             <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
               <span className="text-xl">{toCurrency === "PEN" ? "🇵🇪" : "🇺🇸"}</span>
               <span className="font-semibold">{toCurrency}</span>
             </div>
           </div>
         </div>
       </div>
 
       {/* Rate Info */}
       <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center justify-between">
         <div className="flex items-center gap-2 text-sm text-muted-foreground">
           <Info className="h-4 w-4" />
           <span>1 {fromCurrency} = {fromCurrency === "PEN" ? (1/rate).toFixed(4) : rate.toFixed(2)} {toCurrency}</span>
         </div>
         <span className="text-xs text-muted-foreground">Válido por 5 min</span>
       </div>
 
       {/* CTA */}
       <Button 
         onClick={handleStartExchange}
         disabled={!!error || !amount || parseFloat(amount) <= 0}
         className="w-full mt-6 btn-accent h-12 text-base rounded-xl"
       >
         Iniciar Cambio
       </Button>
     </motion.div>
   );
 };