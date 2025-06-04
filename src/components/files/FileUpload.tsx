'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // For manual selection
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, FileText, XCircle, CheckCircle2 } from 'lucide-react';
import { useAuthContext } from '@/hooks/useAuthContext';
import { uploadMaterial } from '@/lib/firebase/firestoreService';
import type { StudyMaterial } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

const acceptedFileTypes = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'audio/mpeg': ['.mp3'],
  'audio/wav': ['.wav'],
};

export function FileUpload() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [topic, setTopic] = useState('');
  const [materialType, setMaterialType] = useState<StudyMaterial['type']>('document');


  const onDrop = useCallback((acceptedFiles: File[], fileRejections: any[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > MAX_SIZE_BYTES) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: `${file.name} exceeds the ${MAX_SIZE_MB}MB limit.`,
        });
        return false;
      }
      return true;
    });
    setFilesToUpload(prev => [...prev, ...validFiles]);

    fileRejections.forEach(rejection => {
        rejection.errors.forEach((err: any) => {
             toast({
                variant: 'destructive',
                title: `Error with ${rejection.file.name}`,
                description: err.message,
            });
        });
    });
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize: MAX_SIZE_BYTES,
    multiple: true,
  });

  const handleUpload = async () => {
    if (!user || filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadProgress({});
    let successCount = 0;

    for (const file of filesToUpload) {
      try {
        // Simulate progress for now, replace with actual progress tracking from uploadBytesResumable if needed
        // For simplicity, this example uses uploadBytes which doesn't provide progress.
        // To show progress, you would use `uploadBytesResumable` from firebase/storage
        // and listen to 'state_changed' events.
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        const metadata: Omit<StudyMaterial, 'id' | 'uploaderUid' | 'createdAt' | 'url' | 'filePath'> = {
          name: file.name,
          type: materialType, // Or determine from file.type
          topic: topic || 'General',
        };
        
        // Simulate progress update
        let currentProgress = 0;
        const interval = setInterval(() => {
          currentProgress += 10;
          if (currentProgress <= 100) {
            setUploadProgress(prev => ({ ...prev, [file.name]: currentProgress }));
          } else {
            clearInterval(interval);
          }
        }, 200);

        await uploadMaterial(user.uid, file, metadata);
        clearInterval(interval); // Ensure interval is cleared on completion
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));
        successCount++;
        
      } catch (error: any) {
        console.error('Upload error:', error);
        setUploadProgress(prev => ({ ...prev, [file.name]: -1 })); // Indicate error
        toast({
          variant: 'destructive',
          title: `Upload failed for ${file.name}`,
          description: error.message || 'An unknown error occurred.',
        });
      }
    }
    
    setIsUploading(false);
    if (successCount > 0) {
       toast({ title: 'Upload Complete', description: `${successCount} of ${filesToUpload.length} file(s) uploaded successfully.` });
    }
    if (successCount === filesToUpload.length) {
        setFilesToUpload([]); // Clear queue on full success
        setTopic('');
        // Reset material type if needed
    }
  };
  
  const removeFile = (fileName: string) => {
    setFilesToUpload(filesToUpload.filter(f => f.name !== fileName));
    setUploadProgress(prev => {
        const newState = {...prev};
        delete newState[fileName];
        return newState;
    });
  };


  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-muted-foreground/50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary">Drop the files here ...</p>
        ) : (
          <p className="text-muted-foreground">Drag & drop files here, or click to select files</p>
        )}
        <p className="text-xs text-muted-foreground/80 mt-2">Max {MAX_SIZE_MB}MB per file. Supported types: PDF, DOCX, TXT, MP4, MOV, MP3, WAV.</p>
      </div>
      
      {filesToUpload.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic">Topic (Optional)</Label>
              <Input 
                id="topic" 
                placeholder="e.g., Calculus Chapter 3" 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="mt-1"
                disabled={isUploading}
              />
            </div>
            <div>
              <Label htmlFor="materialType">Material Type</Label>
                <Select 
                    value={materialType} 
                    onValueChange={(value: StudyMaterial['type']) => setMaterialType(value)}
                    disabled={isUploading}
                >
                <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select material type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="document">Document (PDF, DOCX, TXT)</SelectItem>
                    <SelectItem value="video">Video (MP4, MOV)</SelectItem>
                    <SelectItem value="audio">Audio (MP3, WAV)</SelectItem>
                    <SelectItem value="link">Web Link (Enter in AI tools)</SelectItem>
                </SelectContent>
                </Select>
            </div>
          </div>

          <h3 className="text-lg font-medium">Files to Upload:</h3>
          <ul className="space-y-3">
            {filesToUpload.map(file => (
              <li key={file.name} className="p-3 border rounded-md flex items-center justify-between bg-muted/30">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
                <div className="flex items-center gap-2">
                    {uploadProgress[file.name] !== undefined && uploadProgress[file.name] >= 0 && uploadProgress[file.name] < 100 && !isUploading && (
                        <Progress value={uploadProgress[file.name]} className="w-24 h-2" />
                    )}
                    {isUploading && uploadProgress[file.name] !== undefined && uploadProgress[file.name] >= 0 && (
                         <Progress value={uploadProgress[file.name]} className="w-24 h-2" />
                    )}
                    {uploadProgress[file.name] === 100 && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    {uploadProgress[file.name] === -1 && <XCircle className="h-5 w-5 text-destructive" />}
                    <Button variant="ghost" size="icon" onClick={() => removeFile(file.name)} disabled={isUploading && uploadProgress[file.name] !== undefined && uploadProgress[file.name] >=0 }>
                        <XCircle className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                    </Button>
                </div>
              </li>
            ))}
          </ul>
          <Button onClick={handleUpload} disabled={isUploading || filesToUpload.length === 0} className="w-full md:w-auto">
            {isUploading ? 'Uploading...' : `Upload ${filesToUpload.length} File(s)`}
          </Button>
        </div>
      )}
    </div>
  );
}
