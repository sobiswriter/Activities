"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateFlirtQuestion } from "@/ai/flows/generate-flirt-question";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  topic: z.string().optional(),
});

export function FlirtQuestionGenerator() {
  const [question, setQuestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuestion(null);
    try {
      const result = await generateFlirtQuestion(values);
      if (result.question) {
        setQuestion(result.question);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "Failed to generate a question. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optional Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., movies, music, travel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? <Loader2 className="animate-spin" /> : "Generate Question"}
          </Button>
        </form>
      </Form>
      
      {question && (
        <Card className="mt-4 bg-secondary">
          <CardHeader>
            <CardTitle className="text-lg">Here's a question for you:</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium text-primary">{question}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
