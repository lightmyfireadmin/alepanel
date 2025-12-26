"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EChart } from "@/components/charts/EChart";
import { Loader2, Sparkles, Download } from "lucide-react";
import * as echarts from "echarts";

type ChartType = "line" | "bar" | "pie" | "area" | "scatter";

export function ChartBuilder() {
  const [dataInput, setDataInput] = useState("Mois,Ventes,Objectif\nJan,12000,10000\nFev,19000,12000\nMar,15000,14000\nAvr,22000,16000");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartOption, setChartOption] = useState<echarts.EChartsOption | null>(null);
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<"csv" | "json">("csv");

  const generateChart = () => {
    setGenerating(true);
    setTimeout(() => {
        try {
            let categories: string[] = [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let seriesData: any[] = [];
            let headers: string[] = [];
            
            if (format === 'json') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const parsed = JSON.parse(dataInput) as any[];
                if (!Array.isArray(parsed) || parsed.length === 0) throw new Error("Format JSON invalide (tableau attendu)");
                
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const firstItem = parsed[0] as any;
                headers = Object.keys(firstItem);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                categories = parsed.map((item: any) => item[headers[0]]); // Assume first key is category
                
                // For JSON, we iterate over keys skipping the first one
                headers.slice(1).forEach(key => {
                     seriesData.push({
                        name: key,
                        type: chartType === 'area' ? 'line' : chartType,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data: parsed.map((item: any) => item[key]),
                        smooth: true,
                        areaStyle: chartType === 'area' ? { opacity: 0.3 } : undefined,
                        itemStyle: { borderRadius: 4 },
                     });
                });

            } else {
                // Parse CSV-like input
                const lines = dataInput.trim().split("\n");
                headers = lines[0].split(",");
                const rows = lines.slice(1).map(line => line.split(","));

                categories = rows.map(row => row[0]);
                
                if (chartType === 'pie') {
                    // For Pie, we usually just take the first value column
                    const valueIndex = 1; 
                    const pieData = rows.map(row => ({
                        name: row[0],
                        value: parseFloat(row[valueIndex])
                    }));
                    
                    seriesData = [{
                        name: headers[valueIndex],
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: pieData
                    }];
                } else {
                    seriesData = headers.slice(1).map((header, index) => ({
                        name: header,
                        type: chartType === 'area' ? 'line' : chartType,
                        data: rows.map(row => parseFloat(row[index + 1])),
                        smooth: true,
                        areaStyle: chartType === 'area' ? { opacity: 0.3 } : undefined,
                        itemStyle: { borderRadius: 4 },
                    }));
                }
            }
            
            let xAxis = {};
            let yAxis = {};

            if (chartType === 'pie') {
                 xAxis = { show: false };
                 yAxis = { show: false };
            } else {
                 xAxis = { 
                    type: 'category', 
                    boundaryGap: chartType === 'bar',
                    data: categories,
                    axisLabel: { color: '#64748b' }
                };
                yAxis = { type: 'value', axisLabel: { color: '#64748b' } };
            }

            const option: echarts.EChartsOption = {
                tooltip: { trigger: chartType === 'pie' ? 'item' : 'axis' },
                legend: { data: chartType === 'pie' ? categories : headers.slice(1), textStyle: { color: 'var(--foreground)' } },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: xAxis,
                yAxis: yAxis,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                series: seriesData as any
            };

            setChartOption(option);
        } catch {
            alert(`Erreur de format de données. Vérifiez votre ${format.toUpperCase()}.`);
        }
        setGenerating(false);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select value={chartType} onValueChange={(v) => setChartType(v as ChartType)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Barres</SelectItem>
                                <SelectItem value="line">Ligne</SelectItem>
                                <SelectItem value="area">Aire</SelectItem>
                                <SelectItem value="pie">Camembert</SelectItem>
                                <SelectItem value="scatter">Nuage de points</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Format</Label>
                        <Select value={format} onValueChange={(v) => setFormat(v as "csv" | "json")}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="csv">CSV</SelectItem>
                                <SelectItem value="json">JSON</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Données ({format.toUpperCase()})</Label>
                    <Textarea 
                        value={dataInput} 
                        onChange={(e) => setDataInput(e.target.value)} 
                        rows={10} 
                        className="font-mono text-xs"
                        placeholder={format === 'json' ? '[{"Mois": "Jan", "Ventes": 100}, ...]': "Mois,Ventes\nJan,100"}
                    />
                </div>
                <Button onClick={generateChart} disabled={generating} className="w-full">
                    {generating ? <Loader2 className="animate-spin mr-2" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Générer Graphique
                </Button>
            </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full min-h-[500px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Aperçu</CardTitle>
                {chartOption && (
                    <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" /> Exporter
                    </Button>
                )}
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center bg-gray-50 dark:bg-meta-4/10 rounded-lg border border-dashed border-stroke dark:border-strokedark m-4">
                {chartOption ? (
                    <EChart options={chartOption} height="400px" />
                ) : (
                    <p className="text-muted-foreground">Entrez des données pour visualiser.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
