'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2 } from 'lucide-react';
import { useFirestore, useUser as useAuthUser } from '@/firebase';
import { useCollection, useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, doc } from 'firebase/firestore';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FamilyPage() {
  const firestore = useFirestore();
  const { user: authUser, initialising: authLoading } = useAuthUser();
  const router = useRouter();

  const userRef = authUser ? doc(firestore, 'users', authUser.uid) : null;
  const [currentUserData, currentUserLoading] = useDocumentData(userRef);

  const [value, loading, error] = useCollection(collection(firestore, 'users'));
  const familyMembers = value?.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));

  const pageLoading = authLoading || currentUserLoading;

  useEffect(() => {
    if (!pageLoading && currentUserData?.role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [pageLoading, currentUserData, router]);

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };
  
  if (pageLoading || currentUserData?.role !== 'admin') {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Notre Famille" description="Gérez les profils de chacun dans la famille.">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Ajouter un membre
        </Button>
      </PageHeader>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {error && (
        <div className="text-center text-destructive">
          <p>Erreur: {error.message}</p>
        </div>
      )}

      {!loading && familyMembers && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {familyMembers.map((member) => (
            <Card key={member.id} className="text-center transition-all hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4 border-4 border-background ring-2 ring-primary">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback className="text-3xl bg-muted">
                    {getInitials(member.name)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold font-headline">{member.name}</h3>
                {member.age && <p className="text-muted-foreground text-sm mb-4">{member.age} ans</p>}
                <div className="flex flex-wrap gap-2 justify-center">
                  {member.skills?.split(',').map(skill => (
                    <Badge key={skill.trim()} variant="secondary">{skill.trim()}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
