 import { useState, useEffect } from "react";
 import { motion } from "framer-motion";
 import { ArrowDownUp, TrendingUp, Clock, Shield } from "lucide-react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Link } from "react-router-dom";
 
 // Tipo de cambio simulado (en producción vendría de API)
 const EXCHANGE_RATES = {
   buy: 3.72,  // Compra: USD -> PEN
   sell: 3.78, // Venta: PEN -> USD
 };
 
 export const ExchangeCalculator = () => {
   const [fromCurrency, setFromCurrency] = useState<"PEN" | "USD">("PEN");
   const [amount, setAmount] = useState<string>("1000");
   const [result, setResult] = useState<string>("0");
 
   const toCurrency = fromCurrency === "PEN" ? "USD" : "PEN";
   const rate = fromCurrency === "PEN" ? EXCHANGE_RATES.sell : EXCHANGE_RATES.buy;
 
   useEffect(() => {
     const numAmount = parseFloat(amount) || 0;
     const converted = fromCurrency === "PEN" 
       ? numAmount / rate 
       : numAmount * rate;
     setResult(converted.toFixed(2));
   }, [amount, fromCurrency, rate]);
 
   const toggleCurrency = () => {
     setFromCurrency(fromCurrency === "PEN" ? "USD" : "PEN");
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       transition={{ duration: 0.6, delay: 0.3 }}
       className="exchange-card max-w-md w-full mx-auto"
     >
       {/* Header con tipo de cambio actual */}
       <div className="flex items-center justify-between mb-6">
         <div>
           <p className="text-sm text-muted-foreground">Tipo de cambio</p>
           <p className="font-display text-2xl font-bold text-foreground">
             S/ {EXCHANGE_RATES.sell.toFixed(2)}
           </p>
         </div>
         <div className="flex items-center gap-2 bg-emerald/10 text-emerald px-3 py-1 rounded-full">
           <TrendingUp className="h-4 w-4" />
           <span className="text-sm font-medium">+0.02</span>
         </div>
       </div>
 
       {/* From Currency */}
       <div className="space-y-2">
         <label className="text-sm text-muted-foreground">Envías</label>
         <div className="relative">
           <Input
             type="number"
             value={amount}
             onChange={(e) => setAmount(e.target.value)}
             className="input-field pr-20 text-lg h-14 font-semibold"
             placeholder="0.00"
           />
           <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <span className="text-2xl">{fromCurrency === "PEN" ? "🇵🇪" : "🇺🇸"}</span>
             <span className="font-semibold text-foreground">{fromCurrency}</span>
           </div>
         </div>
       </div>
 
       {/* Toggle Button */}
       <div className="flex justify-center my-4">
         <button
           onClick={toggleCurrency}
           className="p-3 rounded-full bg-muted hover:bg-muted/80 transition-colors group"
         >
           <ArrowDownUp className="h-5 w-5 text-muted-foreground group-hover:text-emerald transition-colors" />
         </button>
       </div>
 
       {/* To Currency */}
       <div className="space-y-2">
         <label className="text-sm text-muted-foreground">Recibes</label>
         <div className="relative">
           <Input
             type="text"
             value={result}
             readOnly
             className="input-field pr-20 text-lg h-14 font-semibold bg-muted/30"
           />
           <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
             <span className="text-2xl">{toCurrency === "PEN" ? "🇵🇪" : "🇺🇸"}</span>
             <span className="font-semibold text-foreground">{toCurrency}</span>
           </div>
         </div>
       </div>
 
       {/* Rate Info */}
       <div className="mt-4 p-3 bg-muted/50 rounded-lg">
         <p className="text-sm text-muted-foreground text-center">
           1 {fromCurrency} = {fromCurrency === "PEN" ? (1/rate).toFixed(4) : rate.toFixed(2)} {toCurrency}
         </p>
       </div>
 
       {/* CTA Button */}
       <Link to="/auth?mode=signup" className="block mt-6">
         <Button className="w-full btn-accent h-14 text-lg rounded-xl">
           Iniciar Cambio
         </Button>
       </Link>
 
       {/* Trust Indicators */}
       <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
         <div className="flex items-center gap-1">
           <Clock className="h-4 w-4" />
           <span>5 min</span>
         </div>
         <div className="flex items-center gap-1">
           <Shield className="h-4 w-4" />
           <span>100% seguro</span>
         </div>
       </div>
     </motion.div>
   );
 };