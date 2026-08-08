import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useBoardStore } from "@/store/boardStore";
import type { Board } from "@/types";

export function RenameBoardDialog({ board, onOpenChange }: { board: Board | null; onOpenChange: (v: boolean) => void }) {
  const renameBoard = useBoardStore((s) => s.renameBoard);
  const [name, setName] = useState("");

  useEffect(() => {
    if (board) setName(board.name);
  }, [board]);

  const handleSave = () => {
    if (!board || !name.trim()) return;
    renameBoard(board.id, name.trim());
    toast.success("Board renamed");
    onOpenChange(false);
  };

  return (
    <Dialog open={!!board} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename board</DialogTitle>
        </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus onKeyDown={(e) => e.key === "Enter" && handleSave()} />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
