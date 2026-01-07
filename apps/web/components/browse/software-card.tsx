import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";

interface SoftwareCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

export function SoftwareCard({
  title,
  description,
  icon: Icon,
  href,
}: SoftwareCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow border-primary/20">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{title}</h3>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-foreground/80">{description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button className="w-full" asChild>
          <Link href={href}>Deploy</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
