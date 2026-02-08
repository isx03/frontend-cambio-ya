 import { motion } from "framer-motion";
 import { Shield, Zap, Bell, Wallet, LineChart, Lock } from "lucide-react";
 
 const features = [
   {
     icon: Shield,
     title: "100% Seguro",
     description: "Tus operaciones están protegidas con encriptación de nivel bancario.",
   },
   {
     icon: Zap,
     title: "Ultra Rápido",
     description: "Recibe tu dinero en minutos, no en horas o días.",
   },
   {
     icon: Bell,
     title: "Alertas Personalizadas",
     description: "Configura alertas y te notificamos cuando el tipo de cambio te convenga.",
   },
   {
     icon: Wallet,
     title: "Sin Comisiones Ocultas",
     description: "El tipo de cambio que ves es el que obtienes, sin sorpresas.",
   },
   {
     icon: LineChart,
     title: "Mejor Tipo de Cambio",
     description: "Comparamos con el mercado para darte siempre el mejor precio.",
   },
   {
     icon: Lock,
     title: "Datos Protegidos",
     description: "Tu información personal está segura y nunca se comparte.",
   },
 ];
 
 export const Features = () => {
   return (
     <section id="seguridad" className="py-20 bg-muted/30">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <span className="inline-block text-emerald font-semibold mb-2">¿POR QUÉ ELEGIRNOS?</span>
           <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
             Ventajas de usar CambioYa
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Diseñado para darte la mejor experiencia en cambio de divisas.
           </p>
         </motion.div>
 
         {/* Features Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <motion.div
               key={feature.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="bg-card rounded-2xl p-6 border border-border/50 hover:shadow-lg hover:border-emerald/30 transition-all group"
             >
               <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald/20 to-emerald/10 flex items-center justify-center mb-4 group-hover:from-emerald/30 group-hover:to-emerald/20 transition-colors">
                 <feature.icon className="h-6 w-6 text-emerald" />
               </div>
               <h3 className="font-display text-lg font-bold text-foreground mb-2">
                 {feature.title}
               </h3>
               <p className="text-muted-foreground text-sm">
                 {feature.description}
               </p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };