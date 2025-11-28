'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UserPlus, Loader2, Edit, Trash2, UserPlusIcon, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';
import type { User } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function FamilyPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [choiceDialogOpen, setChoiceDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [invitationLink, setInvitationLink] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    skills: '',
    availability: '',
    role: 'member'
  });

  const currentUser = session?.user as User | undefined;

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      router.replace('/dashboard');
      return;
    }

    fetchFamilyMembers();
  }, [currentUser, router]);

  const fetchFamilyMembers = async () => {
    try {
      const res = await fetch('/api/family-members');
      if (res.ok) {
        const data = await res.json();
        setFamilyMembers(data);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Impossible de charger les membres' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingUser ? '/api/family-members' : '/api/family-members';
      const method = editingUser ? 'PUT' : 'POST';
      const body = editingUser
        ? { id: editingUser.id, ...formData, age: formData.age ? parseInt(formData.age) : null }
        : { ...formData, age: formData.age ? parseInt(formData.age) : null };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        toast({ title: 'Succès', description: editingUser ? 'Membre modifié' : 'Membre ajouté' });
        setDialogOpen(false);
        resetForm();
        fetchFamilyMembers();
      } else {
        const error = await res.json();
        toast({ variant: 'destructive', title: 'Erreur', description: error.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;

    try {
      const res = await fetch('/api/family-members', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });

      if (res.ok) {
        toast({ title: 'Succès', description: 'Membre supprimé' });
        fetchFamilyMembers();
      } else {
        const error = await res.json();
        toast({ variant: 'destructive', title: 'Erreur', description: error.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau' });
    }
  };

  const handleInviteMember = async () => {
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setInvitationLink(`${window.location.origin}/invite/${data.token}`);
        toast({ title: 'Succès', description: 'Lien d\'invitation généré' });
      } else {
        const error = await res.json();
        toast({ variant: 'destructive', title: 'Erreur', description: error.error });
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erreur', description: 'Erreur réseau' });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      age: user.age?.toString() || '',
      skills: user.skills || '',
      availability: user.availability || '',
      role: user.role || 'member'
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      skills: '',
      availability: '',
      role: 'member'
    });
  };

  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };
  
  if (currentUser?.role !== 'admin') {
    return (
        <div className="container mx-auto px-4 py-8 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
        </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Notre Famille" description="Gérez les profils de chacun dans la famille.">
        <Dialog open={choiceDialogOpen} onOpenChange={setChoiceDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setChoiceDialogOpen(true); }}>
              <UserPlus className="mr-2 h-4 w-4" /> Ajouter un membre
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un membre</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 gap-4">
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => {
                  handleInviteMember();
                  setChoiceDialogOpen(false);
                }}
              >
                <Mail className="h-8 w-8" />
                <span>Inviter une personne</span>
                <span className="text-sm text-muted-foreground">Générer un lien d'invitation</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex flex-col gap-2"
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                  setChoiceDialogOpen(false);
                }}
              >
                <UserPlusIcon className="h-8 w-8" />
                <span>Ajouter manuellement</span>
                <span className="text-sm text-muted-foreground">Remplir les informations</span>
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog pour afficher le lien d'invitation */}
        {invitationLink && (
          <Dialog open={!!invitationLink} onOpenChange={() => setInvitationLink('')}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Lien d'invitation généré</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Partagez ce lien avec la personne que vous souhaitez inviter. Elle pourra s'inscrire elle-même.
                </p>
                <div className="flex gap-2">
                  <Input value={invitationLink} readOnly />
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(invitationLink);
                      toast({ title: 'Copié', description: 'Lien copié dans le presse-papiers' });
                    }}
                  >
                    Copier
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Dialog pour l'ajout manuel */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Modifier le membre' : 'Ajouter un membre'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              {!editingUser && (
                <>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="age">Âge</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="skills">Compétences</Label>
                <Input
                  id="skills"
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Séparées par des virgules"
                />
              </div>
              <div>
                <Label htmlFor="availability">Disponibilité</Label>
                <Input
                  id="availability"
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="role">Rôle</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Membre</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {member.skills?.split(',').map(skill => (
                    <Badge key={skill.trim()} variant="secondary">{skill.trim()}</Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
