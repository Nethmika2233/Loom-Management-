import { currentUser, currentMember } from "@/mock";
import type { User } from "@/types";
import API from "@/services/api";
import { registerLocalUser, loginLocalUser } from "@/services/localAuth";

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
    
    // 1) Local authentication (hardcoded admins + registered users)
    const identifier = (payload.username || "").trim();
    const localUser = loginLocalUser(identifier, payload.password);
    if (localUser) {
      localStorage.setItem("token", `local-${localUser.id}`);
      return localUser;
    }

    // 2) Backend fallback
    try {
      const response = await API.post("/auth/login", {
        email: identifier,
        password: payload.password,
      });
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data.user || response.data;
    } catch {
      // If backend fails, return mock user for demo purposes
      if (payload.loginAs === "admin") return currentUser;
      return { ...currentMember, name: payload.username.trim() || "User" };
    }
  },
  
  async register(payload: RegisterPayload): Promise<User> {
    // Register locally first so accounts work even without the backend/DB
    let localUser: User;
    try {
      localUser = registerLocalUser(payload);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Registration failed");
    }

    // Best-effort sync to the backend (does not block account creation)
    API.post("/auth/register", {
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: "member",
    }).catch(() => {
      /* backend optional */
    });

    localStorage.setItem("token", `local-${localUser.id}`);
    return localUser;
  },
  
  async forgotPassword(_email: string): Promise<{ sent: boolean }> {
    await delay();
    return { sent: true };
  },
  
  async verifyOtp(code: string): Promise<{ verified: boolean }> {
    try {
      const response = await API.post("/auth/verify-otp", { code });
      return response.data;
    } catch {
      return { verified: code === "123456" };
    }
  },
  
  async logout(): Promise<void> {
    await delay(100);
    localStorage.removeItem("token");
  },
};
