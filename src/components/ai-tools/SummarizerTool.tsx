'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, BookOpen } from 'lucide-react';
import { summarizeContent } from '@/ai/flows/summarize-content';
import { Card, CardContent } from '@/components/ui/card';
import { saveSummary } from '@/lib/firebase/firestoreService';
import { useAuthContext } from '@/hooks/useAuthContext';

const summarizerSchema = z.object({
  textToSummarize: z.string().min(50, { message: 'Content must be at least 50 characters long.' }),
});

type SummarizerFormValues = z.infer<typeof summarizerSchema>;

interface SummarizerToolProps {
  initialText?: string | null;
  sourceName?: string | null; // e.g. file name or URL
}

export function SummarizerTool({ initialText, sourceName }: SummarizerToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuthContext();

  const form = useForm<SummarizerFormValues>({
    resolver: zodResolver(summarizerSchema),
    defaultValues: {
      textToSummarize: initialText || '',
    },
  });

  useEffect(() => {
    if (initialText) {
      form.setValue('textToSummarize', initialText);
    }
  }, [initialText, form]);

  const onSubmit = async (values: SummarizerFormValues) => {
    setIsLoading(true);
    setSummary(null);
    try {
      const response = await summarizeContent({ content: values.textToSummarize });
      setSummary(response.summary);
      toast({ title: 'Summary Generated', description: 'Content summarized successfully.' });

      if(user && response.summary) {
        // Optionally save the summary
        await saveSummary(user.uid, sourceName || "Pasted Content", response.summary, `Summary of ${sourceName || "Pasted Content"}`);
        toast({ title: 'Summary Saved', description: 'Your summary has been saved to your profile.' });
      }

    } catch (error: any) {
      console.error('Summarization error:', error);
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: error.message || 'Could not generate summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="textToSummarize">Content to Summarize {sourceName ? `(from ${sourceName})` : ''}</Label>
        <Textarea
          id="textToSummarize"
          placeholder="Paste or type the content you want to summarize here..."
          {...form.register('textToSummarize')}
          rows={10}
          className="mt-1"
          disabled={isLoading}
        />
        {form.formState.errors.textToSummarize && (
          <p className="text-sm text-destructive mt-1">{form.formState.errors.textToSummarize.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
        Generate Summary
      </Button>

      {summary && (
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2">Generated Summary:</h3>
            <ScrollArea className="h-64 p-2 border rounded-md bg-muted/30">
                <p className="whitespace-pre-wrap text-sm">{summary}</p>
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
