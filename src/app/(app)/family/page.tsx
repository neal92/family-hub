import { familyMembers } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

export default function FamilyPage() {
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Our Family" description="Manage profiles for everyone in the family.">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" /> Add Member
        </Button>
      </PageHeader>
      
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
              <p className="text-muted-foreground text-sm mb-4">{member.age} years old</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {member.skills.split(', ').map(skill => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
