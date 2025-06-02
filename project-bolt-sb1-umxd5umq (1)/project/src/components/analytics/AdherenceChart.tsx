import React, { useEffect, useRef } from 'react';
import { DoseLog } from '../../types';

interface AdherenceChartProps {
  logs: DoseLog[];
  timeframe: 'week' | 'month' | 'year';
}

const AdherenceChart: React.FC<AdherenceChartProps> = ({ logs, timeframe }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);

  // This is a simplified chart implementation
  // In a real app, you would use a library like Chart.js or Recharts
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height);

    // Set up chart dimensions
    const width = chartRef.current.width;
    const height = chartRef.current.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Mock data based on timeframe
    let days: number;
    let labels: string[];

    if (timeframe === 'week') {
      days = 7;
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    } else if (timeframe === 'month') {
      days = 30;
      labels = Array.from({ length: 30 }, (_, i) => (i + 1).toString());
    } else {
      days = 12;
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }

    // Calculate adherence data (mock for demo)
    // In a real app, this would use actual log data
    const adherenceData = Array.from({ length: days }, () => 
      Math.floor(Math.random() * 30) + 70
    );

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i <= 5; i++) {
      const y = height - padding - (i * chartHeight / 5);
      const value = i * 20;
      
      ctx.fillText(`${value}%`, padding - 10, y);
      
      // Draw horizontal grid lines
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    
    const barWidth = chartWidth / days * 0.7;
    const barSpacing = chartWidth / days;
    
    for (let i = 0; i < days; i++) {
      const x = padding + i * barSpacing + barSpacing / 2;
      ctx.fillText(labels[i], x, height - padding + 10);
    }

    // Draw bars
    for (let i = 0; i < days; i++) {
      const x = padding + i * barSpacing + barSpacing / 2 - barWidth / 2;
      const barHeight = (adherenceData[i] / 100) * chartHeight;
      const y = height - padding - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, height - padding);
      gradient.addColorStop(0, '#4F46E5');
      gradient.addColorStop(1, '#4F46E599');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Draw chart title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Adherence Rate Over Time', width / 2, 20);

  }, [logs, timeframe]);

  return (
    <canvas 
      ref={chartRef} 
      width={800} 
      height={300}
      className="w-full h-auto"
    />
  );
};

export default AdherenceChart;