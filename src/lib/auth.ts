export type UserRole = "rep" | "manager";

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: "alex@salespilot.ai",
    password: "Demo123!",
    name: "Alex Rivera",
    role: "rep",
    title: "Account Executive",
    avatar: "AR",
  },
  {
    email: "manager@salespilot.ai",
    password: "Demo123!",
    name: "Morgan Chen",
    role: "manager",
    title: "Sales Manager",
    avatar: "MC",
  },
];

export function authenticate(email: string, password: string): DemoUser | null {
  const user = DEMO_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  return user ?? null;
}
