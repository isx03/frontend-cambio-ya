 import { motion } from "framer-motion";
 import { ExchangeCalculator } from "./ExchangeCalculator";
 import { CheckCircle, Star } from "lucide-react";
 
 export const HeroSection = () => {
   const features = [
     "Sin comisiones ocultas",
     "Transferencia en minutos",
     "Mejor tipo de cambio",
   ];
 
   return (
     <section className="hero-section min-h-screen pt-20 md:pt-24 relative overflow-hidden">
       {/* Background decorations */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-20 left-10 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />
         <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl" />
       </div>
 
       <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
         <div className="grid lg:grid-cols-2 gap-12 items-center">
           {/* Left Content */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center lg:text-left"
           >
             {/* Badge */}
             <motion.div
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
             >
               <Star className="h-4 w-4 text-gold fill-gold" />
               <span className="text-white/90 text-sm font-medium">
                 +10,000 clientes confían en nosotros
               </span>
             </motion.div>
 
             <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
               Cambia tus dólares y soles al{" "}
               <span className="gradient-text">mejor tipo de cambio</span>
             </h1>
 
             <p className="text-lg md:text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0">
               La forma más rápida, segura y económica de cambiar tu dinero. 
               Sin colas, sin comisiones ocultas, directo a tu cuenta.
             </p>
 
             {/* Features List */}
             <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
               {features.map((feature, index) => (
                 <motion.div
                   key={feature}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: 0.4 + index * 0.1 }}
                   className="flex items-center gap-2"
                 >
                   <CheckCircle className="h-5 w-5 text-emerald" />
                   <span className="text-white/80">{feature}</span>
                 </motion.div>
               ))}
             </div>
 
             {/* Trust Stats */}
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.7 }}
               className="flex flex-wrap gap-8 justify-center lg:justify-start"
             >
               <div>
                 <p className="font-display text-3xl font-bold text-white">S/ 50M+</p>
                 <p className="text-white/60 text-sm">Cambiados</p>
               </div>
               <div>
                 <p className="font-display text-3xl font-bold text-white">4.9 ★</p>
                 <p className="text-white/60 text-sm">Calificación</p>
               </div>
               <div>
                 <p className="font-display text-3xl font-bold text-white">5 min</p>
                 <p className="text-white/60 text-sm">Promedio</p>
               </div>
             </motion.div>
           </motion.div>
 
           {/* Right Content - Calculator */}
           <div className="flex justify-center lg:justify-end">
             <ExchangeCalculator />
           </div>
         </div>
       </div>
 
       {/* Bottom Wave */}
       <div className="absolute bottom-0 left-0 right-0">
         <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path
             d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
             className="fill-background"
           />
         </svg>
       </div>
     </section>
   );
 };