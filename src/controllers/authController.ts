import { findUserByEmail, createUser, verifyPassword } from "@/models/user";

export async function registerUser({ email, password, name, age }: { email: string; password: string; name?: string; age?: number }) {
  if (!email || !password) throw new Error("Email et mot de passe requis");

  // Validation du mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial");
  }

  const existing = await findUserByEmail(email);
  if (existing) throw new Error("Utilisateur déjà existant");
  return createUser(email, password, name, age);
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  if (!email || !password) throw new Error("Email et mot de passe requis");
  const user = await findUserByEmail(email);
  if (!user || !user.password) throw new Error("Utilisateur ou mot de passe incorrect");
  const valid = await verifyPassword(password, user.password);
  if (!valid) throw new Error("Utilisateur ou mot de passe incorrect");
  return user;
}
