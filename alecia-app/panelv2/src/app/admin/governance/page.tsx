"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { GitPullRequest, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default function GovernanceDashboard() {
  const proposals = useQuery(api.cms.getProposals);

  return (
    <div className="space-y-8 p-8 max-w-6xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Governance & Proposals</h1>
        <p className="text-muted-foreground">Review and vote on content changes proposed by the partnership.</p>
      </div>

      <div className="grid gap-4">
        {proposals === undefined ? (
           <div className="text-center py-10 text-muted-foreground">Loading proposals...</div>
        ) : proposals.length === 0 ? (
           <Card className="bg-muted/30 border-dashed">
               <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                   <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                   <h3 className="text-lg font-medium">All Clear</h3>
                   <p className="text-sm text-muted-foreground">No pending proposals needing your vote.</p>
               </CardContent>
           </Card>
        ) : (
            proposals.map((proposal) => (
                <Card key={proposal._id} className="group hover:shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                <GitPullRequest className="w-5 h-5 text-blue-500" />
                                {proposal.title}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{proposal.pageTitle}</span>
                                <span>•</span>
                                <span className="font-mono text-xs text-muted-foreground">/{proposal.pageSlug}</span>
                            </CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {proposal.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-[10px] bg-slate-200">{proposal.authorName.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span>Proposed by <span className="font-medium text-foreground">{proposal.authorName}</span></span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(proposal._creationTime).toLocaleDateString()}
                                </span>
                            </div>
                            
                            <Link href={`/admin/governance/${proposal._id}`}>
                                <Button size="sm" className="gap-2 group-hover:bg-primary group-hover:text-primary-foreground">
                                    Review & Vote
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))
        )}
      </div>
    </div>
  );
}
