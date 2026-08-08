import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";
import { CreateBoardDialog } from "@/components/board/create-board-dialog";

export function FloatingCreateButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-500 text-white shadow-glow lg:bottom-6 h-14 w-14"
        aria-label="Create new board"
      >
        <Plus className="h-6 w-6" />
      </motion.button>
      <CreateBoardDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
