import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LoomIcon } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";
import { authService } from "@/services/authService";
import { useUserStore } from "@/store/userStore";

export default function Register() {
  const navigate = useNavigate();
  const login = useUserStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register: registerField,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", terms: false as unknown as true },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    const user = await authService.register(values);
    login(user);
    toast.success("Account created", { description: "Welcome! Your workspace is ready." });
    navigate("/");
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
        <h2 className="text-2xl font-bold tracking-tight">Create your account</h2>
        <p className="text-sm text-muted-foreground">Start organizing your team's work in minutes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input id="name" placeholder="Jane Doe" {...registerField("name")} />
          {errors.name && <p className="text-xs text-danger-600">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@loom.io" {...registerField("email")} />
          {errors.email && <p className="text-xs text-danger-600">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input id="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" {...registerField("password")} />
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

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Re-enter password" {...registerField("confirmPassword")} />
          {errors.confirmPassword && <p className="text-xs text-danger-600">{errors.confirmPassword.message}</p>}
        </div>

        <div className="flex items-start gap-2">
          <Controller
            name="terms"
            control={control}
            render={({ field }) => (
              <Checkbox id="terms" className="mt-0.5" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
            I agree to the Terms of Service and Privacy Policy
          </Label>
        </div>
        {errors.terms && <p className="text-xs text-danger-600">{errors.terms.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/auth/login" className="font-medium text-primary-600 hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
