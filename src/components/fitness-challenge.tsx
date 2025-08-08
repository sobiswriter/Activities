
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Trophy, Flame, Timer, Repeat } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EXERCISES = ["Push-ups", "Squats", "Sit-ups"];
type Exercise = "Push-ups" | "Squats" | "Sit-ups";

const setupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  exercise: z.enum(EXERCISES),
});

const scoreSchema = z.object({
  reps: z.coerce.number().min(1, "You must complete at least 1 rep."),
});

type Score = { name: string; score: number };
type Leaderboard = {
  [key in Exercise]: Score[];
};

export function FitnessChallenge() {
  const [gameState, setGameState] = useState<"leaderboard" | "setup" | "challenge">("leaderboard");
  const [timer, setTimer] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [leaderboard, setLeaderboard] = useState<Leaderboard>({ "Push-ups": [], Squats: [], "Sit-ups": [] });
  const [challengeConfig, setChallengeConfig] = useState<{ name: string; exercise: Exercise } | null>(null);
  const [lastChallenge, setLastChallenge] = useState<{ name: string; exercise: Exercise } | null>(null);


  const { toast } = useToast();

  const setupForm = useForm<z.infer<typeof setupSchema>>({
    resolver: zodResolver(setupSchema),
    defaultValues: { name: "", exercise: "Push-ups" },
  });

  const scoreForm = useForm<z.infer<typeof scoreSchema>>({
    resolver: zodResolver(scoreSchema),
    defaultValues: {
      reps: 0,
    }
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      toast({
        title: "Time's Up!",
        description: "Great effort! Now enter your score.",
      });
    }
    return () => clearInterval(interval);
  }, [timerActive, timer, toast]);

  function onSetupSubmit(values: z.infer<typeof setupSchema>) {
    setChallengeConfig(values);
    setGameState("challenge");
    setTimer(60);
    setTimerActive(false);
    scoreForm.reset({ reps: 0 });
  }

  function onScoreSubmit(values: z.infer<typeof scoreSchema>) {
    if (!challengeConfig) return;
    const newScore: Score = { name: challengeConfig.name, score: values.reps };
    setLastChallenge(challengeConfig);
    setLeaderboard((prev) => {
      const newScores = [...prev[challengeConfig.exercise], newScore].sort((a, b) => b.score - a.score);
      return { ...prev, [challengeConfig.exercise]: newScores };
    });
    setGameState("leaderboard");
    toast({
        title: "Score Submitted!",
        description: `Awesome job, ${challengeConfig.name}! Check out the leaderboard.`,
    })
  }
  
  const startTimer = () => {
    setTimer(60);
    setTimerActive(true);
  }
  
  if (gameState === "leaderboard") {
      return (
          <div className="space-y-6">
              <Tabs defaultValue={lastChallenge?.exercise ?? "Push-ups"} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    {EXERCISES.map((ex) => (
                        <TabsTrigger key={ex} value={ex}>{ex}</TabsTrigger>
                    ))}
                </TabsList>
                {EXERCISES.map((ex) => (
                     <TabsContent key={ex} value={ex}>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-primary"><Trophy /> {ex} Leaderboard</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Rank</TableHead>
                                            <TableHead>Name</TableHead>
                                            <TableHead className="text-right">Score</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {leaderboard[ex].length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground">No scores yet. Be the first!</TableCell>
                                            </TableRow>
                                        ) : (
                                            leaderboard[ex].map((entry, index) => (
                                                <TableRow key={index} className={entry.name === lastChallenge?.name && ex === lastChallenge?.exercise ? "bg-primary/10" : ""}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>{entry.name}</TableCell>
                                                    <TableCell className="text-right">{entry.score}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
              </Tabs>
              <Button onClick={() => setGameState("setup")} className="w-full text-lg py-6">
                <Flame className="mr-2"/>
                Start New Challenge
              </Button>
          </div>
      )
  }

  if (gameState === "challenge" && challengeConfig) {
    return (
        <div className="space-y-6 text-center">
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-primary">{challengeConfig.exercise}</CardTitle>
                    <CardDescription>Get ready, {challengeConfig.name}! Let's see how many you can do.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="text-6xl font-bold text-foreground">{timer}</div>
                    <Button onClick={startTimer} disabled={timerActive || timer === 0} size="lg">
                        <Timer className="mr-2"/>
                        {timerActive ? "Timer Started!" : "Start 1-Min Timer"}
                    </Button>
                    <p className="text-sm text-muted-foreground">Or, time yourself and enter your reps below.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Log Your Score</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...scoreForm}>
                        <form onSubmit={scoreForm.handleSubmit(onScoreSubmit)} className="flex items-start gap-2">
                           <FormField
                            control={scoreForm.control}
                            name="reps"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input type="number" placeholder="Enter your reps..." {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            />
                            <Button type="submit">Submit Score</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
            <Button variant="outline" onClick={() => setGameState("leaderboard")}>
                <Trophy className="mr-2"/>
                Back to Leaderboard
            </Button>
        </div>
    )
  }

  // gameState is "setup"
  return (
    <Card>
        <CardHeader>
            <CardTitle>Set Up Your Challenge</CardTitle>
            <CardDescription>Enter your name and pick an exercise to get started.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...setupForm}>
                <form onSubmit={setupForm.handleSubmit(onSetupSubmit)} className="space-y-4">
                    <FormField
                        control={setupForm.control}
                        name="name"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Name</FormLabel>
                            <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={setupForm.control}
                        name="exercise"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Exercise</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an exercise" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {EXERCISES.map(ex => <SelectItem key={ex} value={ex}>{ex}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <div className="flex flex-col-reverse sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => setGameState("leaderboard")} className="w-full">Cancel</Button>
                        <Button type="submit" className="w-full">
                            <Flame className="mr-2"/>
                            Start Challenge
                        </Button>
                     </div>
                </form>
            </Form>
      </CardContent>
    </Card>
  );
}
