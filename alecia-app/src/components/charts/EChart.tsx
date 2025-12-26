"use client";

import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";

interface EChartProps {
  options: echarts.EChartsOption;
  height?: string;
}

export function EChart({ options, height = "300px" }: EChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (!chartInstance.current) {
        chartInstance.current = echarts.init(chartRef.current);
      }
      chartInstance.current.setOption(options);
    }

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, [options]);

  return <div ref={chartRef} style={{ width: "100%", height }} />;
}
