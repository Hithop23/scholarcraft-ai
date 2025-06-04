
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, BookOpen, Zap, CalendarDays, UploadCloud, Users } from 'lucide-react';
import Logo from '@/components/Logo';
import Image from 'next/image';

const features = [
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'AI Content Generation',
    description: 'Extract insights, summarize texts, and generate quizzes & flashcards effortlessly.',
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: 'Seamless Authentication',
    description: 'Secure sign-up/login with email, Google, and Microsoft, including role-based access.',
  },
  {
    icon: <BookOpen className="h-8 w-8 text-primary" />,
    title: 'Personalized Profiles',
    description: 'Track your progress, manage schedules, and view learning statistics.',
  },
  {
    icon: <CalendarDays className="h-8 w-8 text-primary" />,
    title: 'Smart Study Calendar',
    description: 'Automatically generate adaptive study plans tailored to your availability.',
  },
  {
    icon: <UploadCloud className="h-8 w-8 text-primary" />,
    title: 'Secure File Storage',
    description: 'Upload and manage your learning materials (PDFs, videos, etc.) safely.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
              Unlock Your Learning Potential with <span className="text-primary">ScholarCraft AI</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground md:text-xl">
              Leverage AI to create personalized study plans, generate learning materials, and master any subject faster than ever before.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Start Learning Now</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Placeholder Image Section */}
        <section className="py-12 bg-muted">
          <div className="container">
            <Card className="overflow-hidden shadow-xl">
              <Image 
                src="https://placehold.co/1200x600.png" 
                alt="ScholarCraft AI dashboard preview" 
                width={1200} 
                height={600}
                className="w-full h-auto object-cover"
                data-ai-hint="education technology"
                priority
              />
            </Card>
          </div>
        </section>
        

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28">
          <div className="container">
            <h2 className="font-headline text-3xl font-bold text-center md:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mt-4 mb-12 text-center text-lg text-muted-foreground">
              ScholarCraft AI provides a comprehensive suite of tools for modern learners.
            </p>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold md:text-4xl">
              Ready to Revolutionize Your Studies?
            </h2>
            <p className="mt-4 mb-8 max-w-xl mx-auto text-lg">
              Join ScholarCraft AI today and experience the future of learning.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signup">Sign Up for Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} ScholarCraft AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
