 import { useState, useEffect } from "react";
 import { useSearchParams, useNavigate, Link } from "react-router-dom";
 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { useToast } from "@/hooks/use-toast";
 import { supabase } from "@/integrations/supabase/client";
 import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
 
 const Auth = () => {
   const [searchParams] = useSearchParams();
   const navigate = useNavigate();
   const { toast } = useToast();
   const [isLogin, setIsLogin] = useState(searchParams.get("mode") !== "signup");
   const [isLoading, setIsLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
 
   // Form fields
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [dni, setDni] = useState("");
 
   useEffect(() => {
     // Check if user is already logged in
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session) {
         navigate("/dashboard");
       }
     });
   }, [navigate]);
 
   const validateDNI = (dni: string) => {
     return /^\d{8}$/.test(dni);
   };
 
   const handleLogin = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     try {
       const { error } = await supabase.auth.signInWithPassword({
         email,
         password,
       });
 
       if (error) throw error;
 
       toast({
         title: "¡Bienvenido!",
         description: "Has iniciado sesión correctamente.",
       });
       navigate("/dashboard");
     } catch (error: any) {
       toast({
         title: "Error al iniciar sesión",
         description: error.message === "Invalid login credentials" 
           ? "Correo o contraseña incorrectos" 
           : error.message,
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   const handleSignup = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsLoading(true);
 
     // Validate DNI format
     if (!validateDNI(dni)) {
       toast({
         title: "DNI inválido",
         description: "El DNI debe tener exactamente 8 dígitos.",
         variant: "destructive",
       });
       setIsLoading(false);
       return;
     }
 
     try {
       const { error } = await supabase.auth.signUp({
         email,
         password,
         options: {
           data: {
             full_name: fullName,
             dni: dni,
           },
           emailRedirectTo: window.location.origin,
         },
       });
 
       if (error) throw error;
 
       toast({
         title: "¡Cuenta creada!",
         description: "Por favor revisa tu correo para confirmar tu cuenta.",
       });
     } catch (error: any) {
       toast({
         title: "Error al crear cuenta",
         description: error.message,
         variant: "destructive",
       });
     } finally {
       setIsLoading(false);
     }
   };
 
   return (
     <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center p-4">
       {/* Background Decorations */}
       <div className="absolute inset-0 overflow-hidden">
         <div className="absolute top-20 left-10 w-72 h-72 bg-emerald/10 rounded-full blur-3xl" />
         <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
       </div>
 
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         className="w-full max-w-md relative z-10"
       >
         {/* Back Link */}
         <Link
           to="/"
           className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
         >
           <ArrowLeft className="h-4 w-4" />
           Volver al inicio
         </Link>
 
         {/* Card */}
         <div className="bg-card rounded-2xl p-8 shadow-xl border border-border/50">
           {/* Logo */}
           <div className="flex items-center justify-center gap-2 mb-8">
             <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald to-emerald-light flex items-center justify-center">
               <span className="text-white font-display font-bold text-2xl">C</span>
             </div>
             <span className="font-display font-bold text-2xl text-foreground">
               Cambio<span className="text-emerald">Ya</span>
             </span>
           </div>
 
           {/* Tabs */}
           <div className="flex gap-2 mb-8 p-1 bg-muted rounded-lg">
             <button
               onClick={() => setIsLogin(true)}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                 isLogin
                   ? "bg-card text-foreground shadow-sm"
                   : "text-muted-foreground hover:text-foreground"
               }`}
             >
               Iniciar Sesión
             </button>
             <button
               onClick={() => setIsLogin(false)}
               className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                 !isLogin
                   ? "bg-card text-foreground shadow-sm"
                   : "text-muted-foreground hover:text-foreground"
               }`}
             >
               Crear Cuenta
             </button>
           </div>
 
           {/* Form */}
           <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
             {!isLogin && (
               <>
                 <div className="space-y-2">
                   <Label htmlFor="fullName">Nombre Completo</Label>
                   <Input
                     id="fullName"
                     type="text"
                     placeholder="Juan Pérez García"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     required
                     className="input-field"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="dni">DNI</Label>
                   <Input
                     id="dni"
                     type="text"
                     placeholder="12345678"
                     value={dni}
                     onChange={(e) => setDni(e.target.value.replace(/\D/g, "").slice(0, 8))}
                     required
                     className="input-field"
                     maxLength={8}
                   />
                 </div>
               </>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="email">Correo Electrónico</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="tu@correo.com"
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
                 required
                 className="input-field"
               />
             </div>
 
             <div className="space-y-2">
               <Label htmlFor="password">Contraseña</Label>
               <div className="relative">
                 <Input
                   id="password"
                   type={showPassword ? "text" : "password"}
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="input-field pr-10"
                   minLength={6}
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>
 
             <Button
               type="submit"
               className="w-full btn-accent h-12 text-base rounded-xl"
               disabled={isLoading}
             >
               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
             </Button>
           </form>
 
           {/* Footer */}
           <p className="text-center text-sm text-muted-foreground mt-6">
             {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
             <button
               onClick={() => setIsLogin(!isLogin)}
               className="text-emerald hover:underline font-medium"
             >
               {isLogin ? "Regístrate aquí" : "Inicia sesión"}
             </button>
           </p>
         </div>
       </motion.div>
     </div>
   );
 };
 
 export default Auth;