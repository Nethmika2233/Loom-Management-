import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useBoardStore } from "@/store/boardStore";
import type { Board } from "@/types";

const COLOR_OPTIONS = [
  "from-indigo-500 to-violet-500",
  "from-cyan-500 to-blue-500",
  "from-orange-500 to-amber-500",
  "from-emerald-500 to-teal-500",
  "from-pink-500 to-rose-500",
  "from-slate-500 to-gray-500",
];

export function CreateBoardDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const boards = useBoardStore((s) => s.boards);
  const createBoard = useBoardStore((s) => s.createBoard);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0]);

  const handleCreate = () => {
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      toast.error("Board name is required");
      return;
    }
    if (trimmedName.length < 3) {
      toast.error("Board name is too short", {
        description: "Board name must be at least 3 characters long."
      });
      return;
    }
    if (trimmedName.length > 50) {
      toast.error("Board name letter count exceeded", {
        description: "Board name cannot exceed 50 characters. Please shorten it."
      });
      return;
    }

    // Check for duplicate board name (case-insensitive)
    const isDuplicate = boards.some(
      (b) => b.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Board name already exists", {
        description: "A board with this name already exists. Please choose a different name."
      });
      return;
    }

    const id = `b${Date.now()}`;
    const board: Board = {
      id,
      name: trimmedName,
      description,
      workspaceId: "w1",
      columns: [
        { id: `${id}-c1`, boardId: id, title: "To Do", order: 0, color: "#94A3B8" },
        { id: `${id}-c2`, boardId: id, title: "Doing", order: 1, color: "#4F46E5" },
        { id: `${id}-c3`, boardId: id, title: "Review", order: 2, color: "#F97316" },
        { id: `${id}-c4`, boardId: id, title: "Done", order: 3, color: "#16A34A" },
      ],
      memberIds: ["u1"],
      favorite: false,
      archived: false,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    createBoard(board);
    toast.success("Board created", { description: trimmedName });
    onOpenChange(false);
    setName("");
    setDescription("");
    navigate(`/boards/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new board</DialogTitle>
          <DialogDescription>Set up a new project board for your team.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="board-name">Board name</Label>
            <Input id="board-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Product Launch Q4 (3-50 chars)" autoFocus />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="board-desc">Description</Label>
            <Textarea id="board-desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this board for?" />
          </div>
          <div className="space-y-1.5">
            <Label>Theme</Label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 w-8 rounded-lg bg-gradient-to-br ${c} ring-offset-2 ring-offset-background transition-all ${
                    color === c ? "ring-2 ring-primary-600" : ""
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create board</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}