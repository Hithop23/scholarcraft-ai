'use client';

import { useAuthContext } from '@/hooks/useAuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Zap, CalendarDays, UploadCloud, User, ArrowRight, BookOpen, FlaskConical, MessageSquare, FileText } from 'lucide-react';
import Image from 'next/image';

interface FeatureCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, href, icon }) => (
  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
    <CardHeader className="flex flex-row items-center space-x-4 pb-2">
      {icon}
      <CardTitle className="text-xl">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex-grow">
      <CardDescription>{description}</CardDescription>
    </CardContent>
    <CardContent>
      <Button asChild variant="outline" className="w-full">
        <Link href={href}>
          Go to {title} <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </CardContent>
  </Card>
);


export default function DashboardPage() {
  const { user } = useAuthContext();

  if (!user) {
    // This should ideally be handled by AuthGuard, but as a fallback:
    return (
      <div className="flex items-center justify-center h-full">
        <p>Loading user data...</p>
      </div>
    );
  }

  const dashboardFeatures: FeatureCardProps[] = [
    {
      title: 'AI Learning Tools',
      description: 'Extract, summarize, generate quizzes and flashcards.',
      href: '/dashboard/ai-tools',
      icon: <Zap className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Smart Calendar',
      description: 'Manage your adaptive study plans and schedules.',
      href: '/dashboard/calendar',
      icon: <CalendarDays className="h-8 w-8 text-primary" />,
    },
    {
      title: 'My Files',
      description: 'Upload and organize your learning materials.',
      href: '/dashboard/files',
      icon: <UploadCloud className="h-8 w-8 text-primary" />,
    },
    {
      title: 'Your Profile',
      description: 'View and update your personal information and stats.',
      href: '/dashboard/profile',
      icon: <User className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-card p-6 rounded-lg shadow">
        <h1 className="text-3xl font-bold font-headline">Welcome back, {user.displayName?.split(' ')[0] || 'User'}!</h1>
        <p className="text-muted-foreground mt-2">
          Ready to dive back into your studies? Here’s what you can do:
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {dashboardFeatures.map(feature => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Quick Access: AI Tools</CardTitle>
          <CardDescription>Jump directly into our powerful AI-powered learning utilities.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Content Extractor', href: '/dashboard/ai-tools#extractor', icon: <FileText className="h-5 w-5 text-primary"/>, description: "Pull text from various sources." },
            { title: 'Summarizer', href: '/dashboard/ai-tools#summarizer', icon: <BookOpen className="h-5 w-5 text-primary"/>, description: "Get key points quickly." },
            { title: 'Quiz Generator', href: '/dashboard/ai-tools#quiz-generator', icon: <FlaskConical className="h-5 w-5 text-primary"/>, description: "Test your knowledge." },
            { title: 'Flashcard Maker', href: '/dashboard/ai-tools#flashcards', icon: <MessageSquare className="h-5 w-5 text-primary"/>, description: "Create study cards." },
          ].map(tool => (
            <Link key={tool.title} href={tool.href} className="block p-4 border rounded-lg hover:bg-muted transition-colors">
              <div className="flex items-center gap-3 mb-1">
                {tool.icon}
                <h3 className="font-semibold">{tool.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
        </CardContent>
      </Card>
      
      <Card className="shadow-lg">
         <CardHeader>
          <CardTitle className="text-2xl">Study Tip of the Day</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
            <Image src="https://placehold.co/150x100.png" alt="Study tip visual" width={150} height={100} className="rounded-md" data-ai-hint="motivation study" />
            <div>
              <p className="text-lg font-medium text-primary">Active Recall is Key!</p>
              <p className="text-muted-foreground">Instead of passively re-reading notes, try to recall information from memory. This strengthens neural pathways and improves long-term retention. Use flashcards or try explaining concepts to someone else (or even to yourself!).</p>
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
