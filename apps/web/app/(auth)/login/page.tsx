"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Por favor, ingresa un correo válido."),
  password: z.string().min(1, "La contraseña es requerida."),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas. Por favor, intenta de nuevo.");
    } else {
      router.push("/api/auth/login-redirect");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    await signIn("google", { callbackUrl: "/api/auth/login-redirect" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl border border-stone-200/60 p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md w-full mx-auto mt-20"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-display font-bold text-stone-900 mb-2">Bienvenido de vuelta</h1>
        <p className="text-stone-500 font-medium text-sm">Inicia sesión en tu cuenta de BEAN</p>
      </div>

      <button
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isLoading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 font-bold py-3 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6 shadow-sm"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continuar con Google
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px bg-stone-200 flex-1"></div>
        <span className="text-stone-400 font-medium text-sm">o con email</span>
        <div className="h-px bg-stone-200 flex-1"></div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 font-medium p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        <div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="tu@email.com"
              className="w-full bg-white border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-stone-400 font-medium shadow-sm"
            />
          </div>
          {errors.email && <p className="text-red-500 font-medium text-xs mt-1 ml-2">{errors.email.message}</p>}
        </div>

        <div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className="w-full bg-white border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-stone-900 rounded-2xl py-3 pl-12 pr-4 outline-none transition-all placeholder:text-stone-400 font-medium shadow-sm"
            />
          </div>
          {errors.password && <p className="text-red-500 font-medium text-xs mt-1 ml-2">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-3 px-4 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 shadow-[0_4px_14px_0_rgba(0,0,0,0.1)]"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              Iniciar Sesión
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <p className="text-center font-medium text-stone-500 text-sm mt-8">
        ¿No tienes una cuenta?{" "}
        <Link href="/register" className="text-stone-900 hover:text-emerald-600 font-bold transition-colors">
          Regístrate
        </Link>
      </p>
    </motion.div>
  );
}
