
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateGuessTheName, type GenerateGuessTheNameOutput } from "@/ai/flows/generate-guess-the-name";
import { generateImage } from "@/ai/flows/generate-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Eye, Lightbulb, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const formSchema = z.object({
  topic: z.string().optional(),
});

const guessSchema = z.object({
    guess: z.string().min(1, "Please enter a guess."),
});

export function GuessTheNameGenerator() {
  const [challenge, setChallenge] = useState<GenerateGuessTheNameOutput | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuessing, setIsGuessing] = useState(false);
  const [revealedHints, setRevealedHints] = useState<string[]>([]);
  const [imageRevealed, setImageRevealed] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "answered">("idle");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const { toast } = useToast();

  const topicForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { topic: "" },
  });

  const guessForm = useForm<z.infer<typeof guessSchema>>({
    resolver: zodResolver(guessSchema),
    defaultValues: { guess: "" },
  });

  async function onGenerate(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setChallenge(null);
    setImage(null);
    setRevealedHints([]);
    setImageRevealed(false);
    setGameState("playing");
    setIsCorrect(null);
    guessForm.reset();

    try {
      const result = await generateGuessTheName(values);
      setChallenge(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Challenge",
        description: "Could not generate a new challenge. Please try again.",
      });
      setGameState("idle");
    } finally {
      setIsLoading(false);
    }
  }
  
  const revealHint = () => {
    if (challenge && revealedHints.length < challenge.hints.length) {
      setRevealedHints([...revealedHints, challenge.hints[revealedHints.length]]);
    }
  };

  const revealImage = async () => {
      if (!challenge || !challenge.imagePrompt) return;
      setImageRevealed(true);
      try {
        const result = await generateImage({ prompt: challenge.imagePrompt });
        setImage(result.imageDataUri);
      } catch (error) {
          console.error(error);
          toast({
              variant: "destructive",
              title: "Error Generating Image",
              description: "Could not generate the image clue. Please try again.",
          });
          setImageRevealed(false);
      }
  };

  function onGuess(values: z.infer<typeof guessSchema>) {
    if (!challenge) return;
    setIsGuessing(true);
    const correct = values.guess.trim().toLowerCase() === challenge.name.toLowerCase();
    setIsCorrect(correct);
    setGameState("answered");
    setIsGuessing(false);
    
    toast({
        title: correct ? "You got it!" : "Not quite!",
        description: correct ? `The answer was indeed ${challenge.name}.` : `The correct answer was ${challenge.name}.`,
        variant: correct ? "default" : "destructive",
    });
  }

  const handlePlayAgain = () => {
    setGameState("idle");
    topicForm.reset();
  }

  if (gameState === "idle") {
    return (
        <Form {...topicForm}>
          <form onSubmit={topicForm.handleSubmit(onGenerate)} className="space-y-4 text-center">
            <FormField
              control={topicForm.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Celebrities, Historical Figures, Countries" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Start New Game"}
            </Button>
          </form>
        </Form>
    )
  }

  if (isLoading) {
      return (
          <div className="flex justify-center items-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg">Generating a new challenge...</p>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      {challenge && (
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-primary">I'm thinking of...</CardTitle>
            <CardDescription className="text-lg pt-2 text-foreground">{challenge.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {revealedHints.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-accent-foreground flex items-center"><Lightbulb className="mr-2 h-5 w-5 text-accent"/>Hints:</h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {revealedHints.map((hint, index) => <li key={index}>{hint}</li>)}
                    </ul>
                </div>
            )}
            {imageRevealed && (
                <div className="space-y-2">
                    <h3 className="font-semibold text-accent-foreground flex items-center"><ImageIcon className="mr-2 h-5 w-5 text-accent"/>Visual Clue:</h3>
                     {image ? (
                        <Image src={image} alt="Visual clue" width={500} height={500} className="rounded-lg border-2 border-primary/20" data-ai-hint="guess image"/>
                    ) : (
                        <div className="flex items-center justify-center h-48 bg-muted rounded-lg">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    )}
                </div>
            )}
             {gameState === "answered" && (
                <Alert variant={isCorrect ? "default" : "destructive"} className="bg-secondary">
                  <AlertTitle className="text-xl font-bold">{isCorrect ? "Correct!" : "Nice Try!"}</AlertTitle>
                  <AlertDescription className="text-base">
                    The answer is <span className="font-bold text-primary">{challenge.name}</span>.
                  </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
             {gameState === "playing" && (
                <div className="grid grid-cols-2 gap-4 w-full">
                    <Button variant="outline" onClick={revealHint} disabled={revealedHints.length >= challenge.hints.length}>
                       <Lightbulb className="mr-2"/> Reveal Hint ({challenge.hints.length - revealedHints.length} left)
                    </Button>
                    <Button variant="outline" onClick={revealImage} disabled={imageRevealed}>
                        <ImageIcon className="mr-2"/> Reveal Image
                    </Button>
                </div>
             )}

            {gameState === "playing" ? (
                <Form {...guessForm}>
                    <form onSubmit={guessForm.handleSubmit(onGuess)} className="flex w-full space-x-2">
                    <FormField
                        control={guessForm.control}
                        name="guess"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input placeholder="Enter your guess..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Button type="submit" disabled={isGuessing}>
                            {isGuessing ? <Loader2 className="animate-spin" /> : <Eye/>}
                            Submit
                        </Button>
                    </form>
                </Form>
            ) : (
                <Button onClick={handlePlayAgain} className="w-full text-lg py-6">
                    Play Again
                </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
