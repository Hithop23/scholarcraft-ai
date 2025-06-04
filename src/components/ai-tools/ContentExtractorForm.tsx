'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileUp, Link as LinkIcon,Youtube } from 'lucide-radix-loader2, FileUp, Link as LinkIcon, Youtube } from 'lucide-react';
import { extractContent } from '@/ai/flows/extract-content'; // Assuming server action
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const extractorSchema = z.object({
  inputType: z.enum(['file', 'url', 'text']),
  file: z.any().optional(), // refine with file type validation if needed
  url: z.string().url({ message: "Please enter a valid URL." }).optional(),
  text: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.inputType === 'file' && !data.file) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "File is required.", path: ['file'] });
  }
  if (data.inputType === 'url' && !data.url) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "URL is required.", path: ['url'] });
  }
  if (data.inputType === 'text' && (!data.text || data.text.trim().length < 10)) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Text must be at least 10 characters.", path: ['text'] });
  }
});

type ExtractorFormValues = z.infer<typeof extractorSchema>;

interface ContentExtractorFormProps {
  onContentExtracted: (source: string, text: string) => void;
}

export function ContentExtractorForm({ onContentExtracted }: ContentExtractorFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const { toast } = useToast();
  
  const form = useForm<ExtractorFormValues>({
    resolver: zodResolver(extractorSchema),
    defaultValues: {
      inputType: 'file',
      file: undefined,
      url: '',
      text: '',
    },
  });

  const inputType = form.watch('inputType');

  const onSubmit = async (values: ExtractorFormValues) => {
    setIsLoading(true);
    setExtractedText(null);
    setFileName(null);

    try {
      let resultText = '';
      let sourceName = 'Pasted Text';

      if (values.inputType === 'file' && values.file) {
        const file = values.file as File;
        sourceName = file.name;
        setFileName(file.name);
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            toast({ variant: 'destructive', title: 'File too large', description: 'Please upload files smaller than 5MB.'});
            setIsLoading(false);
            return;
        }

        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve(event.target?.result as string);
          reader.onerror = (error) => reject(error);
          reader.readAsDataURL(file);
        });
        
        const response = await extractContent({ fileDataUri: dataUri });
        resultText = response.extractedText;
      } else if (values.inputType === 'url' && values.url) {
        sourceName = values.url;
        // For URLs, content extraction often needs a more complex backend setup
        // (fetching, parsing HTML, security considerations).
        // The current `extractContent` flow expects a data URI.
        // This part might need adjustment or a dedicated URL processing flow.
        // For now, let's assume a flow that can handle URL directly or adapt `extractContent`
        // For simplicity, we will use the summarize content flow which can take a string.
        // This is a placeholder for potentially more direct URL content extraction.
        toast({ title: "Info", description: "URL processing is simplified for this demo. Full content extraction might require a dedicated backend service."});
        resultText = `Content from URL: ${values.url}`; // Placeholder
      } else if (values.inputType === 'text' && values.text) {
        resultText = values.text;
      }

      setExtractedText(resultText);
      onContentExtracted(sourceName, resultText);
      toast({ title: 'Content Extracted', description: `Successfully processed ${sourceName}.` });

    } catch (error: any) {
      console.error('Extraction error:', error);
      toast({
        variant: 'destructive',
        title: 'Extraction Failed',
        description: error.message || 'Could not extract content. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Controller
        control={form.control}
        name="inputType"
        render={({ field }) => (
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground cursor-pointer flex-1">
              <RadioGroupItem value="file" id="file" /> <FileUp className="h-5 w-5 mr-1"/> Upload File (PDF, DOCX, TXT)
            </Label>
            <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground cursor-pointer flex-1">
              <RadioGroupItem value="url" id="url" /> <LinkIcon className="h-5 w-5 mr-1"/> Web/YouTube URL
            </Label>
             <Label className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent has-[input:checked]:bg-primary has-[input:checked]:text-primary-foreground cursor-pointer flex-1">
              <RadioGroupItem value="text" id="text" /> <Youtube className="h-5 w-5 mr-1"/> Paste Text
            </Label>
          </RadioGroup>
        )}
      />

      {inputType === 'file' && (
         <Controller
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...restField }}) => ( // value is not directly used by Input type="file"
                <div>
                    <Label htmlFor="file-upload">Select File</Label>
                    <Input 
                        id="file-upload" 
                        type="file" 
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => onChange(e.target.files ? e.target.files[0] : null)} 
                        {...restField}
                        className="mt-1"
                        disabled={isLoading} 
                    />
                    {form.formState.errors.file && <p className="text-sm text-destructive mt-1">{form.formState.errors.file.message as string}</p>}
                </div>
            )}
        />
      )}

      {inputType === 'url' && (
        <Controller
            control={form.control}
            name="url"
            render={({ field }) => (
                <div>
                    <Label htmlFor="url-input">Enter URL</Label>
                    <Input id="url-input" placeholder="https://example.com or YouTube link" {...field} disabled={isLoading} className="mt-1"/>
                    {form.formState.errors.url && <p className="text-sm text-destructive mt-1">{form.formState.errors.url.message}</p>}
                </div>
            )}
        />
      )}

      {inputType === 'text' && (
        <Controller
            control={form.control}
            name="text"
            render={({ field }) => (
                <div>
                    <Label htmlFor="text-input">Paste Text</Label>
                    <Textarea id="text-input" placeholder="Paste your content here..." {...field} rows={8} disabled={isLoading} className="mt-1"/>
                    {form.formState.errors.text && <p className="text-sm text-destructive mt-1">{form.formState.errors.text.message}</p>}
                </div>
            )}
        />
      )}

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
        Extract Content
      </Button>

      {extractedText && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Extracted Content {fileName ? `from ${fileName}` : ''}:</h3>
            <ScrollArea className="h-64 p-2 border rounded-md bg-muted/30">
              <pre className="whitespace-pre-wrap text-sm">{extractedText}</pre>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </form>
  );
}

// Minimal ScrollArea to avoid error if not present yet
const ScrollArea = ({ className, children }: {className?: string, children: React.ReactNode}) => (
  <div className={`overflow-auto ${className || ''}`}>{children}</div>
);
