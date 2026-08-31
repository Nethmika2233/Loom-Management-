import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { teamService } from "@/services/teamService";

/**
 * InviteMemberDialog Component
 * Handles the UI and validation for inviting new users to the workspace with specific role assignments.
 */
export function InviteMemberDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  // Validates input, sends invitation, and resets form state
  const handleInvite = async () => {
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    try {
      await teamService.inviteMember(email);
      toast.success("Invitation sent", { description: `Invited ${email} as ${role}` });

      // Reset form fields
      setEmail("");
      setRole("member");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to invite member");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite team member</DialogTitle>
          <DialogDescription>Send an invitation to join your workspace.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">Email address</Label>
            <Input 
              id="invite-email" 
              type="email" 
              required 
              placeholder="Enter team member email (e.g., name@company.com)" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              autoFocus 
            />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite}>Send invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog> // TODO: Adding the search filter next
    
  );
}
