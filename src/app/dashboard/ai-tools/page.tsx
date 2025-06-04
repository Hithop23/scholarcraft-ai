'use client';

import { ContentExtractorForm } from '@/components/ai-tools/ContentExtractorForm';
import { SummarizerTool } from '@/components/ai-tools/SummarizerTool';
import { QuizGeneratorTool } from '@/components/ai-tools/QuizGeneratorTool';
import { FlashcardGeneratorTool } from '@/components/ai-tools/FlashcardGeneratorTool';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, FlaskConical, MessageSquare, Zap } from 'lucide-react';
import { useState } from 'react';

type ExtractedContent = { source: string; text: string } | null;

export default function AiToolsPage() {
  const [extractedContent, setExtractedContent] = useState<ExtractedContent>(null);

  const handleContentExtracted = (source: string, text: string) => {
    setExtractedContent({ source, text });
    // Optionally, switch to summarizer tab or pre-fill other tools
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-3">
        <Zap className="h-10 w-10 text-primary" />
        <div>
          <h1 className="text-3xl font-bold font-headline">AI Learning Tools</h1>
          <p className="text-muted-foreground">
            Supercharge your studies with our suite of intelligent learning assistants.
          </p>
        </div>
      </header>

      <Tabs defaultValue="extractor" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="extractor"><FileText className="mr-2 h-4 w-4" />Content Extractor</TabsTrigger>
          <TabsTrigger value="summarizer"><BookOpen className="mr-2 h-4 w-4" />Summarizer</TabsTrigger>
          <TabsTrigger value="quiz-generator"><FlaskConical className="mr-2 h-4 w-4" />Quiz Generator</TabsTrigger>
          <TabsTrigger value="flashcards"><MessageSquare className="mr-2 h-4 w-4" />Flashcard Maker</TabsTrigger>
        </TabsList>

        <TabsContent value="extractor">
          <Card>
            <CardHeader>
              <CardTitle>Extract Content</CardTitle>
              <CardDescription>
                Upload a PDF, document, or provide a YouTube/web link to extract text content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContentExtractorForm onContentExtracted={handleContentExtracted} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summarizer">
          <Card>
            <CardHeader>
              <CardTitle>Generate Summary</CardTitle>
              <CardDescription>
                Get concise summaries of your study materials. Use extracted content or paste text directly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SummarizerTool initialText={extractedContent?.text} sourceName={extractedContent?.source} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quiz-generator">
          <Card>
            <CardHeader>
              <CardTitle>Create Quizzes</CardTitle>
              <CardDescription>
                Generate quizzes on any topic or based on provided content to test your understanding.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QuizGeneratorTool initialTopic={extractedContent?.source} initialContent={extractedContent?.text} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards">
          <Card>
            <CardHeader>
              <CardTitle>Make Flashcards</CardTitle>
              <CardDescription>
                Create question/answer flashcards from your study materials for active recall.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FlashcardGeneratorTool initialContent={extractedContent?.text} sourceName={extractedContent?.source} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
