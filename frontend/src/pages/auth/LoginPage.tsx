import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-hot-toast";
import { KeyRound, Mail, Sparkles, AlertCircle } from "lucide-react";

export function LoginPage() {
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: searchParams.get("email") || "user@store.com",
      password: "password"
    }
  });

  const onSubmit = async (values: any) => {
    setServerError(null);
    try {
      const res = await login(values);
      
      // 🛠️ ĐÃ SỬA: Chấp nhận cả "SUCCESS" (chuẩn mới) lẫn "OK" (chuẩn cũ phòng hờ)
      if (res?.status === "SUCCESS" || res?.status === "OK") {
        toast.success("Refreshed authentication state! Welcome.");
        navigate("/");
      } else {
        setServerError(res?.message || "Đăng nhập không thành công.");
      }
    } catch (err: any) {
      setServerError(err?.response?.data?.message || "Invalid credentials pairing.");
    }
  };

  const applyDemo = (email: string, pass: string) => {
    setValue("email", email);
    setValue("password", pass);
    toast.success(`Loaded ${email === "admin@store.com" ? "Admin" : "Regular User"} demo values!`);
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-indigo-600">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            E
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
          Sign in to TechStore
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Or{" "}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition">
            create a brand new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-100 rounded-3xl sm:px-10">
          {/* Demo Credentials Helper Box */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100/50 space-y-3">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700">
              <Sparkles className="w-4 h-4 animate-ping" />
              <span>Sandbox Demo Accounts:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                id="apply-demo-user"
                type="button"
                onClick={() => applyDemo("user@store.com", "password")}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 transition shadow-sm text-left"
              >
                👤 Regular User
                <span className="block text-[10px] font-mono text-slate-400 truncate">user@store.com</span>
              </button>
              <button
                id="apply-demo-admin"
                type="button"
                onClick={() => applyDemo("admin@store.com", "admin")}
                className="p-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-medium text-indigo-700 transition shadow-sm text-left"
              >
                🚀 Store Admin
                <span className="block text-[10px] font-mono text-slate-400 truncate">admin@store.com</span>
              </button>
            </div>
          </div>

          {serverError && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-2.5 text-xs text-red-600">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required.",
                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email syntax" }
                  })}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition ${
                    errors.email ? "border-red-300 focus:border-red-500" : "border-slate-200"
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  {...register("password", { required: "Password is required." })}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition ${
                    errors.password ? "border-red-300 focus:border-red-500" : "border-slate-200"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            <div>
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingIn ? "Signing you in..." : "Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;