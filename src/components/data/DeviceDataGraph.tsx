'use client';

import { subDays } from 'date-fns';
import { useState } from 'react';

import { Spinner } from '@/components/ui/spinner';
import { useChartData } from '@/hooks/useChartData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type DeviceDataGraphProps = {
  deviceId: string;
};

export function DeviceDataGraph({ deviceId }: DeviceDataGraphProps) {
  const [startDate, setStartDate] = useState(subDays(new Date(), 7));
  const [periodDays, setPeriodDays] = useState(7);

  const { data, isLoading } = useChartData({ deviceId, startDate, periodDays });

  if (isLoading) {
    return <Spinner />;
  }

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

    // Transform data for the chart
  const chartData = data.map((record) => ({
    time: new Date(record.recordedAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      month: "short",
      day: "numeric",
    }),
    maxTemp: record.maxTemperature,
    minTemp: record.minTemperature,
    currentTemp: record.currentTemperature,
    fullDate: new Date(record.recordedAt).toLocaleString(),
  }))

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Data</CardTitle>
        <CardDescription>Whatever Description</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            maxTemp: {
              label: "Max Temperature",
              color: "hsl(var(--destructive))",
            },
            minTemp: {
              label: "Min Temperature",
              color: "hsl(var(--primary))",
            },
            currentTemp: {
              label: "Current Temperature",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[400px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" tick={{ fontSize: 12 }} />
              <YAxis
                className="text-xs"
                tick={{ fontSize: 12 }}
                label={{ value: "Temperature (°F)", angle: -90, position: "insideLeft" }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.fullDate
                      }
                      return value
                    }}
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="maxTemp"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Max Temperature"
              />
              <Line
                type="monotone"
                dataKey="currentTemp"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Current Temperature"
              />
              <Line
                type="monotone"
                dataKey="minTemp"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Min Temperature"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
