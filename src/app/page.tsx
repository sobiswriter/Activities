import {
  BrainCircuit,
  Drama,
  Heart,
  Puzzle,
  Shuffle,
  Zap,
  HelpCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { ActivityCard } from "@/components/activity-card";

export default function Home() {
  const activities = [
    {
      href: "/riddles",
      title: "Riddles",
      description: "Challenge your mind with fun and tricky riddles.",
      icon: <Puzzle className="w-12 h-12" />,
      color: "bg-accent/20",
      textColor: "text-accent",
    },
    {
      href: "/iq-test",
      title: "IQ Test",
      description: "Test your smarts with these cool IQ questions.",
      icon: <BrainCircuit className="w-12 h-12" />,
      color: "bg-primary/20",
      textColor: "text-primary",
    },
    {
      href: "/truth-or-dare",
      title: "Truth or Dare",
      description: "Get to know each other with this classic game.",
      icon: <Drama className="w-12 h-12" />,
      color: "bg-destructive/20",
      textColor: "text-destructive",
    },
    {
      href: "/flirt-questions",
      title: "Flirt Questions",
      description: "Break the ice with some charming questions.",
      icon: <Heart className="w-12 h-12" />,
      color: "bg-secondary",
      textColor: "text-destructive",
    },
    {
      href: "/rapid-fire",
      title: "Rapid Fire",
      description: "Quick questions for quick thinking. Go!",
      icon: <Zap className="w-12 h-12" />,
      color: "bg-muted",
      textColor: "text-primary",
    },
    {
      href: "/would-you-rather",
      title: "Would You Rather",
      description: "Make a tough choice between two fun scenarios.",
      icon: <Shuffle className="w-12 h-12" />,
      color: "bg-yellow-500/20",
      textColor: "text-yellow-500",
    },
    {
      href: "/two-truths-and-a-lie",
      title: "Two Truths and a Lie",
      description: "Can you spot the lie? Test your intuition.",
      icon: <HelpCircle className="w-12 h-12" />,
      color: "bg-teal-500/20",
      textColor: "text-teal-500",
    },
    {
      href: "/most-likely-to",
      title: "Who's Most Likely To...",
      description: "Who in your group fits the bill? Point and laugh!",
      icon: <Users className="w-12 h-12" />,
      color: "bg-purple-500/20",
      textColor: "text-purple-500",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="container mx-auto px-4 py-8 md:py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
              Welcome to Induction Ignition!
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Your one-stop station for fun, ice-breaking activities. Pick a card and let the games begin!
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activities.map((activity, index) => (
              <Link href={activity.href} key={index}>
                <ActivityCard
                  title={activity.title}
                  description={activity.description}
                  icon={activity.icon}
                  color={activity.color}
                  textColor={activity.textColor}
                />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <footer className="py-6 text-center text-muted-foreground text-sm">
        <p>Built for the Fresher's Induction. Have a blast!</p>
      </footer>
    </div>
  );
}
