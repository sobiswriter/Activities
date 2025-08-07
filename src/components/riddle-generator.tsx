"use client";

import { useState } from "react";
import { generateRiddle, type GenerateRiddleOutput } from "@/ai/flows/generate-riddle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function RiddleGenerator() {
  const [data, setData] = useState<GenerateRiddleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setData(null);
    setShowAnswer(false);
    try {
      const result = await generateRiddle({});
      if (result.isAgeAppropriate) {
        setData(result);
      } else {
        // Retry if the riddle is not appropriate
        toast({
          title: "Riddle Unsuitable",
          description: "Generated riddle was not appropriate. Retrying...",
        });
        handleGenerate();
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Riddle",
        description: "Could not generate a riddle. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate a Fun Riddle"}
      </Button>
      
      {!data && !isLoading && (
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Ready for a challenge?</AlertTitle>
          <AlertDescription>
            Click the button above to generate a new riddle!
          </AlertDescription>
        </Alert>
      )}

      {data && (
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle>Here's your riddle:</CardTitle>
            <CardDescription className="text-lg pt-2 text-foreground">{data.riddle}</CardDescription>
          </CardHeader>
          {showAnswer && (
             <CardContent>
                <div className="space-y-2 pt-4 border-t">
                  <h3 className="font-semibold text-primary">Answer:</h3>
                  <p className="text-lg">{data.answer}</p>
                </div>
              </CardContent>
          )}
          <CardFooter>
            <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)} className="w-full">
              {showAnswer ? "Hide Answer" : "Reveal Answer"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
