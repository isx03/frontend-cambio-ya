 import { Link } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { ArrowRight, Menu, X } from "lucide-react";
 import { useState } from "react";
 import { motion, AnimatePresence } from "framer-motion";
 
 export const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
 
   return (
     <header className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md border-b border-white/10">
       <div className="container mx-auto px-4">
         <div className="flex items-center justify-between h-16 md:h-20">
           {/* Logo */}
           <Link to="/" className="flex items-center gap-2">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
               <span className="text-white font-display font-bold text-xl">C</span>
             </div>
             <span className="font-display font-bold text-xl text-white">
               Cambio<span className="text-emerald">Ya</span>
             </span>
           </Link>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-8">
             <a href="#como-funciona" className="text-white/80 hover:text-white transition-colors font-medium">
               Cómo funciona
             </a>
             <a href="#tasas" className="text-white/80 hover:text-white transition-colors font-medium">
               Tasas
             </a>
             <a href="#seguridad" className="text-white/80 hover:text-white transition-colors font-medium">
               Seguridad
             </a>
           </nav>
 
           {/* Desktop CTA */}
           <div className="hidden md:flex items-center gap-4">
             <Link to="/auth">
               <Button variant="ghost" className="text-white hover:bg-white/10">
                 Iniciar Sesión
               </Button>
             </Link>
             <Link to="/auth?mode=signup">
               <Button className="btn-accent rounded-full px-6">
                 Crear Cuenta
                 <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
             </Link>
           </div>
 
           {/* Mobile Menu Button */}
           <button
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             className="md:hidden text-white p-2"
           >
             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
           </button>
         </div>
       </div>
 
       {/* Mobile Menu */}
       <AnimatePresence>
         {isMenuOpen && (
           <motion.div
             initial={{ opacity: 0, height: 0 }}
             animate={{ opacity: 1, height: "auto" }}
             exit={{ opacity: 0, height: 0 }}
             className="md:hidden bg-primary border-t border-white/10"
           >
             <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
               <a href="#como-funciona" className="text-white/80 hover:text-white py-2">
                 Cómo funciona
               </a>
               <a href="#tasas" className="text-white/80 hover:text-white py-2">
                 Tasas
               </a>
               <a href="#seguridad" className="text-white/80 hover:text-white py-2">
                 Seguridad
               </a>
               <hr className="border-white/10" />
               <Link to="/auth" className="w-full">
                 <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                   Iniciar Sesión
                 </Button>
               </Link>
               <Link to="/auth?mode=signup" className="w-full">
                 <Button className="w-full btn-accent rounded-full">
                   Crear Cuenta
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </Button>
               </Link>
             </div>
           </motion.div>
         )}
       </AnimatePresence>
     </header>
   );
 };