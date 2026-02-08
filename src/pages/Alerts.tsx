 import { useState, useEffect } from "react";
 import { useNavigate } from "react-router-dom";
 import { motion } from "framer-motion";
 import { supabase } from "@/integrations/supabase/client";
 import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
 import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { useToast } from "@/hooks/use-toast";
 import { Plus, Bell, BellOff, Trash2, Loader2, TrendingUp } from "lucide-react";
 import type { User } from "@supabase/supabase-js";
 
 interface ExchangeAlert {
   id: string;
   target_rate: number;
   is_active: boolean;
   direction: string;
   created_at: string;
 }
 
 const CURRENT_RATE = 3.78;
 
 const Alerts = () => {
   const navigate = useNavigate();
   const { toast } = useToast();
   const [user, setUser] = useState<User | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const [alerts, setAlerts] = useState<ExchangeAlert[]>([]);
   const [isAdding, setIsAdding] = useState(false);
   const [isSaving, setIsSaving] = useState(false);
 
   // Form state
   const [targetRate, setTargetRate] = useState("");
   const [direction, setDirection] = useState<"above" | "below">("above");
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
       if (!session) {
         navigate("/auth");
       } else {
         setUser(session.user);
         loadAlerts(session.user.id);
       }
       setIsLoading(false);
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (!session) {
         navigate("/auth");
       } else {
         setUser(session.user);
         loadAlerts(session.user.id);
       }
       setIsLoading(false);
     });
 
     return () => subscription.unsubscribe();
   }, [navigate]);
 
   const loadAlerts = async (userId: string) => {
     const { data, error } = await supabase
       .from("exchange_alerts")
       .select("*")
       .eq("user_id", userId)
       .order("created_at", { ascending: false });
 
     if (error) {
       console.error("Error loading alerts:", error);
     } else {
       setAlerts(data || []);
     }
   };
 
   const handleAddAlert = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!user) return;
 
     const rate = parseFloat(targetRate);
     if (isNaN(rate) || rate <= 0) {
       toast({
         title: "Tipo de cambio inválido",
         description: "Ingresa un valor mayor a cero.",
         variant: "destructive",
       });
       return;
     }
 
     setIsSaving(true);
 
     const { error } = await supabase.from("exchange_alerts").insert({
       user_id: user.id,
       target_rate: rate,
       direction,
       is_active: true,
     });
 
     if (error) {
       toast({
         title: "Error",
         description: "No se pudo crear la alerta.",
         variant: "destructive",
       });
     } else {
       toast({
         title: "¡Alerta creada!",
         description: `Te notificaremos cuando el TC ${direction === "above" ? "suba a" : "baje a"} S/ ${rate.toFixed(2)}`,
       });
       loadAlerts(user.id);
       setIsAdding(false);
       setTargetRate("");
     }
 
     setIsSaving(false);
   };
 
   const handleToggleAlert = async (alertId: string, isActive: boolean) => {
     const { error } = await supabase
       .from("exchange_alerts")
       .update({ is_active: !isActive })
       .eq("id", alertId);
 
     if (!error && user) {
       loadAlerts(user.id);
     }
   };
 
   const handleDeleteAlert = async (alertId: string) => {
     const { error } = await supabase
       .from("exchange_alerts")
       .delete()
       .eq("id", alertId);
 
     if (error) {
       toast({
         title: "Error",
         description: "No se pudo eliminar la alerta.",
         variant: "destructive",
       });
     } else {
       toast({
         title: "Alerta eliminada",
       });
       if (user) loadAlerts(user.id);
     }
   };
 
   if (isLoading) {
     return (
       <div className="min-h-screen bg-background flex items-center justify-center">
         <Loader2 className="h-8 w-8 animate-spin text-emerald" />
       </div>
     );
   }
 
   return (
     <div className="min-h-screen bg-background">
       <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
 
       <div className="lg:pl-64">
         <DashboardHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} />
 
         <main className="p-4 md:p-6 lg:p-8">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-6"
           >
             {/* Header */}
             <div className="flex items-center justify-between">
               <div>
                 <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                   Alertas de Tipo de Cambio
                 </h1>
                 <p className="text-muted-foreground">
                   Recibe notificaciones cuando el TC alcance tu objetivo
                 </p>
               </div>
               <Button onClick={() => setIsAdding(true)} className="btn-accent">
                 <Plus className="h-4 w-4 mr-2" />
                 Nueva Alerta
               </Button>
             </div>
 
             {/* Current Rate */}
             <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
               <div className="flex items-center justify-between">
                 <div>
                   <p className="text-white/70">Tipo de Cambio Actual</p>
                   <p className="font-display text-4xl font-bold">S/ {CURRENT_RATE.toFixed(2)}</p>
                 </div>
                 <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                   <TrendingUp className="h-4 w-4" />
                   <span className="text-sm font-medium">+0.02</span>
                 </div>
               </div>
             </div>
 
             {/* Add Alert Form */}
             {isAdding && (
               <motion.div
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: "auto" }}
                 className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
               >
                 <h2 className="font-display text-xl font-bold text-foreground mb-4">
                   Crear Nueva Alerta
                 </h2>
                 <form onSubmit={handleAddAlert} className="space-y-4">
                   <div className="grid md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label>Notificarme cuando el TC</Label>
                       <div className="flex gap-2">
                         <Button
                           type="button"
                           variant={direction === "above" ? "default" : "outline"}
                           onClick={() => setDirection("above")}
                           className={direction === "above" ? "bg-emerald hover:bg-emerald/90" : ""}
                         >
                           Suba a
                         </Button>
                         <Button
                           type="button"
                           variant={direction === "below" ? "default" : "outline"}
                           onClick={() => setDirection("below")}
                           className={direction === "below" ? "bg-emerald hover:bg-emerald/90" : ""}
                         >
                           Baje a
                         </Button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Tipo de Cambio Objetivo</Label>
                       <div className="relative">
                         <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                           S/
                         </span>
                         <Input
                           type="number"
                           step="0.01"
                           value={targetRate}
                           onChange={(e) => setTargetRate(e.target.value)}
                           placeholder="3.80"
                           className="input-field pl-8"
                           required
                         />
                       </div>
                     </div>
                   </div>
 
                   <div className="flex gap-3 justify-end">
                     <Button
                       type="button"
                       variant="outline"
                       onClick={() => {
                         setIsAdding(false);
                         setTargetRate("");
                       }}
                     >
                       Cancelar
                     </Button>
                     <Button type="submit" className="btn-accent" disabled={isSaving}>
                       {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                       Crear Alerta
                     </Button>
                   </div>
                 </form>
               </motion.div>
             )}
 
             {/* Alerts List */}
             <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg">
               {alerts.length === 0 ? (
                 <div className="text-center py-12">
                   <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                   <h3 className="font-display text-lg font-bold text-foreground mb-2">
                     No tienes alertas configuradas
                   </h3>
                   <p className="text-muted-foreground mb-4">
                     Crea una alerta para recibir notificaciones cuando el TC te convenga
                   </p>
                   <Button onClick={() => setIsAdding(true)} className="btn-accent">
                     <Plus className="h-4 w-4 mr-2" />
                     Crear Primera Alerta
                   </Button>
                 </div>
               ) : (
                 <div className="space-y-4">
                   {alerts.map((alert) => (
                     <div
                       key={alert.id}
                       className={`flex items-center justify-between p-4 rounded-xl ${
                         alert.is_active ? "bg-muted/30" : "bg-muted/10 opacity-60"
                       }`}
                     >
                       <div className="flex items-center gap-4">
                         <div
                           className={`w-10 h-10 rounded-full flex items-center justify-center ${
                             alert.is_active
                               ? "bg-emerald/20 text-emerald"
                               : "bg-muted text-muted-foreground"
                           }`}
                         >
                           {alert.is_active ? (
                             <Bell className="h-5 w-5" />
                           ) : (
                             <BellOff className="h-5 w-5" />
                           )}
                         </div>
                         <div>
                           <p className="font-semibold text-foreground">
                             TC {alert.direction === "above" ? "suba a" : "baje a"} S/{" "}
                             {alert.target_rate.toFixed(2)}
                           </p>
                           <p className="text-sm text-muted-foreground">
                             {alert.is_active ? "Alerta activa" : "Alerta pausada"}
                           </p>
                         </div>
                       </div>
                       <div className="flex items-center gap-4">
                         <Switch
                           checked={alert.is_active}
                           onCheckedChange={() => handleToggleAlert(alert.id, alert.is_active)}
                         />
                         <Button
                           variant="ghost"
                           size="icon"
                           onClick={() => handleDeleteAlert(alert.id)}
                           className="text-destructive hover:bg-destructive/10"
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
           </motion.div>
         </main>
       </div>
     </div>
   );
 };
 
 export default Alerts;