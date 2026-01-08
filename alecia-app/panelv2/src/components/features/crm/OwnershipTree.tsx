"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  GitBranch, 
  Building2, 
  User, 
  ChevronDown, 
  ChevronRight,
  Globe,
  Percent,
  ZoomIn,
  ZoomOut,
  Maximize2
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ShareholderNode {
  id: string;
  name: string;
  type: "company" | "person" | "investment_fund" | "public";
  percentage: number;
  country?: string;
  siren?: string;
  children?: ShareholderNode[];
  isUltimate?: boolean; // Ultimate Beneficial Owner
}

interface OwnershipTreeProps {
  companyName: string;
  shareholders?: ShareholderNode[];
  subsidiaries?: ShareholderNode[];
  className?: string;
}

/**
 * Ownership Tree Visualization
 * Displays hierarchical structure of shareholders and subsidiaries
 */
export function OwnershipTree({
  companyName,
  shareholders = [],
  subsidiaries = [],
  className,
}: OwnershipTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState(1);

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const collectIds = (nodes: ShareholderNode[]) => {
      nodes.forEach(n => {
        allIds.add(n.id);
        if (n.children) collectIds(n.children);
      });
    };
    collectIds([...shareholders, ...subsidiaries]);
    setExpandedNodes(allIds);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4" />
              Structure Capitalistique
            </CardTitle>
            <CardDescription>
              Actionnariat et filiales de {companyName}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setZoom(z => Math.min(1.5, z + 0.1))}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={expandAll}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div 
          className="space-y-6 overflow-x-auto"
          style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}
        >
          {/* Shareholders Section */}
          {shareholders.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <User className="h-3 w-3" />
                Actionnaires
              </h4>
              <div className="space-y-1">
                {shareholders.map(node => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    expanded={expandedNodes.has(node.id)}
                    onToggle={toggleNode}
                    direction="up"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Center Company */}
          <div className="flex justify-center py-4">
            <div className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold flex items-center gap-2 shadow-lg">
              <Building2 className="h-5 w-5" />
              {companyName}
            </div>
          </div>

          {/* Subsidiaries Section */}
          {subsidiaries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                Filiales
              </h4>
              <div className="space-y-1">
                {subsidiaries.map(node => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    level={0}
                    expanded={expandedNodes.has(node.id)}
                    onToggle={toggleNode}
                    direction="down"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {shareholders.length === 0 && subsidiaries.length === 0 && (
            <div className="text-center py-8">
              <GitBranch className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">
                Aucune donnée de structure capitalistique disponible
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Enrichissez via Pappers pour obtenir ces informations
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface TreeNodeProps {
  node: ShareholderNode;
  level: number;
  expanded: boolean;
  onToggle: (id: string) => void;
  direction: "up" | "down";
}

function TreeNode({ node, level, expanded, onToggle, direction }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0;

  const getNodeIcon = () => {
    switch (node.type) {
      case "person": return <User className="h-4 w-4" />;
      case "investment_fund": return <Percent className="h-4 w-4" />;
      case "public": return <Globe className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getNodeColor = () => {
    if (node.isUltimate) return "border-amber-300 bg-amber-50";
    switch (node.type) {
      case "person": return "border-blue-200 bg-blue-50/50";
      case "investment_fund": return "border-purple-200 bg-purple-50/50";
      case "public": return "border-green-200 bg-green-50/50";
      default: return "border-gray-200 bg-gray-50/50";
    }
  };

  return (
    <div className="pl-4" style={{ marginLeft: `${level * 20}px` }}>
      {/* Connection line */}
      {level > 0 && (
        <div 
          className="absolute w-4 border-t border-l border-muted-foreground/30" 
          style={{ 
            marginLeft: "-20px", 
            marginTop: "12px",
            height: "12px"
          }} 
        />
      )}
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "relative flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all hover:shadow-sm",
                getNodeColor()
              )}
              onClick={() => hasChildren && onToggle(node.id)}
            >
              {/* Expand/Collapse icon */}
              {hasChildren && (
                <span className="text-muted-foreground">
                  {expanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </span>
              )}
              
              {!hasChildren && <span className="w-3.5" />}

              {/* Node icon */}
              <span className="text-muted-foreground">
                {getNodeIcon()}
              </span>

              {/* Name and details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{node.name}</span>
                  {node.country && (
                    <span className="text-xs text-muted-foreground">
                      {node.country}
                    </span>
                  )}
                </div>
              </div>

              {/* Percentage badge */}
              <Badge 
                variant="outline" 
                className={cn(
                  "text-xs font-semibold",
                  node.percentage >= 50 ? "bg-primary/10 text-primary border-primary/30" : ""
                )}
              >
                {node.percentage.toFixed(1)}%
              </Badge>

              {/* UBO badge */}
              {node.isUltimate && (
                <Badge className="bg-amber-500 text-white text-[10px]">
                  UBO
                </Badge>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs space-y-1">
              <p className="font-medium">{node.name}</p>
              <p>Type: {node.type}</p>
              <p>Participation: {node.percentage}%</p>
              {node.siren && <p>SIREN: {node.siren}</p>}
              {node.isUltimate && <p className="text-amber-600">Bénéficiaire Effectif Ultime</p>}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="ml-4 mt-1 space-y-1 border-l border-dashed border-muted-foreground/30 pl-2">
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              direction={direction}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Example usage data
export const exampleOwnershipData = {
  shareholders: [
    {
      id: "sh1",
      name: "HOLDING FAMILIALE DUPONT",
      type: "company" as const,
      percentage: 65,
      country: "🇫🇷",
      siren: "123456789",
      children: [
        {
          id: "sh1-1",
          name: "Jean DUPONT",
          type: "person" as const,
          percentage: 80,
          isUltimate: true,
        },
        {
          id: "sh1-2",
          name: "Marie DUPONT",
          type: "person" as const,
          percentage: 20,
          isUltimate: true,
        },
      ],
    },
    {
      id: "sh2",
      name: "INVESTISSEMENT CAPITAL FUND",
      type: "investment_fund" as const,
      percentage: 25,
      country: "🇱🇺",
    },
    {
      id: "sh3",
      name: "Flottant (Bourse)",
      type: "public" as const,
      percentage: 10,
    },
  ],
  subsidiaries: [
    {
      id: "sub1",
      name: "FILIALE FRANCE SAS",
      type: "company" as const,
      percentage: 100,
      country: "🇫🇷",
      siren: "987654321",
    },
    {
      id: "sub2",
      name: "FILIALE ALLEMAGNE GMBH",
      type: "company" as const,
      percentage: 70,
      country: "🇩🇪",
      children: [
        {
          id: "sub2-1",
          name: "SOUS-FILIALE MUNICH",
          type: "company" as const,
          percentage: 100,
          country: "🇩🇪",
        },
      ],
    },
  ],
};
