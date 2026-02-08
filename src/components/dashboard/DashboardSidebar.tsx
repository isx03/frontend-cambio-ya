 import { Link, useLocation } from "react-router-dom";
 import { motion, AnimatePresence } from "framer-motion";
 import {
   LayoutDashboard,
   ArrowLeftRight,
   CreditCard,
   Bell,
   History,
   Settings,
   X,
 } from "lucide-react";
 
 const menuItems = [
   { icon: LayoutDashboard, label: "Inicio", path: "/dashboard" },
   { icon: ArrowLeftRight, label: "Cambiar Moneda", path: "/exchange" },
   { icon: CreditCard, label: "Mis Cuentas", path: "/accounts" },
   { icon: Bell, label: "Alertas", path: "/alerts" },
   { icon: History, label: "Historial", path: "/history" },
   { icon: Settings, label: "Configuración", path: "/settings" },
 ];
 
 interface DashboardSidebarProps {
   isOpen: boolean;
   onClose: () => void;
 }
 
 export const DashboardSidebar = ({ isOpen, onClose }: DashboardSidebarProps) => {
   const location = useLocation();
 
   return (
     <>
       {/* Mobile Overlay */}
       <AnimatePresence>
         {isOpen && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             onClick={onClose}
             className="lg:hidden fixed inset-0 bg-black/50 z-40"
           />
         )}
       </AnimatePresence>
 
       {/* Sidebar */}
       <aside
         className={`fixed top-0 left-0 h-full w-64 bg-sidebar z-50 transform transition-transform duration-300 lg:translate-x-0 ${
           isOpen ? "translate-x-0" : "-translate-x-full"
         }`}
       >
         <div className="flex flex-col h-full">
           {/* Header */}
           <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
             <Link to="/" className="flex items-center gap-2">
               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
                 <span className="text-white font-display font-bold text-xl">C</span>
               </div>
               <span className="font-display font-bold text-lg text-sidebar-foreground">
                 Cambio<span className="text-emerald">Ya</span>
               </span>
             </Link>
             <button
               onClick={onClose}
               className="lg:hidden p-1 hover:bg-sidebar-accent rounded"
             >
               <X className="h-5 w-5 text-sidebar-foreground" />
             </button>
           </div>
 
           {/* Navigation */}
           <nav className="flex-1 p-4 space-y-1">
             {menuItems.map((item) => {
               const isActive = location.pathname === item.path;
               return (
                 <Link
                   key={item.path}
                   to={item.path}
                   onClick={onClose}
                   className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                     isActive
                       ? "bg-sidebar-primary text-sidebar-primary-foreground"
                       : "text-sidebar-foreground hover:bg-sidebar-accent"
                   }`}
                 >
                   <item.icon className="h-5 w-5" />
                   <span className="font-medium">{item.label}</span>
                 </Link>
               );
             })}
           </nav>
 
           {/* Footer */}
           <div className="p-4 border-t border-sidebar-border">
             <div className="bg-sidebar-accent rounded-lg p-4">
               <p className="text-sm text-sidebar-foreground font-medium mb-1">
                 ¿Necesitas ayuda?
               </p>
               <p className="text-xs text-sidebar-foreground/70">
                 Contáctanos al WhatsApp
               </p>
             </div>
           </div>
         </div>
       </aside>
     </>
   );
 };