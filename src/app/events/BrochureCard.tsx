"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download } from "lucide-react";
import Link from "next/link";

export const BrochureCard = () => {
    return (
        <Card className="relative overflow-hidden border-primary/20 bg-primary/5 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
            <CardContent className="relative flex flex-col sm:flex-row items-center justify-between gap-6 p-6">
                <Button asChild size="lg" className="shrink-0 shadow-lg shadow-primary/20">
                    <Link href="/HORIZON 2025-26.pdf" target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download Brochure
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};
