import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <Loader2 className="h-6 w-6 animate-spin text-primary-600" />
    </div>
  );
}
