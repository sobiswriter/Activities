"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateRapidFireQuestion } from "@/ai/flows/generate-rapid-fire-question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  topic: z.string().optional(),
  number: z.number().min(1).max(10).default(5),
});

const DURATION_PER_QUESTION = 10; // seconds

export function RapidFireGenerator() {
  const [questions, setQuestions] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      number: 5,
    },
  });

  const questionCount = form.watch("number");

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && gameStarted) {
      setGameStarted(false);
      toast({
        title: "Time's Up!",
        description: "The rapid fire round has ended.",
      });
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestions(null);
    setGameStarted(false);
    try {
      const result = await generateRapidFireQuestion(values);
      setQuestions(result.questions);
      const duration = (values.number || 5) * DURATION_PER_QUESTION;
      setTotalTime(duration);
      setTimeRemaining(duration);
      setGameStarted(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Starting Game",
        description: "Could not generate questions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleReset = () => {
    setQuestions(null);
    setGameStarted(false);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (gameStarted && questions) {
    const progress = (timeRemaining / totalTime) * 100;
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Time Remaining: {timeRemaining}s</CardTitle>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          <CardContent>
            <h3 className="mb-4 text-lg font-semibold">Your questions:</h3>
            <ol className="list-decimal list-inside space-y-2">
              {questions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Button onClick={handleReset} variant="outline" className="w-full">
          Play Again
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Superheroes, History, Science" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Questions: {questionCount}</FormLabel>
              <FormControl>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(vals) => field.onChange(vals[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Start Rapid Fire"}
        </Button>
      </form>
    </Form>
  );
}
