import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";

interface ActivityPageLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function ActivityPageLayout({ title, description, children }: ActivityPageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="mb-8">
            <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Activities
              </Link>
            </Button>
          </div>
          <div className="relative bg-card p-8 md:p-12 rounded-xl shadow-2xl overflow-hidden">
             <div className="absolute top-0 right-0 -m-4 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
             <div className="absolute bottom-0 left-0 -m-8 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative z-10">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
                    {title}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    {description}
                    </p>
                </div>
                <div className="max-w-2xl mx-auto">
                    {children}
                </div>
            </div>
          </div>
        </section>
      </main>
       <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>Built for the Fresher's Induction. Have a blast!</p>
      </footer>
    </div>
  );
}
