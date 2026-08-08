import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { LoomIcon } from "@/components/common/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow"
      >
        <LoomIcon className="h-10 w-10" />
      </motion.div>
      <div className="space-y-2">
        <h1 className="text-6xl font-bold tracking-tight text-gradient">404</h1>
        <p className="text-lg font-semibold">Page not found</p>
        <p className="text-sm text-muted-foreground max-w-sm">
          The page you're looking for doesn't exist or may have been moved.
        </p>
      </div>
      <Link to="/">
        <Button size="lg">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
