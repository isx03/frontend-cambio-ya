 import { motion } from "framer-motion";
 import { UserPlus, Calculator, CreditCard, CheckCircle } from "lucide-react";
 
 const steps = [
   {
     icon: UserPlus,
     title: "Crea tu cuenta",
     description: "Regístrate en menos de 2 minutos con tu DNI y datos básicos.",
   },
   {
     icon: Calculator,
     title: "Simula tu cambio",
     description: "Ingresa el monto y visualiza el tipo de cambio en tiempo real.",
   },
   {
     icon: CreditCard,
     title: "Transfiere",
     description: "Envía el dinero desde tu cuenta bancaria registrada.",
   },
   {
     icon: CheckCircle,
     title: "Recibe tu dinero",
     description: "Recibes el monto convertido en tu cuenta destino en minutos.",
   },
 ];
 
 export const HowItWorks = () => {
   return (
     <section id="como-funciona" className="py-20 bg-background">
       <div className="container mx-auto px-4">
         {/* Section Header */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-16"
         >
           <span className="inline-block text-emerald font-semibold mb-2">PROCESO SIMPLE</span>
           <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
             ¿Cómo funciona?
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             En solo 4 simples pasos, realiza tu cambio de divisas de forma segura y rápida.
           </p>
         </motion.div>
 
         {/* Steps Grid */}
         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {steps.map((step, index) => (
             <motion.div
               key={step.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="relative"
             >
               {/* Connector Line */}
               {index < steps.length - 1 && (
                 <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-emerald/50 to-emerald/20" />
               )}
 
               <div className="relative bg-card rounded-2xl p-6 border border-border/50 hover:border-emerald/30 transition-colors group">
                 {/* Step Number */}
                 <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-emerald text-white font-bold text-sm flex items-center justify-center">
                   {index + 1}
                 </div>
 
                 {/* Icon */}
                 <div className="w-16 h-16 rounded-2xl bg-emerald/10 flex items-center justify-center mb-4 group-hover:bg-emerald/20 transition-colors">
                   <step.icon className="h-8 w-8 text-emerald" />
                 </div>
 
                 <h3 className="font-display text-xl font-bold text-foreground mb-2">
                   {step.title}
                 </h3>
                 <p className="text-muted-foreground">
                   {step.description}
                 </p>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };