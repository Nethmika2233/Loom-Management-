import { mockUsers } from "@/mock";
import type { User } from "@/types";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

let users = [...mockUsers];

export const teamService = {
  async getMembers(): Promise<User[]> {
    await delay();
    return users;
  },
  async inviteMember(email: string): Promise<User> {
    await delay();
    const newUser: User = {
      id: `u${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: "member",
      department: "Unassigned",
      status: "offline",
      joinedAt: new Date().toISOString(),
    };
    users = [...users, newUser];
    return newUser;
  },
};
