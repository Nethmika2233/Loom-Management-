import { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { LoomIcon } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/authService";

export default function OtpVerification() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const code = digits.join("");

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (code.length !== 6) {
      toast.error("Enter the full 6-digit code");
      return;
    }
    setSubmitting(true);
    await authService.verifyOtp(code);
    setSubmitting(false);
    toast.success("Email verified!");
    navigate("/");
  };

  return (
    <div className="space-y-6 text-center">
      <div className="mb-2 flex items-center justify-center gap-2 lg:hidden">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <LoomIcon className="h-5 w-5" />
        </div>
        <span className="text-lg font-semibold">Loom</span>
      </div>

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/10">
        <ShieldCheck className="h-7 w-7" />
      </div>

      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
        <p className="text-sm text-muted-foreground">Enter the 6-digit code we sent to your inbox</p>
      </div>

      <div className="flex justify-center gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            inputMode="numeric"
            maxLength={1}
            className="h-12 w-11 rounded-lg border border-input bg-background text-center text-lg font-semibold shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        ))}
      </div>

      <Button className="w-full" size="lg" onClick={handleSubmit} disabled={submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Verify email
      </Button>

      <p className="text-sm text-muted-foreground">
        Didn't get a code?{" "}
        <button type="button" className="font-medium text-primary-600 hover:underline" onClick={() => toast.info("Code resent")}>
          Resend
        </button>
      </p>

      <Link to="/auth/login" className="block text-sm font-medium text-muted-foreground hover:text-foreground">
        Back to sign in
      </Link>
    </div>
  );
}
