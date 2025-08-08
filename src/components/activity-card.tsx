import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: string;
  textColor: string;
  className?: string;
}

export function ActivityCard({ title, description, icon, color, textColor, className }: ActivityCardProps) {
  return (
    <Card className={cn("h-full cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:border-primary/50 flex flex-col", className)}>
      <CardHeader className="items-center text-center pt-8">
        <div className={cn("rounded-full p-4 transition-colors", color)}>
          <div className={cn("transition-colors", textColor)}>
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-center flex-grow flex flex-col justify-center">
        <CardTitle className="mb-2 text-xl font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
