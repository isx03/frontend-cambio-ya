import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, CreditCard, Trash2, Loader2 } from "lucide-react";
import type { User } from "@supabase/supabase-js";

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  currency: string;
  account_type: string;
}

const BANKS = [
  "BCP",
  "BBVA",
  "Interbank",
  "Scotiabank",
  "BanBif",
  "Banco de la Nación",
  "Otro",
];

const BankAccounts = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [currency, setCurrency] = useState("PEN");
  const [accountType, setAccountType] = useState("savings");

  const loadAccounts = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/bank_accounts?user_id=${userId}`);
      if (!response.ok) {
        throw new Error("Error al cargar cuentas");
      }
      const data = await response.json();
      setAccounts(data || []);
    } catch (error) {
      console.error("Error loading accounts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las cuentas bancarias.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      loadAccounts(userObj.id);
    }

    setIsLoading(false);
  }, [navigate, loadAccounts]);

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);

    // Check if account already exists
    const exists = accounts.some(
      (acc) => acc.account_number === accountNumber && acc.bank_name === bankName
    );

    if (exists) {
      toast({
        title: "Cuenta duplicada",
        description: "Esta cuenta bancaria ya ha sido registrada.",
        variant: "destructive",
      });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/bank_accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          bank_name: bankName,
          account_number: accountNumber,
          currency: currency,
          account_type: accountType,
        }),
      });

      toast({
        title: "¡Cuenta registrada!",
        description: "Tu cuenta bancaria ha sido agregada correctamente.",
      });
      loadAccounts(user.id);
      setIsAdding(false);
      resetForm();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la cuenta.",
        variant: "destructive",
      });
    }

    setIsSaving(false);
  };

  const handleDeleteAccount = async (accountId: string) => {
    const { error } = await supabase
      .from("bank_accounts")
      .delete()
      .eq("id", accountId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la cuenta.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Cuenta eliminada",
        description: "La cuenta bancaria ha sido eliminada.",
      });
      if (user) loadAccounts(user.id);
    }
  };

  const resetForm = () => {
    setBankName("");
    setAccountNumber("");
    setCurrency("PEN");
    setAccountType("savings");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-64">
        <DashboardHeader user={user} onMenuClick={() => setIsSidebarOpen(true)} />

        <main className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                  Mis Cuentas Bancarias
                </h1>
                <p className="text-muted-foreground">
                  Gestiona las cuentas para tus operaciones de cambio
                </p>
              </div>
              <Button onClick={() => setIsAdding(true)} className="btn-accent">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Cuenta
              </Button>
            </div>

            {/* Add Account Form */}
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg"
              >
                <h2 className="font-display text-xl font-bold text-foreground mb-4">
                  Nueva Cuenta Bancaria
                </h2>
                <form onSubmit={handleAddAccount} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bank">Banco</Label>
                    <Select value={bankName} onValueChange={setBankName} required>
                      <SelectTrigger className="input-field">
                        <SelectValue placeholder="Selecciona un banco" />
                      </SelectTrigger>
                      <SelectContent>
                        {BANKS.map((bank) => (
                          <SelectItem key={bank} value={bank}>
                            {bank}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Número de Cuenta</Label>
                    <Input
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                      placeholder="191-12345678-0-12"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PEN">🇵🇪 Soles (PEN)</SelectItem>
                        <SelectItem value="USD">🇺🇸 Dólares (USD)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountType">Tipo de Cuenta</Label>
                    <Select value={accountType} onValueChange={setAccountType}>
                      <SelectTrigger className="input-field">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savings">Ahorros</SelectItem>
                        <SelectItem value="checking">Corriente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAdding(false);
                        resetForm();
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" className="btn-accent" disabled={isSaving}>
                      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Guardar Cuenta
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Accounts List */}
            <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-lg">
              {accounts.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    No tienes cuentas registradas
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Agrega tu primera cuenta bancaria para empezar a operar
                  </p>
                  <Button onClick={() => setIsAdding(true)} className="btn-accent">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Cuenta
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {account.bank_name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {account.account_number} • {account.currency}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground capitalize">
                          {account.account_type === "savings" ? "Ahorros" : "Corriente"}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAccount(account.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default BankAccounts;