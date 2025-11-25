'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth, useFirestore, useUser as useAuthUser } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  age: z.coerce.number().positive('Âge invalide').optional().or(z.literal('')),
  skills: z.string().optional(),
  avatarUrl: z.string().url('URL invalide').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user: authUser, initialising: authLoading } = useAuthUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const avatarUrl = watch('avatarUrl');

  useEffect(() => {
    if (authUser && firestore) {
      const fetchUserData = async () => {
        setIsLoading(true);
        const userRef = doc(firestore, 'users', authUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          reset({
            name: userData.name || '',
            age: userData.age || '',
            skills: userData.skills || '',
            avatarUrl: userData.avatarUrl || '',
          });
        }
        setIsLoading(false);
      };
      fetchUserData();
    }
  }, [authUser, firestore, reset]);

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '';

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!authUser || !firestore) return;

    const userRef = doc(firestore, 'users', authUser.uid);
    const profileData = {
      name: data.name,
      email: authUser.email,
      age: data.age ? Number(data.age) : null,
      skills: data.skills || '',
      avatarUrl: data.avatarUrl || `https://i.pravatar.cc/150?u=${authUser.uid}`,
    };

    try {
        setDoc(userRef, profileData, { merge: true }).catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
              path: userRef.path,
              operation: 'update',
              requestResourceData: profileData,
            });
            errorEmitter.emit('permission-error', permissionError);
          });
      toast({
        title: 'Profil mis à jour !',
        description: 'Vos informations ont été sauvegardées avec succès.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Oups !',
        description: 'Une erreur est survenue lors de la mise à jour de votre profil.',
      });
    }
  };
  
  if (isLoading || authLoading) {
      return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
      )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Mon Profil" description="Mettez à jour vos informations personnelles." />

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Informations Personnelles</CardTitle>
          <CardDescription>Ces informations seront visibles par les autres membres de votre famille.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarUrl || authUser?.photoURL || ''} alt={authUser?.displayName || ''} />
                    <AvatarFallback className="text-3xl">{getInitials(watch('name') || authUser?.displayName || '')}</AvatarFallback>
                </Avatar>
                <div className="flex-grow space-y-2">
                    <Label htmlFor="avatarUrl">URL de l'avatar</Label>
                    <Input id="avatarUrl" {...register('avatarUrl')} placeholder="https://..." />
                    {errors.avatarUrl && <p className="text-sm text-destructive">{errors.avatarUrl.message}</p>}
                </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="name">Nom / Prénom</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Âge</Label>
              <Input id="age" type="number" {...register('age')} />
              {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Compétences</Label>
              <Textarea
                id="skills"
                {...register('skills')}
                placeholder="Ex: Cuisine, Jardinage, Bricolage..."
              />
              <p className="text-sm text-muted-foreground">Séparez les compétences par des virgules.</p>
              {errors.skills && <p className="text-sm text-destructive">{errors.skills.message}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={authUser?.email || ''} disabled />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
