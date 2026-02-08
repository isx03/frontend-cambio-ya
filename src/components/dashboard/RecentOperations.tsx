 import { motion } from "framer-motion";
 import { ArrowUpRight, ArrowDownLeft, Clock } from "lucide-react";
 
 // Datos de ejemplo - en producción vendrían de la base de datos
 const recentOperations = [
   {
     id: 1,
     type: "sell",
     fromAmount: 1000,
     fromCurrency: "PEN",
     toAmount: 264.55,
     toCurrency: "USD",
     date: "2025-02-05",
     status: "completed",
   },
   {
     id: 2,
     type: "buy",
     fromAmount: 500,
     fromCurrency: "USD",
     toAmount: 1860.00,
     toCurrency: "PEN",
     date: "2025-02-04",
     status: "completed",
   },
 ];
 
 export const RecentOperations = () => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ delay: 0.2 }}
       className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
     >
       <div className="flex items-center justify-between mb-4">
         <h2 className="font-display text-xl font-bold text-foreground">
           Operaciones Recientes
         </h2>
         <a href="/history" className="text-sm text-emerald hover:underline">
           Ver todo
         </a>
       </div>
 
       {recentOperations.length === 0 ? (
         <div className="text-center py-8">
           <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
           <p className="text-muted-foreground">
             No tienes operaciones recientes
           </p>
           <p className="text-sm text-muted-foreground">
             Realiza tu primer cambio para verlo aquí
           </p>
         </div>
       ) : (
         <div className="space-y-4">
           {recentOperations.map((op) => (
             <div
               key={op.id}
               className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
             >
               <div className="flex items-center gap-4">
                 <div
                   className={`w-10 h-10 rounded-full flex items-center justify-center ${
                     op.type === "sell"
                       ? "bg-red-500/10 text-red-500"
                       : "bg-emerald/10 text-emerald"
                   }`}
                 >
                   {op.type === "sell" ? (
                     <ArrowUpRight className="h-5 w-5" />
                   ) : (
                     <ArrowDownLeft className="h-5 w-5" />
                   )}
                 </div>
                 <div>
                   <p className="font-medium text-foreground">
                     {op.type === "sell" ? "Vendiste" : "Compraste"} {op.fromCurrency}
                   </p>
                   <p className="text-sm text-muted-foreground">{op.date}</p>
                 </div>
               </div>
               <div className="text-right">
                 <p className="font-semibold text-foreground">
                   {op.toCurrency === "USD" ? "$" : "S/"} {op.toAmount.toFixed(2)}
                 </p>
                 <p className="text-sm text-muted-foreground">
                   {op.fromCurrency === "USD" ? "$" : "S/"} {op.fromAmount.toFixed(2)}
                 </p>
               </div>
             </div>
           ))}
         </div>
       )}
     </motion.div>
   );
 };