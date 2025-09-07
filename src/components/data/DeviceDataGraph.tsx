'use client';

import { CartesianGrid, Label, Line, LineChart, ReferenceLine, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import { GraphDatePicker } from '@/components/data/GraphDatePicker';
import { GraphPeriodPicker } from '@/components/data/GraphPeriodPicker';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Spinner } from '@/components/ui/spinner';
import { useChartData } from '@/hooks/useChartData';
import { useDevice } from '@/hooks/useDeviceName';
import { DeviceInformation } from '@/types/device';
import { Record } from '@/types/record';

const modeLabels: { [key in DeviceInformation['mode']]: string } = {
  0: 'Off',
  1: 'Heating',
  2: 'Cooling',
  3: 'Auto',
  4: 'Emergency Heat',
};

type ChartDataPoint = {
  time: string;
  maxTemp: number;
  minTemp: number;
  currentTemp: number;
  mode: number;
  fullDate: string;
};

type ModeChangePoint = {
  x: string;
  mode: number;
  prevMode: number;
};

type ModePeriod = {
  startTime: string;
  endTime: string;
  mode: number;
  label: string;
};

type DeviceDataGraphProps = {
  deviceId: string;
  startDate: Date;
  period: number;
};

export function DeviceDataGraph({ deviceId, startDate, period }: DeviceDataGraphProps) {
  const device = useDevice(deviceId);
  const { data, isLoading } = useChartData({ deviceId, startDate, period });

  const chartData: ChartDataPoint[] =
    data?.map((record: Record) => ({
      time: new Date(record.recordedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
      maxTemp: record.maxTemperature,
      minTemp: record.minTemperature,
      currentTemp: record.currentTemperature,
      mode: record.currentMode,
      fullDate: new Date(record.recordedAt).toLocaleString(),
    })) || [];

  const modeChangePoints: ModeChangePoint[] = [];
  chartData.forEach((point: ChartDataPoint, index: number) => {
    if (index === 0) {
      return;
    }
    const prevPoint = chartData[index - 1];
    if (prevPoint.mode !== point.mode) {
      modeChangePoints.push({
        x: point.time,
        mode: point.mode,
        prevMode: prevPoint.mode,
      });
    }
  });

  const modePeriods: ModePeriod[] = [];
  if (chartData.length > 0) {
    let currentMode = chartData[0].mode;
    let startTime = chartData[0].time;

    chartData.forEach((point: ChartDataPoint, index: number) => {
      if (point.mode !== currentMode) {
        const endTime = chartData[index - 1].time;
        modePeriods.push({
          startTime,
          endTime,
          mode: currentMode,
          label: modeLabels[currentMode],
        });

        currentMode = point.mode;
        startTime = point.time;
      }
    });

    if (chartData.length > 0) {
      const lastTime = chartData[chartData.length - 1].time;
      modePeriods.push({
        startTime,
        endTime: lastTime,
        mode: currentMode,
        label: modeLabels[currentMode],
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle>{device?.name ?? deviceId}</CardTitle>
            <CardDescription>Temperature over time</CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <GraphDatePicker />
            <GraphPeriodPicker />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Spinner />
              <p className="text-sm text-muted-foreground">Loading temperature data...</p>
            </div>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="text-4xl text-muted-foreground">📊</div>
              <div className="space-y-2">
                <h3 className="text-lg font-medium">No Data Available</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  No temperature data found for the selected date range. Try adjusting the date or period above.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ChartContainer
            config={{
              maxTemp: {
                label: 'Max Temperature',
                color: 'hsl(var(--destructive))',
              },
              minTemp: {
                label: 'Min Temperature',
                color: 'hsl(var(--primary))',
              },
              currentTemp: {
                label: 'Current Temperature',
                color: 'hsl(var(--chart-2))',
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
                  label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
                  domain={[12, 28]}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value, payload) => {
                        if (payload && payload[0]) {
                          return payload[0].payload.fullDate;
                        }
                        return value;
                      }}
                    />
                  }
                />
                {chartData.length > 0 && (
                  <ReferenceLine x={chartData[0].time}>
                    <Label
                      value={modeLabels[chartData[0].mode]}
                      position="insideTopLeft"
                      style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                    />
                  </ReferenceLine>
                )}
                {modeChangePoints.map((changePoint: ModeChangePoint, index: number) => (
                  <ReferenceLine
                    key={`mode-change-${index}`}
                    x={changePoint.x}
                    stroke="var(--muted-foreground)"
                    strokeDasharray="5 5"
                    strokeWidth={1}
                  >
                    <Label
                      value={modeLabels[changePoint.mode]}
                      position="insideTopLeft"
                      style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                    />
                  </ReferenceLine>
                ))}
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="maxTemp"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  name="Max Temperature"
                />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="minTemp"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  name="Min Temperature"
                />
                <Line
                  dot={false}
                  type="monotone"
                  dataKey="currentTemp"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  name="Current Temperature"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
