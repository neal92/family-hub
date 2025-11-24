import { documents } from '@/lib/data';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Trash2, FileText, Shield, HeartPulse, Banknote } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryIcons = {
  Insurance: <Shield className="h-4 w-4" />,
  Medical: <HeartPulse className="h-4 w-4" />,
  Financial: <Banknote className="h-4 w-4" />,
  Other: <FileText className="h-4 w-4" />,
};

const categoryColors = {
    Insurance: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    Medical: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    Financial: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

export default function DocumentsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader title="Document Storage" description="Securely store and access important family documents.">
        <Button>
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </PageHeader>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => (
                <TableRow key={doc.id} className="transition-colors hover:bg-muted/50">
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("border-none", categoryColors[doc.category])}>
                      {categoryIcons[doc.category]}
                      <span className="ml-1.5">{doc.category}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>{format(doc.dateAdded, 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" aria-label="Download">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
