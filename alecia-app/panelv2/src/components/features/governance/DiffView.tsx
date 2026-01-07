"use client";

import ReactDiffViewer from "react-diff-viewer-continued";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface DiffViewProps {
  oldContent: string;
  newContent: string;
  aiSummary?: string;
}

export function DiffView({ oldContent, newContent, aiSummary }: DiffViewProps) {
  return (
    <div className="space-y-6">
      {aiSummary && (
        <Card className="bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-300">
              <Sparkles className="w-4 h-4" />
              AI Summary of Changes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-purple-800 dark:text-purple-200 leading-relaxed">
              {aiSummary}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="border rounded-md overflow-hidden bg-white dark:bg-black text-xs">
        <ReactDiffViewer
          oldValue={oldContent}
          newValue={newContent}
          splitView={true}
          useDarkTheme={false} // Can be dynamic based on user theme
          leftTitle="Current Version"
          rightTitle="Proposed Changes"
          styles={{
            variables: {
                light: {
                    diffViewerBackground: '#fff',
                    diffViewerColor: '#212529',
                    addedBackground: '#e6ffed',
                    addedColor: '#24292e',
                    removedBackground: '#ffeef0',
                    removedColor: '#24292e',
                    wordAddedBackground: '#acf2bd',
                    wordRemovedBackground: '#fdb8c0',
                    addedGutterBackground: '#cdffd8',
                    removedGutterBackground: '#ffdce0',
                    gutterBackground: '#f7f7f7',
                    gutterColor: '#212529',
                    gutterBorderStyle: '1px solid #eee',
                    diffViewerTitleBackground: '#fafbfc',
                    diffViewerTitleColor: '#212529',
                    diffViewerTitleBorderColor: '#eee',
                }
            },
            lineNumber: {
                color: '#ced4da',
            }
          }}
        />
      </div>
    </div>
  );
}
