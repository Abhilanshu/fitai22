'use client';

import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';

interface AnalyticsChartProps {
    data: any[];
    dataKey: string;
    color: string;
    title: string;
    unit?: string;
    type?: 'area' | 'bar';
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-zinc-900 border border-gray-800 p-3 rounded-xl shadow-xl">
                <p className="text-gray-400 text-xs mb-1">{label}</p>
                <p className="text-white font-bold text-lg">
                    {payload[0].value} <span className="text-xs text-gray-500 font-normal">{unit}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function AnalyticsChart({ data, dataKey, color, title, unit, type = 'area' }: AnalyticsChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="w-full h-[200px] flex items-center justify-center bg-zinc-900/50 rounded-2xl border border-gray-800 border-dashed">
                <p className="text-gray-500 text-sm">Not enough data for {title} chart</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full"> {/* Removed card wrapper to allow parent control */}
            <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'bar' ? (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip unit={unit} />} />
                            <Bar
                                dataKey={dataKey}
                                fill={color}
                                radius={[4, 4, 0, 0]}
                                animationDuration={1500}
                            />
                        </BarChart>
                    ) : (
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#6b7280', fontSize: 12 }}
                                dy={10}
                            />
                            <Tooltip content={<CustomTooltip unit={unit} />} />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={3}
                                fill={`url(#gradient-${dataKey})`}
                                animationDuration={1500}
                            />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
