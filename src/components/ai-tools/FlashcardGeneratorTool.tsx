'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, MessageSquare, RotateCcw } from 'lucide-react';
import { generateFlashcards, type GenerateFlashcardsOutput } from '@/ai/flows/generate-flashcards';
import type { Flashcard as FlashcardType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const flashcardGeneratorSchema = z.object({
  content: z.string().min(50, { message: 'Content must be at least 50 characters long to generate flashcards.' }),
});

type FlashcardFormValues = z.infer<typeof flashcardGeneratorSchema>;

interface FlashcardGeneratorToolProps {
  initialContent?: string | null;
  sourceName?: string | null;
}

export function FlashcardGeneratorTool({ initialContent, sourceName }: FlashcardGeneratorToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardType[] | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { toast } = useToast();

  const form = useForm<FlashcardFormValues>({
    resolver: zodResolver(flashcardGeneratorSchema),
    defaultValues: {
      content: initialContent || '',
    },
  });

  useEffect(() => {
    if (initialContent) {
      form.setValue('content', initialContent);
    }
  }, [initialContent, form]);

  const onSubmit = async (values: FlashcardFormValues) => {
    setIsLoading(true);
    setFlashcards(null);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    try {
      const response: GenerateFlashcardsOutput = await generateFlashcards({
        topicOrDocument: values.content,
      });
      setFlashcards(response.flashcards);
      toast({ title: 'Flashcards Generated', description: `Created ${response.flashcards.length} flashcards.` });
    } catch (error: any) {
      console.error('Flashcard generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Flashcard Generation Failed',
        description: error.message || 'Could not generate flashcards. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleNextCard = () => {
    if (flashcards && currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };
  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };
  
  const currentCard = flashcards?.[currentCardIndex];

  return (
    <div className="space-y-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="flashcard-content">Content for Flashcards {sourceName ? `(from ${sourceName})` : ''}</Label>
          <Textarea
            id="flashcard-content"
            placeholder="Paste text or notes here to generate flashcards..."
            {...form.register('content')}
            rows={8}
            className="mt-1"
            disabled={isLoading || !!flashcards} // Disable if flashcards are already generated
          />
          {form.formState.errors.content && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.content.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full md:w-auto" disabled={isLoading || !!flashcards}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageSquare className="mr-2 h-4 w-4" />}
          Generate Flashcards
        </Button>
         {flashcards && (
          <Button variant="outline" onClick={() => {setFlashcards(null); form.reset({content: initialContent || ''});}} className="w-full md:w-auto ml-2">
            Start Over
          </Button>
        )}
      </form>

      {flashcards && currentCard && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Flashcard {currentCardIndex + 1} of {flashcards.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="h-64 p-6 border rounded-md flex items-center justify-center text-center bg-card cursor-pointer perspective"
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === ' ' || e.key === 'Enter' ? handleFlip() : null}
              aria-pressed={isFlipped}
              aria-label={isFlipped ? `Answer: ${currentCard.answer}` : `Question: ${currentCard.question}`}
            >
              <div className={`transition-transform duration-700 ease-in-out preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                <div className={`absolute inset-0 flex items-center justify-center p-4 backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                  <p className="text-xl font-medium">{currentCard.question}</p>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center p-4 backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-lg">{currentCard.answer}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button onClick={handlePrevCard} disabled={currentCardIndex === 0} variant="outline">Previous</Button>
            <Button onClick={handleFlip} variant="secondary">
              <RotateCcw className="mr-2 h-4 w-4"/> Flip Card
            </Button>
            <Button onClick={handleNextCard} disabled={currentCardIndex === flashcards.length - 1} variant="outline">Next</Button>
          </CardFooter>
        </Card>
      )}
      <style jsx global>{`
        .perspective { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
}
