import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b">
      <div className="container mx-auto flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-bold font-headline text-foreground">
          Team 7
        </h2>
      </div>
    </header>
  );
}
