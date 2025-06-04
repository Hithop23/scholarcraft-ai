import { BrainCircuit } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const Logo = ({ size = 'md', className }: LogoProps) => {
  const textSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-2xl' : 'text-3xl';
  const iconSizeClass = size === 'sm' ? 'h-6 w-6' : size === 'md' ? 'h-7 w-7' : 'h-8 w-8';

  return (
    <Link href="/" className={`flex items-center gap-2 ${className || ''}`} aria-label="ScholarCraft AI Home">
      <BrainCircuit className={`${iconSizeClass} text-primary`} />
      <span className={`font-headline font-bold ${textSize} text-foreground whitespace-nowrap`}>
        ScholarCraft AI
      </span>
    </Link>
  );
};

export default Logo;
