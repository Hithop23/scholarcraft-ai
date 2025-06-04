'use client';

import { FileUpload } from '@/components/files/FileUpload';
import { FileList } from '@/components/files/FileList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function FilesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Your Learning Materials</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Upload New Material</CardTitle>
          <CardDescription>
            Add PDFs, documents, videos, or audio files to your library.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload />
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            Browse and manage your stored learning materials.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileList />
        </CardContent>
      </Card>
    </div>
  );
}
