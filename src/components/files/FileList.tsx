'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getUserMaterials, deleteMaterial } from '@/lib/firebase/firestoreService';
import type { StudyMaterial } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Video, Music, Link as LinkIcon, Trash2, Download, Eye, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';

const FileIcon = ({ type }: { type: StudyMaterial['type'] }) => {
  switch (type) {
    case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
    case 'document': return <FileText className="h-5 w-5 text-blue-500" />;
    case 'video': return <Video className="h-5 w-5 text-purple-500" />;
    case 'audio': return <Music className="h-5 w-5 text-green-500" />;
    case 'link': return <LinkIcon className="h-5 w-5 text-gray-500" />;
    default: return <FileText className="h-5 w-5 text-muted-foreground" />;
  }
};

export function FileList() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingMaterial, setDeletingMaterial] = useState<StudyMaterial | null>(null);


  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getUserMaterials(user.uid)
        .then(data => {
          setMaterials(data.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()));
        })
        .catch(error => {
          console.error("Error fetching materials:", error);
          toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your files.' });
        })
        .finally(() => setIsLoading(false));
    }
  }, [user, toast]);

  const handleDelete = async (material: StudyMaterial) => {
    try {
      await deleteMaterial(material);
      setMaterials(prev => prev.filter(m => m.id !== material.id));
      toast({ title: 'Success', description: `${material.name} deleted.` });
    } catch (error) {
      console.error("Error deleting material:", error);
      toast({ variant: 'destructive', title: 'Error', description: `Could not delete ${material.name}.` });
    }
    setDeletingMaterial(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (materials.length === 0) {
    return <p className="text-muted-foreground">You haven&apos;t uploaded any files yet.</p>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Topic</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map(material => (
              <TableRow key={material.id}>
                <TableCell><FileIcon type={material.type} /></TableCell>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="capitalize">{material.type}</TableCell>
                <TableCell>{material.topic || '-'}</TableCell>
                <TableCell>{format(new Date(material.createdAt), 'MMM d, yyyy')}</TableCell>
                <TableCell className="text-right">
                   <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {material.url && (
                        <>
                          <DropdownMenuItem asChild>
                            <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" /> View / Open
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a href={material.url} download={material.name} className="flex items-center">
                               <Download className="mr-2 h-4 w-4" /> Download
                            </a>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem onClick={() => setDeletingMaterial(material)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {deletingMaterial && (
        <AlertDialog open={!!deletingMaterial} onOpenChange={() => setDeletingMaterial(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the file &quot;{deletingMaterial.name}&quot;.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletingMaterial(null)}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => handleDelete(deletingMaterial)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                    Delete
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
