'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface BarChartProps {
  title?: string;
  data: {
    labels: string[];
    datasets: {
      name: string;
      data: number[];
      color?: string;
    }[];
  };
  height?: number;
}

const defaultColors = [
  '#1976d2',
  '#388e3c',
  '#f57c00',
  '#d32f2f',
  '#7b1fa2',
  '#00838f',
  '#c2185b',
  '#455a64',
];

export default function BarChart({
  title,
  data,
  height = 350,
}: BarChartProps) {
  const chartData = data.labels.map((label, index) => {
    const point: Record<string, string | number> = { name: label };
    data.datasets.forEach((dataset) => {
      point[dataset.name] = dataset.data[index];
    });
    return point;
  });

  return (
    <Box>
      {title && (
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {title}
        </Typography>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          />
          <Legend />
          {data.datasets.map((dataset, index) => (
            <Bar
              key={dataset.name}
              dataKey={dataset.name}
              fill={dataset.color || defaultColors[index % defaultColors.length]}
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </Box>
  );
}
