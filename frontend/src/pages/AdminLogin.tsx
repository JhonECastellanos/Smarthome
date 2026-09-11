import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { loginDemo } from "../api";

export default function AdminLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      navigate("/admin/dashboard", { replace: true });
      return;
    }

    fetch("/api/health", { signal: AbortSignal.timeout(2000) })
      .then((r) => {
        if (r.ok) {
          navigate("/admin/dashboard", { replace: true });
        } else {
          enterDemo();
        }
      })
      .catch(() => enterDemo());

    function enterDemo() {
      const res = loginDemo();
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_user", JSON.stringify(res.user));
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="text-center">
        <Loader2 size={32} className="mx-auto animate-spin text-cyan-400" />
        <p className="mt-4 text-sm text-slate-400">Verificando conexión...</p>
      </div>
    </main>
  );
}
