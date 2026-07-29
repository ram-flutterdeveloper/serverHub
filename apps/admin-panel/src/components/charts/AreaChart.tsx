'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
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

export default function AreaChart({
  title,
  data,
  height = 350,
}: AreaChartProps) {
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
        <RechartsAreaChart data={chartData}>
          <defs>
            {data.datasets.map((dataset, index) => {
              const color = dataset.color || defaultColors[index % defaultColors.length];
              return (
                <linearGradient
                  key={dataset.name}
                  id={`gradient-${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              );
            })}
          </defs>
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
          {data.datasets.map((dataset, index) => {
            const color = dataset.color || defaultColors[index % defaultColors.length];
            return (
              <Area
                key={dataset.name}
                type="monotone"
                dataKey={dataset.name}
                stroke={color}
                strokeWidth={2}
                fill={`url(#gradient-${index})`}
              />
            );
          })}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </Box>
  );
}
