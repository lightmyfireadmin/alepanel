"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { EChart } from "@/components/charts/EChart";
import { Loader2, Sparkles, Download, Upload } from "lucide-react";
import * as echarts from "echarts";
import ExcelJS from "exceljs";

type ChartType = "line" | "bar" | "pie" | "area" | "scatter";
type LegendPosition = "top" | "bottom" | "left" | "right";

export function ChartBuilder() {
  const [dataInput, setDataInput] = useState("Mois,Ventes,Objectif\nJan,12000,10000\nFev,19000,12000\nMar,15000,14000\nAvr,22000,16000");
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [chartOption, setChartOption] = useState<echarts.EChartsOption | null>(null);
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState<"csv" | "json">("csv");
  
  // Customization State
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [legendPosition, setLegendPosition] = useState<LegendPosition>("top");
  const [showLabels, setShowLabels] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setDataInput(text);
        setFormat("csv");
      };
      reader.readAsText(file);
    } else if (file.name.endsWith(".xlsx")) {
        const workbook = new ExcelJS.Workbook();
        const buffer = await file.arrayBuffer();
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1);
        
        if (worksheet) {
            const rows: string[] = [];
            worksheet.eachRow((row) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const rowValues = (row.values as any[]).slice(1).join(",");
                rows.push(rowValues);
            });
            setDataInput(rows.join("\n"));
            setFormat("csv");
        }
    } else {
        alert("Format non supporté. Utilisez .csv ou .xlsx");
    }
  };

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
                categories = parsed.map((item: any) => item[headers[0]]); 
                
                headers.slice(1).forEach(key => {
                     seriesData.push({
                        name: key,
                        type: chartType === 'area' ? 'line' : chartType,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        data: parsed.map((item: any) => item[key]),
                        smooth: true,
                        areaStyle: chartType === 'area' ? { opacity: 0.3 } : undefined,
                        itemStyle: { borderRadius: 4 },
                        label: { show: showLabels, position: 'top' }
                     });
                });

            } else {
                const lines = dataInput.trim().split("\n");
                headers = lines[0].split(",");
                const rows = lines.slice(1).map(line => line.split(","));

                categories = rows.map(row => row[0]);
                
                if (chartType === 'pie') {
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
                            show: showLabels,
                            position: showLabels ? 'outside' : 'center',
                            formatter: '{b}: {c} ({d}%)'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: 20,
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: showLabels
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
                        label: { show: showLabels, position: 'top' }
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
                color: [primaryColor, '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'],
                tooltip: { trigger: chartType === 'pie' ? 'item' : 'axis' },
                legend: { 
                    data: chartType === 'pie' ? categories : headers.slice(1), 
                    textStyle: { color: 'var(--foreground)' },
                    top: legendPosition === 'top' ? 0 : 'auto',
                    bottom: legendPosition === 'bottom' ? 0 : 'auto',
                    left: legendPosition === 'left' ? 0 : (legendPosition === 'top' || legendPosition === 'bottom' ? 'center' : 'auto'),
                    right: legendPosition === 'right' ? 0 : 'auto',
                    orient: (legendPosition === 'left' || legendPosition === 'right') ? 'vertical' : 'horizontal'
                },
                grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
                xAxis: xAxis,
                yAxis: yAxis,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                series: seriesData as any,
                toolbox: {
                    feature: {
                        saveAsImage: { title: "Sauvegarder", show: true }
                    }
                }
            };

            setChartOption(option);
        } catch {
            alert(`Erreur de format de données. Vérifiez votre ${format.toUpperCase()}.`);
        }
        setGenerating(false);
    }, 500);
  };

  const handleExport = () => {
    // ECharts provides a built-in saveAsImage tool in toolbox, 
    // but if we want a custom button we can trigger a download of the data or use the instance.
    // Accessing the instance from the custom EChart wrapper might require passing a ref.
    // For now, we enabled toolbox.saveAsImage above which appears on the chart.
    // We can also download the CSV data.
    const blob = new Blob([dataInput], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "chart_data.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Configuration</CardTitle>
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
                        <Label>Couleur Ppal.</Label>
                        <div className="flex gap-2">
                            <Input 
                                type="color" 
                                value={primaryColor} 
                                onChange={(e) => setPrimaryColor(e.target.value)} 
                                className="w-12 h-10 p-1"
                            />
                            <Input 
                                value={primaryColor} 
                                onChange={(e) => setPrimaryColor(e.target.value)} 
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Légende</Label>
                        <Select value={legendPosition} onValueChange={(v) => setLegendPosition(v as LegendPosition)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="top">Haut</SelectItem>
                                <SelectItem value="bottom">Bas</SelectItem>
                                <SelectItem value="left">Gauche</SelectItem>
                                <SelectItem value="right">Droite</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2 flex flex-col justify-end pb-2">
                        <div className="flex items-center gap-2">
                            <Switch id="labels" checked={showLabels} onCheckedChange={setShowLabels} />
                            <Label htmlFor="labels">Afficher Valeurs</Label>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <Label>Données</Label>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => fileInputRef.current?.click()}>
                                <Upload className="w-3 h-3 mr-1" /> Importer
                            </Button>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                className="hidden" 
                                accept=".csv,.xlsx"
                            />
                            <Select value={format} onValueChange={(v) => setFormat(v as "csv" | "json")}>
                                <SelectTrigger className="h-6 w-20 text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="csv">CSV</SelectItem>
                                    <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
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
                <div className="flex gap-2">
                    {chartOption && (
                        <p className="text-xs text-muted-foreground self-center mr-2">
                            💡 Utilisez le bouton de téléchargement sur le graphique
                        </p>
                    )}
                    <Button variant="outline" size="sm" onClick={handleExport} disabled={!chartOption}>
                        <Download className="mr-2 h-4 w-4" /> Export Données
                    </Button>
                </div>
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