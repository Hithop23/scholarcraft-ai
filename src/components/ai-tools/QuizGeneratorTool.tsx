'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FlaskConical } from 'lucide-react';
import { generateQuiz, type GenerateQuizOutput } from '@/ai/flows/generate-quiz';
import type { QuizQuestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";


const quizGeneratorSchema = z.object({
  topic: z.string().min(3, { message: 'Topic must be at least 3 characters long.' }),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  numberOfQuestions: z.coerce.number().min(1).max(10), // Kept max 10 for demo speed
  contextText: z.string().optional(), // Optional context text
});

type QuizFormValues = z.infer<typeof quizGeneratorSchema>;

interface QuizGeneratorToolProps {
  initialTopic?: string | null;
  initialContent?: string | null;
}

export function QuizGeneratorTool({ initialTopic, initialContent }: QuizGeneratorToolProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizGeneratorSchema),
    defaultValues: {
      topic: initialTopic || '',
      difficulty: 'medium',
      numberOfQuestions: 5,
      contextText: initialContent || '',
    },
  });
  
  useEffect(() => {
    if (initialTopic) form.setValue('topic', initialTopic);
    if (initialContent) form.setValue('contextText', initialContent);
  }, [initialTopic, initialContent, form]);


  const onSubmit = async (values: QuizFormValues) => {
    setIsLoading(true);
    setQuiz(null);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);

    try {
      // The AI flow `generateQuiz` expects topic, difficulty, and numberOfQuestions.
      // If contextText is provided, it should ideally be part of the prompt for the AI.
      // We can prepend it to the topic or have a more sophisticated way to pass context.
      let combinedTopic = values.topic;
      if (values.contextText && values.contextText.trim().length > 0) {
        combinedTopic = `${values.topic} (based on the following context: ${values.contextText.substring(0, 500)}...)`; // Limit context in topic for brevity
      }

      const response: GenerateQuizOutput = await generateQuiz({
        topic: combinedTopic,
        difficulty: values.difficulty,
        numberOfQuestions: values.numberOfQuestions,
      });
      
      // The flow returns quiz as a JSON string. Parse it.
      const parsedQuiz: QuizQuestion[] = JSON.parse(response.quiz);
      setQuiz(parsedQuiz);
      toast({ title: 'Quiz Generated', description: 'Your quiz is ready!' });
    } catch (error: any) {
      console.error('Quiz generation error:', error);
      toast({
        variant: 'destructive',
        title: 'Quiz Generation Failed',
        description: error.message || 'Could not generate quiz. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }));
  };

  const handleNextQuestion = () => {
    if (quiz && currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    if (!quiz) return 0;
    let correctAnswers = 0;
    quiz.forEach((q, index) => {
      if (userAnswers[index] === q.answer) {
        correctAnswers++;
      }
    });
    return (correctAnswers / quiz.length) * 100;
  };

  if (showResults && quiz) {
    const score = calculateScore();
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant={score >= 70 ? "default" : "destructive"}>
            <FlaskConical className="h-4 w-4" />
            <AlertDescription>
              You scored {score.toFixed(0)}% ({Object.values(userAnswers).filter((ans, i) => quiz[i].answer === ans).length} out of {quiz.length} correct).
            </AlertDescription>
          </Alert>
          {quiz.map((q, index) => (
            <div key={index} className={`p-3 border rounded-md ${userAnswers[index] === q.answer ? 'border-green-500 bg-green-500/10' : 'border-red-500 bg-red-500/10'}`}>
              <p className="font-semibold">{index + 1}. {q.question}</p>
              <p className="text-sm">Your answer: {userAnswers[index] || "Not answered"}</p>
              <p className="text-sm">Correct answer: {q.answer}</p>
            </div>
          ))}
          <Button onClick={() => { setQuiz(null); setShowResults(false); setUserAnswers({}); setCurrentQuestionIndex(0); }}>
            Create New Quiz
          </Button>
        </CardContent>
      </Card>
    );
  }


  if (quiz) {
    const currentQuestion = quiz[currentQuestionIndex];
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question {currentQuestionIndex + 1} of {quiz.length}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-lg font-medium">{currentQuestion.question}</p>
          <RadioGroup
            value={userAnswers[currentQuestionIndex] || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestionIndex, value)}
            className="space-y-2"
          >
            {currentQuestion.options.map((option, i) => (
              <div key={i} className="flex items-center space-x-2 p-2 border rounded-md hover:bg-muted has-[input:checked]:bg-primary/10 has-[input:checked]:border-primary">
                <RadioGroupItem value={option} id={`q${currentQuestionIndex}-option${i}`} />
                <Label htmlFor={`q${currentQuestionIndex}-option${i}`} className="cursor-pointer flex-1">{option}</Label>
              </div>
            ))}
          </RadioGroup>
          <div className="flex justify-between">
            <Button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} variant="outline">
              Previous
            </Button>
            {currentQuestionIndex === quiz.length - 1 ? (
              <Button onClick={handleSubmitQuiz} disabled={Object.keys(userAnswers).length !== quiz.length}>Submit Quiz</Button>
            ) : (
              <Button onClick={handleNextQuestion}>Next</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }


  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="topic">Topic</Label>
        <Input id="topic" placeholder="e.g., Photosynthesis, World War II" {...form.register('topic')} className="mt-1" disabled={isLoading}/>
        {form.formState.errors.topic && <p className="text-sm text-destructive mt-1">{form.formState.errors.topic.message}</p>}
      </div>

      <div>
        <Label htmlFor="contextText">Context (Optional)</Label>
        <Textarea
          id="contextText"
          placeholder="Provide some text or notes for the AI to base the quiz on..."
          {...form.register('contextText')}
          rows={5}
          className="mt-1"
          disabled={isLoading}
        />
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            defaultValue={form.getValues('difficulty')}
            onValueChange={(value) => form.setValue('difficulty', value as 'easy' | 'medium' | 'hard')}
            disabled={isLoading}
          >
            <SelectTrigger id="difficulty" className="mt-1">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="numberOfQuestions">Number of Questions</Label>
          <Input
            id="numberOfQuestions"
            type="number"
            min="1" max="10"
            {...form.register('numberOfQuestions')}
            className="mt-1"
            disabled={isLoading}
          />
          {form.formState.errors.numberOfQuestions && (
            <p className="text-sm text-destructive mt-1">{form.formState.errors.numberOfQuestions.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FlaskConical className="mr-2 h-4 w-4" />}
        Generate Quiz
      </Button>
    </form>
  );
}
