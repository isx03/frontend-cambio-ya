 import { motion } from "framer-motion";
 import { CreditCard, Bell, History, HelpCircle } from "lucide-react";
 import { Link } from "react-router-dom";
 
 const actions = [
   {
     icon: CreditCard,
     label: "Mis Cuentas",
     description: "Gestiona tus cuentas bancarias",
     path: "/accounts",
     color: "bg-blue-500/10 text-blue-500",
   },
   {
     icon: Bell,
     label: "Crear Alerta",
     description: "Avísame cuando el TC sea favorable",
     path: "/alerts",
     color: "bg-amber-500/10 text-amber-500",
   },
   {
     icon: History,
     label: "Historial",
     description: "Ver operaciones anteriores",
     path: "/history",
     color: "bg-purple-500/10 text-purple-500",
   },
   {
     icon: HelpCircle,
     label: "Ayuda",
     description: "Centro de soporte",
     path: "/help",
     color: "bg-emerald/10 text-emerald",
   },
 ];
 
 export const QuickActions = () => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.1 }}
       className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
     >
       <h2 className="font-display text-xl font-bold text-foreground mb-4">
         Acciones Rápidas
       </h2>
 
       <div className="space-y-3">
         {actions.map((action) => (
           <Link
             key={action.path}
             to={action.path}
             className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors group"
           >
             <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
               <action.icon className="h-5 w-5" />
             </div>
             <div className="flex-1">
               <p className="font-medium text-foreground group-hover:text-emerald transition-colors">
                 {action.label}
               </p>
               <p className="text-sm text-muted-foreground">
                 {action.description}
               </p>
             </div>
           </Link>
         ))}
       </div>
     </motion.div>
   );
 };