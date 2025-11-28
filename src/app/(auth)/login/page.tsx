'use client';

export const runtime = 'edge';

import { useState } from 'react';
import { Home, Mail, KeyRound, User, Cake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { signIn } from 'next-auth/react';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.175-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c22.69-21.568 35.27-53.478 35.27-90.201"/>
      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.8-4.351-25.82 0-9.02 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/>
      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.582 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
    </svg>
  );

export default function LoginPage() {
  // ...existing code...
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams?.get?.('redirect') || '/dashboard';

  const handleAuthSuccess = () => {
    router.push(redirectTo);
  };

  const handleAuthError = (error: any, action: 'connexion' | 'inscription') => {
    let description = `Une erreur est survenue lors de la tentative de ${action}.`;
    if (error?.message) description = error.message;
    toast({
      variant: 'destructive',
      title: `Erreur de ${action}`,
      description,
    });
  };

  // Suppression de la logique Firebase, profil géré côté backend

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (res?.error) throw new Error(res.error);
      handleAuthSuccess();
    } catch (error: any) {
      handleAuthError(error, 'connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, age }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur lors de la création du compte');
      toast({
        title: 'Compte créé !',
        description: 'Bienvenue. Vous allez être redirigé.',
      });
      // Connexion automatique après inscription
      await handleEmailSignIn(e);
    } catch (error: any) {
      handleAuthError(error, 'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  async function handleGoogleSignIn(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Ask NextAuth for the provider redirect URL (no immediate navigation by signIn)
      const res = await signIn('google', { redirect: false, callbackUrl: redirectTo });
      if (res?.error) throw new Error(res.error);

      // If NextAuth returned a URL, navigate there (this will usually be the provider consent page)
      if (res?.url) {
        window.location.href = res.url;
      } else {
        // Fallback: consider the auth successful and navigate to the app
        handleAuthSuccess();
      }
    } catch (error: any) {
      handleAuthError(error, 'connexion');
    } finally {
      setIsLoading(false);
    }
  }
  // Google SignIn à adapter plus tard avec NextAuth.js

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
       <div className="flex flex-col items-center text-center mb-8">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground mb-4">
                <Home className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-headline">Family Hub</h1>
            <p className="text-muted-foreground">Votre espace familial, simplifié.</p>
      </div>

      <Tabs defaultValue="signin" className="w-full max-w-sm">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Se connecter</TabsTrigger>
          <TabsTrigger value="signup">S'inscrire</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <form onSubmit={handleEmailSignIn}>
              <CardHeader>
                <CardTitle>Ravi de vous revoir !</CardTitle>
                <CardDescription>Connectez-vous pour accéder à votre espace.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="email-signin" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
                <div className="relative space-y-2">
                  <Label htmlFor="password-signin">Mot de passe</Label>
                  <KeyRound className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="password-signin" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Chargement..." : "Se connecter"}
                </Button>
                <Separator className="my-1"/>
                <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} type="button" disabled={isLoading}>
                    <GoogleIcon className="mr-2 h-4 w-4"/>
                    Continuer avec Google
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <form onSubmit={handleEmailSignUp}>
              <CardHeader>
                <CardTitle>Créer un compte</CardTitle>
                <CardDescription>Rejoignez votre hub familial en quelques secondes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="relative space-y-2">
                  <Label htmlFor="name-signup">Prénom</Label>
                  <User className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="name-signup" placeholder="Ex: Sarah" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
                <div className="relative space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Mail className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="email-signup" type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
                 <div className="relative space-y-2">
                  <Label htmlFor="age-signup">Âge</Label>
                  <Cake className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="age-signup" type="number" placeholder="Ex: 42" value={age} onChange={(e) => setAge(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
                <div className="relative space-y-2">
                  <Label htmlFor="password-signup">Mot de passe</Label>
                  <KeyRound className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="password-signup" type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="pl-10"/>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Création..." : "Créer mon compte"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
