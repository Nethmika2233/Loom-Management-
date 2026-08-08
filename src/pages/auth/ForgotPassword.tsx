import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { LoomIcon } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations";
import { authService } from "@/services/authService";

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [emailSentTo, setEmailSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    await authService.forgotPassword(values.email);
    setEmailSentTo(values.email);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success-50 text-success-600 dark:bg-success-500/10">
          <MailCheck className="h-7 w-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to <span className="font-medium text-foreground">{emailSentTo}</span>
          </p>
        </div>
        <Link to="/auth/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2 flex items-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <LoomIcon className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">Loom</span>
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
          {errors.email && <p className="text-xs text-danger-600">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Send reset link
        </Button>
      </form>

      <Link to="/auth/login" className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to sign in
      </Link>
    </div>
  );
}
