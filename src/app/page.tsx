import {
  BrainCircuit,
  Drama,
  Heart,
  Puzzle,
  Zap,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SiteHeader } from "@/components/site-header";
import { ActivityCard } from "@/components/activity-card";
import { RiddleGenerator } from "@/components/riddle-generator";
import { IqTestGenerator } from "@/components/iq-test-generator";
import { TruthOrDareGenerator } from "@/components/truth-or-dare-generator";
import { FlirtQuestionGenerator } from "@/components/flirt-question-generator";
import { RapidFireGenerator } from "@/components/rapid-fire-generator";

export default function Home() {
  const activities = [
    {
      trigger: (
        <ActivityCard
          title="Riddles"
          description="Challenge your mind with fun and tricky riddles."
          icon={<Puzzle className="w-12 h-12" />}
          color="bg-accent/20"
          textColor="text-accent"
        />
      ),
      content: <RiddleGenerator />,
      title: "Fun Riddles",
    },
    {
      trigger: (
        <ActivityCard
          title="IQ Test"
          description="Test your smarts with these cool IQ questions."
          icon={<BrainCircuit className="w-12 h-12" />}
          color="bg-primary/20"
          textColor="text-primary"
        />
      ),
      content: <IqTestGenerator />,
      title: "IQ Test",
    },
    {
      trigger: (
        <ActivityCard
          title="Truth or Dare"
          description="Get to know each other with this classic game."
          icon={<Drama className="w-12 h-12" />}
          color="bg-destructive/20"
          textColor="text-destructive"
        />
      ),
      content: <TruthOrDareGenerator />,
      title: "Truth or Dare",
    },
    {
      trigger: (
        <ActivityCard
          title="Flirt Questions"
          description="Break the ice with some charming questions."
          icon={<Heart className="w-12 h-12" />}
          color="bg-secondary"
          textColor="text-destructive"
        />
      ),
      content: <FlirtQuestionGenerator />,
      title: "Flirt Questions",
    },
    {
      trigger: (
        <ActivityCard
          title="Rapid Fire"
          description="Quick questions for quick thinking. Go!"
          icon={<Zap className="w-12 h-12" />}
          color="bg-muted"
          textColor="text-primary"
        />
      ),
      content: <RapidFireGenerator />,
      title: "Rapid Fire Round",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>{activity.trigger}</DialogTrigger>
                <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-card">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline text-primary">
                      {activity.title}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="py-4">{activity.content}</div>
                </DialogContent>
              </Dialog>
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
