"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Activity } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatusSearchPage() {
  const [requestId, setRequestId] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId.trim()) {
      router.push(`/status/${requestId.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="container mx-auto flex min-h-[80vh] items-center justify-center px-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Activity className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Track Your Request</CardTitle>
          <CardDescription>
            Enter your Request ID to check the current status of your sample request.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="e.g., REQ-1001"
                className="pl-9 text-center font-mono uppercase tracking-widest"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-secondary">
              Check Status
            </Button>
          </form>
          <div className="mt-8 rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Can&apos;t find your ID? Check your email or contact support at support@sampleflow.io
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
