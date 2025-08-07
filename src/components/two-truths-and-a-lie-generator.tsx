"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { generateTwoTruthsAndALie, type GenerateTwoTruthsAndALieOutput } from "@/ai/flows/generate-two-truths-and-a-lie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  topic: z.string().optional(),
});

export function TwoTruthsAndALieGenerator() {
  const [data, setData] = useState<GenerateTwoTruthsAndALieOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setData(null);
    setSelectedOption(null);
    try {
      const result = await generateTwoTruthsAndALie(values);
      setData(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating Statements",
        description: "Could not generate statements. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
  };

  const getCardClasses = (index: number) => {
    const isLie = index === data?.lieIndex;
    const isSelected = selectedOption === index;

    if (selectedOption !== null) {
      if (isLie) {
        return "bg-destructive/20 border-destructive shadow-xl";
      }
      if (isSelected && !isLie) {
        return "bg-primary/20 border-primary shadow-xl";
      }
      return "opacity-50 scale-95";
    }

    return "cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105";
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Optional Topic</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., history, animals, space" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : "Generate Statements"}
          </Button>
        </form>
      </Form>

      {data && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-center text-primary">Which one is the lie?</h2>
          <div className="grid grid-cols-1 gap-4">
            {data.statements.map((statement, index) => (
              <Card key={index} className={cn("text-center", getCardClasses(index))} onClick={() => handleSelectOption(index)}>
                <CardContent className="p-6 text-xl font-medium flex items-center justify-center min-h-[100px]">
                  <p>{statement}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {selectedOption !== null && (
            <div className="text-center p-4 rounded-lg bg-secondary">
              {selectedOption === data.lieIndex ? (
                <p className="text-xl font-bold text-primary">You got it! That was the lie.</p>
              ) : (
                <p className="text-xl font-bold text-destructive">
                  Nice try! The lie was: "{data.statements[data.lieIndex]}"
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
