 import { Link } from "react-router-dom";
 
 export const Footer = () => {
   return (
     <footer className="bg-primary text-white py-12">
       <div className="container mx-auto px-4">
         <div className="grid md:grid-cols-4 gap-8 mb-8">
           {/* Brand */}
           <div className="col-span-2 md:col-span-1">
             <Link to="/" className="flex items-center gap-2 mb-4">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
                 <span className="text-white font-display font-bold text-xl">C</span>
               </div>
               <span className="font-display font-bold text-xl">
                 Cambio<span className="text-emerald">Ya</span>
               </span>
             </Link>
             <p className="text-white/60 text-sm">
               La forma más rápida y segura de cambiar tus soles y dólares.
             </p>
           </div>
 
           {/* Links */}
           <div>
             <h4 className="font-semibold mb-4">Producto</h4>
             <ul className="space-y-2 text-white/60 text-sm">
               <li><a href="#como-funciona" className="hover:text-white transition-colors">Cómo funciona</a></li>
               <li><a href="#tasas" className="hover:text-white transition-colors">Tasas</a></li>
               <li><a href="#seguridad" className="hover:text-white transition-colors">Seguridad</a></li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold mb-4">Empresa</h4>
             <ul className="space-y-2 text-white/60 text-sm">
               <li><a href="#" className="hover:text-white transition-colors">Sobre nosotros</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
             </ul>
           </div>
 
           <div>
             <h4 className="font-semibold mb-4">Legal</h4>
             <ul className="space-y-2 text-white/60 text-sm">
               <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
               <li><a href="#" className="hover:text-white transition-colors">Reclamos</a></li>
             </ul>
           </div>
         </div>
 
         <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
           <p className="text-white/40 text-sm">
             © 2025 CambioYa. Todos los derechos reservados.
           </p>
           <div className="flex items-center gap-4">
             <span className="text-white/40 text-sm">Regulado por la SBS</span>
           </div>
         </div>
       </div>
     </footer>
   );
 };