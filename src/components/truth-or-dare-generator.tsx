"use client";

import { useState } from "react";
import { generateTruthOrDare } from "@/ai/flows/generate-truth-or-dare";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ChallengeType = "truth" | "dare";

export function TruthOrDareGenerator() {
  const [challenge, setChallenge] = useState<string | null>(null);
  const [challengeType, setChallengeType] = useState<ChallengeType | null>(null);
  const [isLoading, setIsLoading] = useState<ChallengeType | null>(null);
  const { toast } = useToast();

  const handleGenerate = async (type: ChallengeType) => {
    setIsLoading(type);
    setChallenge(null);
    setChallengeType(type);
    try {
      const result = await generateTruthOrDare({ type });
      setChallenge(result.challenge);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Challenge",
        description: `Could not generate a ${type}. Please try again.`,
      });
      setChallengeType(null);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={() => handleGenerate("truth")} 
          disabled={!!isLoading}
          className="bg-accent hover:bg-accent/90"
        >
          {isLoading === "truth" ? <Loader2 className="animate-spin" /> : "Get a Truth"}
        </Button>
        <Button 
          onClick={() => handleGenerate("dare")} 
          disabled={!!isLoading}
          variant="destructive"
        >
          {isLoading === "dare" ? <Loader2 className="animate-spin" /> : "Get a Dare"}
        </Button>
      </div>

      {challenge && challengeType && (
        <Card className={`mt-4 ${challengeType === "truth" ? "bg-accent/10" : "bg-destructive/10"}`}>
          <CardHeader>
            <CardTitle className={`text-xl font-bold capitalize ${challengeType === "truth" ? "text-accent" : "text-destructive"}`}>
              {challengeType}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-medium">{challenge}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
