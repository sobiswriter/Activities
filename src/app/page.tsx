
"use client";

import {
  BrainCircuit,
  Drama,
  Heart,
  Puzzle,
  Shuffle,
  Zap,
  HelpCircle,
  Users,
  Eye,
  MessageSquareQuote,
  PersonStanding,
  Dumbbell,
  Gift,
  PartyPopper,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ActivityCard } from "@/components/activity-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

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
  {
    href: "/guess-the-name",
    title: "Guess the Name",
    description: "Use hints and a picture to guess the name.",
    icon: <Eye className="w-12 h-12" />,
    color: "bg-orange-500/20",
    textColor: "text-orange-500",
  },
  {
    href: "/caption-this",
    title: "Caption This!",
    description: "Generate a weird image and write a funny caption.",
    icon: <MessageSquareQuote className="w-12 h-12" />,
    color: "bg-sky-500/20",
    textColor: "text-sky-500",
  },
  {
    href: "/charades",
    title: "Charades with AI",
    description: "Act out the prompt from the AI. No talking!",
    icon: <PersonStanding className="w-12 h-12" />,
    color: "bg-pink-500/20",
    textColor: "text-pink-500",
  },
  {
    href: "/fitness-challenge",
    title: "Fitness Challenge",
    description: "Challenge yourself and see how you rank on the leaderboard.",
    icon: <Dumbbell className="w-12 h-12" />,
    color: "bg-green-500/20",
    textColor: "text-green-500",
  },
];

type Activity = (typeof activities)[0];

export default function Home() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleRandomChallenge = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedActivity(null);

    const totalDuration = 4000; // Total spin time
    const finalIndex = Math.floor(Math.random() * activities.length);
    let currentDelay = 50; // Initial fast delay
    let elapsed = 0;
    
    let spinTimeout: NodeJS.Timeout;

    const spin = () => {
        setHighlightedIndex(prev => (prev + 1) % activities.length);

        elapsed += currentDelay;
        
        // Start slowing down in the last 1.5 seconds
        if (elapsed > totalDuration - 1500) {
            currentDelay *= 1.2; 
        }

        if (elapsed < totalDuration) {
            spinTimeout = setTimeout(spin, currentDelay);
        } else {
            setHighlightedIndex(finalIndex);
            const activity = activities[finalIndex];
            setSelectedActivity(activity);
             
            setTimeout(() => {
                router.push(activity.href);
                setIsSpinning(false);
                setHighlightedIndex(-1);
                setSelectedActivity(null);
            }, 2000); // Wait 2 seconds on the final choice
        }
    };
    
    spin();
  };

  return (
    <>
      <div className="flex flex-col min-h-screen bg-background">
        <SiteHeader />
        <main className="flex-1">
          <section className="container mx-auto px-4 py-8 md:py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
                Welcome to Induction Ignition!
              </h1>
              <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Your one-stop station for fun, ice-breaking activities. Pick a card, or take a chance!
              </p>
              <div className="mt-8">
                <Button size="lg" onClick={handleRandomChallenge} disabled={isSpinning} className="text-lg py-6 shadow-lg hover:shadow-primary/40 transition-shadow">
                  <Gift className="mr-2" />
                  {isSpinning ? "Finding a challenge..." : "I'm Feeling Lucky!"}
                </Button>
              </div>
            </div>
            <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8", isSpinning && "pointer-events-none")}>
              {activities.map((activity, index) => {
                const Wrapper = isSpinning ? 'div' : Link;
                const props = isSpinning ? {} : { href: activity.href };

                return (
                   <Wrapper {...props} key={index}>
                      <ActivityCard
                      title={activity.title}
                      description={activity.description}
                      icon={activity.icon}
                      color={activity.color}
                      textColor={activity.textColor}
                      className={cn(
                          "transition-all duration-100 ease-in-out",
                          highlightedIndex === index && "ring-4 ring-primary ring-offset-4 ring-offset-background"
                      )}
                      />
                  </Wrapper>
                );
              })}
            </div>
          </section>
        </main>
        <footer className="py-6 text-center text-muted-foreground text-sm">
          <p>Built for the Fresher's Induction. Have a blast!</p>
        </footer>
      </div>

      <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
        <DialogContent className="text-center p-8">
          <DialogHeader>
            <div className="mx-auto bg-primary/20 rounded-full p-4 w-fit">
                <PartyPopper className="w-12 h-12 text-primary" />
            </div>
            <DialogTitle className="text-3xl font-bold text-primary mt-4">
              Let's Play!
            </DialogTitle>
            <DialogDescription className="text-xl">
              You're heading to <span className="font-bold text-foreground">{selectedActivity?.title}</span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
