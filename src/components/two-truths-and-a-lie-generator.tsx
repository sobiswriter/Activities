
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";


const aiFormSchema = z.object({
  topic: z.string().optional(),
});

const pvpFormSchema = z.object({
    statements: z.array(z.object({
        value: z.string().min(1, "Please enter a statement."),
    })).length(3, "You must provide exactly 3 statements."),
    lieIndex: z.coerce.number().min(0).max(2, "You must select which statement is the lie."),
});


function AiPlayer() {
    const [data, setData] = useState<GenerateTwoTruthsAndALieOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof aiFormSchema>>({
        resolver: zodResolver(aiFormSchema),
        defaultValues: {
        topic: "",
        },
    });

    async function onSubmit(values: z.infer<typeof aiFormSchema>) {
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

function PvpPlayer() {
    const [gameState, setGameState] = useState<"input" | "guess">("input");
    const [gameData, setGameData] = useState<{ statements: string[], lieIndex: number } | null>(null);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);

    const form = useForm<z.infer<typeof pvpFormSchema>>({
        resolver: zodResolver(pvpFormSchema),
        defaultValues: {
            statements: [{ value: "" }, { value: "" }, { value: "" }],
        },
    });
    
    const { fields } = useFieldArray({
        control: form.control,
        name: "statements",
    });

    function onSubmit(values: z.infer<typeof pvpFormSchema>) {
        const statements = values.statements.map(s => s.value);
        setGameData({ statements, lieIndex: values.lieIndex });
        setGameState("guess");
        setSelectedOption(null);
    }
    
    const handleSelectOption = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
    };

    const getCardClasses = (index: number) => {
        if (!gameData) return "";
        const isLie = index === gameData.lieIndex;
        const isSelected = selectedOption === index;

        if (selectedOption !== null) {
            if (isLie) return "bg-destructive/20 border-destructive shadow-xl";
            if (isSelected && !isLie) return "bg-primary/20 border-primary shadow-xl";
            return "opacity-50 scale-95";
        }

        return "cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:scale-105";
    };

    if (gameState === "guess" && gameData) {
        return (
            <div className="space-y-6">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-center text-primary">Which one is the lie?</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {gameData.statements.map((statement, index) => (
                        <Card key={index} className={cn("text-center", getCardClasses(index))} onClick={() => handleSelectOption(index)}>
                            <CardContent className="p-6 text-xl font-medium flex items-center justify-center min-h-[100px]">
                            <p>{statement}</p>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    {selectedOption !== null && (
                        <div className="text-center p-4 rounded-lg bg-secondary">
                        {selectedOption === gameData.lieIndex ? (
                            <p className="text-xl font-bold text-primary">You got it! That was the lie.</p>
                        ) : (
                            <p className="text-xl font-bold text-destructive">
                            Nice try! The lie was: "{gameData.statements[gameData.lieIndex]}"
                            </p>
                        )}
                        </div>
                    )}
                </div>
                 <Button onClick={() => { setGameState("input"); form.reset(); }} variant="outline" className="w-full">Play Again</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-primary">Player 1: Enter your statements</h2>
            <p className="text-center text-muted-foreground">Enter two truths and one lie. Select the lie, then let Player 2 guess!</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="lieIndex"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Select the statement that is a lie:</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={String(field.value)}
                                        className="flex flex-col space-y-1"
                                    >
                                    {fields.map((item, index) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name={`statements.${index}.value`}
                                            render={({ field: statementField }) => (
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem value={String(index)} />
                                                    </FormControl>
                                                    <Textarea placeholder={`Statement ${index + 1}`} {...statementField} className="flex-1" rows={2}/>
                                                </FormItem>
                                            )}
                                        />
                                    ))}
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full text-lg py-6">Let Player 2 Guess</Button>
                </form>
            </Form>
        </div>
    );
}


export function TwoTruthsAndALieGenerator() {
    return (
        <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai">Play with AI</TabsTrigger>
                <TabsTrigger value="pvp">Player vs Player</TabsTrigger>
            </TabsList>
            <TabsContent value="ai" className="mt-6">
                <AiPlayer />
            </TabsContent>
            <TabsContent value="pvp" className="mt-6">
                <PvpPlayer />
            </TabsContent>
        </Tabs>
    );
}

