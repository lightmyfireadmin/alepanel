"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { DiffView } from "@/components/features/governance/DiffView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ThumbsUp, ThumbsDown, GitMerge, ArrowLeft, Loader2, Users, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ProposalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const proposalId = params.id as Id<"proposals">;
  
  const proposal = useQuery(api.cms.getProposalById, { id: proposalId });
  const settings = useQuery(api.queries.getGlobalSettings);
  
  const vote = useMutation(api.cms.voteOnProposal);
  const merge = useMutation(api.cms.mergeProposal);

  if (proposal === undefined || settings === undefined) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (proposal === null) {
    return <div className="p-8">Proposal not found</div>;
  }

  // Voting Logic Calculation
  const votesForCount = proposal.votesFor.length;
  const votesAgainstCount = proposal.votesAgainst.length;
  const totalVotes = votesForCount + votesAgainstCount;
  
  // Quorum Visualization (Mock total partners for visual context - ideally fetched)
  // Assuming a fixed base or just showing approval rating among voters for now
  const approvalRate = totalVotes > 0 ? (votesForCount / totalVotes) * 100 : 0;
  const quorumThreshold = settings?.governance?.quorumPercentage || 50;
  const isApproved = approvalRate >= quorumThreshold && totalVotes > 0; // Simplified
  const canMerge = isApproved && proposal.status === "voting";

  const handleVote = async (direction: "for" | "against") => {
    try {
        await vote({ proposalId, vote: direction });
        toast.success(`Voted ${direction}`);
    } catch (e) {
        toast.error("Failed to vote");
        console.error(e);
    }
  };

  const handleMerge = async () => {
    try {
        await merge({ proposalId });
        toast.success("Proposal merged successfully");
        router.push("/admin/governance");
    } catch (e) {
        toast.error("Failed to merge");
        console.error(e);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between bg-card z-10">
        <div className="flex items-center gap-4">
            <Link href="/admin/governance">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-5 h-5" />
                </Button>
            </Link>
            <div>
                <h1 className="text-xl font-bold tracking-tight">{proposal.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono bg-muted px-1.5 rounded text-xs">{proposal.pageSlug}</span>
                    <span>•</span>
                    <span>Proposed by {proposal.authorName}</span>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
             <Badge variant={proposal.status === "voting" ? "secondary" : "default"}>
                {proposal.status.toUpperCase()}
             </Badge>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left: Diff View (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-black/20">
            <DiffView 
                oldContent={proposal.currentContent} 
                newContent={proposal.diffSnapshot} 
                aiSummary={proposal.aiSummary}
            />
        </div>

        {/* Right: Voting Panel (Fixed) */}
        <aside className="w-[400px] border-l bg-card flex flex-col">
            <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                <div>
                    <h3 className="text-lg font-semibold mb-1">Voting Status</h3>
                    <p className="text-sm text-muted-foreground mb-4">Quorum required: {quorumThreshold}%</p>
                    
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-green-600">Approve ({votesForCount})</span>
                                <span className="text-muted-foreground">{approvalRate.toFixed(0)}%</span>
                            </div>
                            <Progress value={approvalRate} className="h-2 bg-slate-100 dark:bg-slate-800" />
                        </div>
                        
                         <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{votesAgainstCount} Reject</span>
                            <span>Total Votes: {totalVotes}</span>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="space-y-4">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Voters
                    </h4>
                    {/* Placeholder for voter list faces */}
                    <div className="flex -space-x-2 overflow-hidden py-1">
                        {proposal.votesFor.map((id) => (
                             <div key={id} className="h-8 w-8 rounded-full border-2 border-background bg-green-100 flex items-center justify-center text-[10px] text-green-800 font-bold" title="Voted For">
                                 👍
                             </div>
                        ))}
                         {proposal.votesAgainst.map((id) => (
                             <div key={id} className="h-8 w-8 rounded-full border-2 border-background bg-red-100 flex items-center justify-center text-[10px] text-red-800 font-bold" title="Voted Against">
                                 👎
                             </div>
                        ))}
                        {totalVotes === 0 && <span className="text-sm text-muted-foreground italic">No votes yet</span>}
                    </div>
                </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-6 border-t bg-muted/10 space-y-4">
                {proposal.status === "voting" && (
                    <>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="border-green-200 hover:bg-green-50 hover:text-green-700" onClick={() => handleVote("for")}>
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                Approve
                            </Button>
                            <Button variant="outline" className="border-red-200 hover:bg-red-50 hover:text-red-700" onClick={() => handleVote("against")}>
                                <ThumbsDown className="w-4 h-4 mr-2" />
                                Reject
                            </Button>
                        </div>
                        
                        {canMerge && (
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg" onClick={handleMerge}>
                                <GitMerge className="w-4 h-4 mr-2" />
                                Merge Proposal
                            </Button>
                        )}
                         {!canMerge && isApproved && (
                            <p className="text-xs text-center text-muted-foreground">
                                Pending more votes or manual admin review.
                            </p>
                        )}
                    </>
                )}
                
                {proposal.status === "merged" && (
                     <Button className="w-full" disabled variant="secondary">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Merged
                    </Button>
                )}
            </div>
        </aside>
      </div>
    </div>
  );
}
