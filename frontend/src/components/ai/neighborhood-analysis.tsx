"use client";

import { GraduationCap, Shield, TrainFront } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NeighborhoodAnalysis({
  schoolRating,
  crimeIndex,
  transitScore,
}: {
  schoolRating: number;
  crimeIndex: number;
  transitScore: number;
}) {
  return (
    <Card className="bg-card/85">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Neighborhood Intelligence</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-muted/60 p-2">
          <GraduationCap className="mx-auto h-4 w-4 text-accent" />
          <p className="mt-1 text-xs font-medium">{schoolRating}/10</p>
        </div>
        <div className="rounded-md bg-muted/60 p-2">
          <Shield className="mx-auto h-4 w-4 text-accent" />
          <p className="mt-1 text-xs font-medium">{crimeIndex}</p>
        </div>
        <div className="rounded-md bg-muted/60 p-2">
          <TrainFront className="mx-auto h-4 w-4 text-accent" />
          <p className="mt-1 text-xs font-medium">{transitScore}</p>
        </div>
      </CardContent>
    </Card>
  );
}
