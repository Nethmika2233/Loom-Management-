import type { User, UserRole } from "@/types";

/**
 * Lightweight local authentication layer.
 *
 * - Hardcoded admin credentials (always work, no DB required).
 * - Registered users are persisted to localStorage so you can create as many
 *   accounts as you want and sign back in with them later.
 * - The backend is only used as a best-effort sync when it is available.
 */

interface LocalAccount {
  id: string;
  username?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

const STORAGE_KEY = "loom_local_users";

// Hardcoded administrator credentials
const HARDCODED_ADMINS: LocalAccount[] = [
  {
    id: "admin-local",
    username: "admin",
    name: "Loom Admin",
    email: "admin@loom.io",
    password: "admin123",
    role: "admin",
  },
  {
    id: "admin-nethmika",
    username: "nethmika",
    name: "Nethmika Athukorala",
    email: "nethmika@loop.io",
    password: "nethmika123",
    role: "admin",
  },
];

function toLocalUser(account: LocalAccount): User {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    department: account.role === "admin" ? "Administration" : "Product",
    status: "online",
    title: account.role === "admin" ? "Administrator" : "Team Member",
    joinedAt: new Date().toISOString().slice(0, 10),
  };
}

function readLocalUsers(): LocalAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalAccount[]) : [];
  } catch {
    return [];
  }
}

function writeLocalUsers(users: LocalAccount[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const normalize = (value: string) => value.trim().toLowerCase();

/**
 * Creates a new local user account. Throws if an account with the same email
 * already exists (either a registered user or a hardcoded admin).
 */
export function registerLocalUser(payload: {
  name: string;
  email: string;
  password: string;
}): User {
  const email = normalize(payload.email);
  if (!payload.name || !payload.email || !payload.password) {
    throw new Error("Name, email and password are required");
  }

  const users = readLocalUsers();
  const exists =
    users.some((u) => normalize(u.email) === email) ||
    HARDCODED_ADMINS.some((a) => normalize(a.email) === email);
  if (exists) {
    throw new Error("User already exists");
  }

  const account: LocalAccount = {
    id: `local-${Date.now()}`,
    name: payload.name.trim(),
    email: payload.email.trim(),
    password: payload.password,
    role: "member",
  };

  users.push(account);
  writeLocalUsers(users);
  return toLocalUser(account);
}

/**
 * Attempts to log in against hardcoded admins and registered users.
 * Returns the User on success, or null when credentials are invalid.
 */
export function loginLocalUser(identifier: string, password: string): User | null {
  const id = normalize(identifier);
  if (!id || !password) return null;

  const admin = HARDCODED_ADMINS.find(
    (a) =>
      normalize(a.email) === id ||
      normalize(a.name) === id ||
      (a.username ? normalize(a.username) === id : false)
  );
  if (admin && admin.password === password) {
    return toLocalUser(admin);
  }

  const users = readLocalUsers();
  const found = users.find(
    (u) => normalize(u.email) === id || normalize(u.name) === id
  );
  if (found && found.password === password) {
    return toLocalUser(found);
  }

  return null;
}

/**
 * Returns every account that can be added to a team (hardcoded admins + all
 * registered local users) as User objects. Used for the invite / join-request
 * directory on the Team page.
 */
export function getRegisteredUsers(): User[] {
  const users = readLocalUsers();
  return [...HARDCODED_ADMINS, ...users].map(toLocalUser);
}