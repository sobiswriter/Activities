"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateIQTestQuestion, type GenerateIQTestQuestionOutput } from "@/ai/flows/generate-iq-test-question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("easy"),
});

export function IqTestGenerator() {
  const [data, setData] = useState<GenerateIQTestQuestionOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      difficulty: "easy",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setData(null);
    setShowAnswer(false);
    try {
      const result = await generateIQTestQuestion(values);
      setData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Question",
        description: "Could not generate an IQ test question. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Topic (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Math, Logic, Patterns" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate Question"}
          </Button>
        </form>
      </Form>
      
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Question:</CardTitle>
            <CardDescription className="text-lg pt-2 text-foreground">{data.question}</CardDescription>
          </CardHeader>
          <CardContent>
            {showAnswer && (
              <div className="space-y-4 pt-4 border-t">
                <div>
                  <h3 className="font-semibold text-primary">Answer:</h3>
                  <p>{data.answer}</p>
                </div>
                {data.explanation && (
                  <div>
                    <h3 className="font-semibold text-primary">Explanation:</h3>
                    <p className="text-muted-foreground">{data.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => setShowAnswer(!showAnswer)} className="w-full">
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
