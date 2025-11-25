'use client';

import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFirestore, useUser as useAuthUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const profileSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  age: z.coerce.number().positive('Âge invalide').optional().or(z.literal('')),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user: authUser, initialising: authLoading } = useAuthUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const userRef = authUser ? doc(firestore, 'users', authUser.uid) : null;
  const [userData, userDataLoading] = useDocumentData(userRef);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
        name: '',
        age: '',
        skills: '',
    }
  });

  const currentAvatarUrl = userData?.avatarUrl;

  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        age: userData.age || '',
        skills: userData.skills || '',
      });
      setAvatarPreview(userData.avatarUrl || null);
    }
  }, [userData, reset]);
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const getInitials = (name: string) => name ? name.charAt(0).toUpperCase() : '';

  const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
    if (!authUser || !firestore || !userRef) return;

    setIsUploading(true);

    let newAvatarUrl = currentAvatarUrl;

    if (avatarFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `avatars/${authUser.uid}/${avatarFile.name}`);
        try {
            const snapshot = await uploadBytes(storageRef, avatarFile);
            newAvatarUrl = await getDownloadURL(snapshot.ref);
        } catch (error) {
            console.error("Upload failed", error);
            toast({
                variant: "destructive",
                title: "Échec du téléversement",
                description: "Impossible de téléverser votre nouvel avatar.",
            });
            setIsUploading(false);
            return;
        }
    }

    const profileData = {
      name: data.name,
      email: authUser.email,
      age: data.age ? Number(data.age) : null,
      skills: data.skills || '',
      avatarUrl: newAvatarUrl || `https://i.pravatar.cc/150?u=${authUser.uid}`,
    };

    setDoc(userRef, profileData, { merge: true }).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: userRef.path,
          operation: 'update',
          requestResourceData: profileData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
      
    setIsUploading(false);
    setAvatarFile(null);

    toast({
      title: 'Profil mis à jour !',
      description: 'Vos informations ont été sauvegardées avec succès.',
    });
  };
  
  const isLoading = authLoading || userDataLoading;
  const totalSubmitting = isSubmitting || isUploading;

  if (isLoading) {
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
            <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                    <AvatarImage src={avatarPreview || authUser?.photoURL || ''} alt={authUser?.displayName || ''} />
                    <AvatarFallback className="text-3xl">{getInitials(watch('name') || authUser?.displayName || '')}</AvatarFallback>
                </Avatar>
                <div className="flex-grow space-y-2">
                    <Label>Avatar</Label>
                    <Input id="avatarFile" type="file" onChange={handleAvatarChange} accept="image/*" className="hidden" />
                    <Button type="button" variant="outline" asChild>
                       <Label htmlFor="avatarFile" className="cursor-pointer">
                         <Upload className="mr-2 h-4 w-4" />
                         Changer l'image
                       </Label>
                    </Button>
                     <p className="text-sm text-muted-foreground">Téléversez une nouvelle photo.</p>
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

            <Button type="submit" disabled={totalSubmitting}>
              {totalSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer les modifications
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
