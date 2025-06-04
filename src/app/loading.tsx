import { Skeleton } from "@/components/ui/skeleton";
import Logo from "@/components/Logo";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="flex flex-col items-center space-y-6">
        <Logo size="lg" />
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <p className="text-lg text-muted-foreground">Loading ScholarCraft AI...</p>
      </div>
       {/* Fallback skeleton for general page structure */}
      <div className="space-y-4 w-full max-w-2xl mt-12 opacity-50">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-8 w-3/4" />
        <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    </div>
  );
}
