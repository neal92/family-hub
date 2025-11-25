'use client';

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useAuth } from '@/firebase';
import { Home, Mail, KeyRound, User, Cake, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.175-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c22.69-21.568 35.27-53.478 35.27-90.201"/>
      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"/>
      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.8-4.351-25.82 0-9.02 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"/>
      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.582 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"/>
    </svg>
  );

export default function LoginPage() {
  const { auth } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [skills, setSkills] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const redirectTo = searchParams.get('redirect') || '/dashboard';

  const handleAuthSuccess = () => {
    router.push(redirectTo);
  };

  const handleAuthError = (error: any, action: 'connexion' | 'inscription') => {
    console.error(error);
    let description = error.message || `Une erreur est survenue lors de la tentative de ${action}.`;
    if (error.code === 'auth/configuration-not-found') {
      description = "La méthode de connexion Google n'est pas activée dans la console Firebase. Veuillez l'activer pour continuer.";
    }
    toast({
      variant: 'destructive',
      title: `Erreur de ${action}`,
      description: description,
    });
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Ici, vous enregistreriez les informations supplémentaires (name, age, skills) dans votre base de données (ex: Firestore)
      // avec l'UID de l'utilisateur : userCredential.user.uid
      console.log('User created:', userCredential.user.uid, { name, age, skills });
      toast({
        title: 'Compte créé !',
        description: 'Vous pouvez maintenant vous connecter.',
      });
      // Pour cet exemple, nous redirigeons simplement après l'inscription
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      handleAuthSuccess();
    } catch (error) {
      handleAuthError(error, 'connexion');
    } finally {
      setIsLoading(false);
    }
  };

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
                  <Label htmlFor="skills-signup">Compétences</Label>
                  <Wrench className="absolute left-3 top-9 h-4 w-4 text-muted-foreground" />
                  <Input id="skills-signup" placeholder="Ex: Cuisine, Bricolage" value={skills} onChange={(e) => setSkills(e.target.value)} required disabled={isLoading} className="pl-10"/>
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

    