import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { ExchangeWidget } from "@/components/dashboard/ExchangeWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOperations } from "@/components/dashboard/RecentOperations";
import { Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:pl-64">
        <DashboardHeader
          user={user}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Welcome Message */}
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                ¡Hola, {user?.user_metadata?.full_name?.split(" ")[0] || "Usuario"}!
              </h1>
              <p className="text-muted-foreground">
                Bienvenido a tu panel de cambio de divisas
              </p>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Exchange Widget - Takes 2 columns */}
              <div className="lg:col-span-2">
                <ExchangeWidget />
              </div>

              {/* Quick Actions */}
              <div>
                <QuickActions />
              </div>
            </div>

            {/* Recent Operations */}
            <RecentOperations />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;