export interface User {
  id: string;
  name: string;
  personnummer: string;
  isNew: boolean;
  onboardingComplete: boolean;
}

const STORAGE_KEY = "precura_user";

export const DEMO_USERS: Record<string, User> = {
  new: {
    id: "demo-new",
    name: "Erik Lindqvist",
    personnummer: "199201150234",
    isNew: true,
    onboardingComplete: false,
  },
  returning: {
    id: "demo-returning",
    name: "Anna Bergstrom",
    personnummer: "198507220148",
    isNew: false,
    onboardingComplete: true,
  },
};

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as User;
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function updateUser(updates: Partial<User>): void {
  const current = getUser();
  if (current) {
    setUser({ ...current, ...updates });
  }
}

export function logout(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
