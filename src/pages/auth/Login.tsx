import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { LoomIcon } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { authService } from "@/services/authService";
import { useUserStore } from "@/store/userStore";

export default function Login() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAs, setLoginAs] = useState<"admin" | "user">("admin");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "", remember: false },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const user = await authService.login({ ...values, loginAs });
      login(user);
      toast.success("Welcome back!", { description: `Signed in as ${user.name}` });
      navigate(loginAs === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error("Sign in failed", { description: err instanceof Error ? err.message : "Please try again." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <LoomIcon className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">Loom</span>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Sign in to your workspace to continue</p>
      </div>

      <div className="rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs text-primary-700 dark:border-primary-500/20 dark:bg-primary-500/10 dark:text-primary-400">
        Demo mode — enter any username &amp; password to sign in.
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label>Sign in as</Label>
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-muted p-1">
            <button
              type="button"
              onClick={() => setLoginAs("admin")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
                loginAs === "admin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={loginAs === "admin"}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </button>
            <button
              type="button"
              onClick={() => setLoginAs("user")}
              className={cn(
                "flex items-center justify-center gap-1.5 rounded-md py-1.5 text-sm font-medium transition-colors",
                loginAs === "user"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={loginAs === "user"}
            >
              <UserIcon className="h-4 w-4" />
              User
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="username">Username</Label>
          <Input id="username" type="text" placeholder={loginAs === "admin" ? "Admin" : "you@loom.io"} {...register("username")} />
          {errors.username && <p className="text-xs text-danger-600">{errors.username.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/auth/forgot-password" className="text-xs font-medium text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" {...register("password")} />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-danger-600">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Controller
            name="remember"
            control={control}
            render={({ field }) => (
              <Checkbox id="remember" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link to="/auth/register" className="font-medium text-primary-600 hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
