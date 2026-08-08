import { currentUser, currentMember } from "@/mock";
import type { User } from "@/types";

const delay = (ms = 400) => new Promise((res) => setTimeout(res, ms));

export interface LoginPayload {
  username: string;
  password: string;
  loginAs?: "admin" | "user";
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  async login(payload: LoginPayload): Promise<User> {
    await delay();
    if (payload.loginAs === "admin") return currentUser;
    return { ...currentMember, name: payload.username.trim() || "User" };
  },
  async register(_payload: RegisterPayload): Promise<User> {
    await delay();
    return currentUser;
  },
  async forgotPassword(_email: string): Promise<{ sent: boolean }> {
    await delay();
    return { sent: true };
  },
  async verifyOtp(_code: string): Promise<{ verified: boolean }> {
    await delay();
    return { verified: true };
  },
  async logout(): Promise<void> {
    await delay(100);
  },
};
