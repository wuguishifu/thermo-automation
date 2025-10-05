'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CartesianGrid,
  Label,
  Line,
  LineChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { CategoricalChartState } from 'recharts/types/chart/types';

import { GraphDatePicker } from '@/components/data/GraphDatePicker';
import { GraphPeriodPicker } from '@/components/data/GraphPeriodPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Checkbox } from '@/components/ui/checkbox';
import { Label as LabelUI } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { useChartData } from '@/hooks/useChartData';
import { useDevice } from '@/hooks/useDeviceName';
import { convertTemperature, formatTemperature, getTemperatureUnitSymbol } from '@/lib/utils/temperature';
import { useAppSelector } from '@/state/store';
import { DeviceInformation } from '@/types/device';
import { Record } from '@/types/record';

const modeLabels: { [key in DeviceInformation['mode']]: string } = {
  0: 'Off',
  1: 'Heating',
  2: 'Cooling',
  3: 'Auto',
  4: 'Emergency Heat',
};

const modeStrokes: { [key in DeviceInformation['mode']]: string } = {
  0: 'var(--muted-foreground)',
  1: 'var(--chart-1-muted)',
  2: 'var(--chart-3-muted)',
  3: 'var(--chart-2-muted)',
  4: 'var(--chart-5-muted)',
};

type ChartDataPoint = {
  time: string;
  timestamp: number;
  maxTemp: number;
  minTemp: number;
  currentTemp: number;
  mode: number;
  fullDate: string;
  maxTempCelsius: number;
  minTempCelsius: number;
  currentTempCelsius: number;
  isModeChange?: boolean;
  prevMode?: number;
};

type ModeChangePoint = {
  x: number;
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
  showLabels: boolean;
  showModeChangeLines: boolean;
};

export function DeviceDataGraph({
  deviceId,
  startDate,
  period,
  showLabels: defaultShowLabels,
  showModeChangeLines: defaultShowModeChangeLines,
}: DeviceDataGraphProps) {
  const device = useDevice(deviceId);
  const { data, isLoading } = useChartData({ deviceId, startDate, period });
  const temperatureDisplay = useAppSelector((state) => state.settings.temperatureDisplay);
  const [showLabels, setShowLabels] = useState(defaultShowLabels);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
  const [legendPosition, setLegendPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [xDomain, setXDomain] = useState<[number, number] | undefined>(undefined);
  const [refAreaLeft, setRefAreaLeft] = useState<number | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<number | null>(null);
  const [showModeChangeLines, setShowModeChangeLines] = useState(defaultShowModeChangeLines);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!isDragging || !containerRef.current) {
        return;
      }
      const rect = containerRef.current.getBoundingClientRect();
      const legendRect = legendRef.current?.getBoundingClientRect();
      const legendWidth = legendRect?.width ?? 0;
      const legendHeight = legendRect?.height ?? 0;
      const nextX = Math.min(
        Math.max(e.clientX - rect.left - dragOffsetRef.current.x, 0),
        Math.max(rect.width - legendWidth, 0),
      );
      const nextY = Math.min(
        Math.max(e.clientY - rect.top - dragOffsetRef.current.y, 0),
        Math.max(rect.height - legendHeight, 0),
      );
      setLegendPosition({ x: nextX, y: nextY });
    }

    function handleMouseUp() {
      if (isDragging) {
        setIsDragging(false);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const chartData: ChartDataPoint[] =
    data?.map((record: Record) => ({
      time: new Date(record.recordedAtMs).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      }),
      timestamp: record.recordedAtMs,
      maxTemp: convertTemperature(record.maxTemperature, temperatureDisplay),
      minTemp: convertTemperature(record.minTemperature, temperatureDisplay),
      currentTemp: convertTemperature(record.currentTemperature, temperatureDisplay),
      mode: record.currentMode,
      fullDate: new Date(record.recordedAtMs).toLocaleString(),
      // Store original Celsius values for proper formatting
      maxTempCelsius: record.maxTemperature,
      minTempCelsius: record.minTemperature,
      currentTempCelsius: record.currentTemperature,
    })) || [];

  // Mark points where a mode change occurs for tooltip context
  chartData.forEach((point: ChartDataPoint, index: number) => {
    if (index === 0) {
      return;
    }
    const prevPoint = chartData[index - 1];
    if (prevPoint.mode !== point.mode) {
      point.isModeChange = true;
      point.prevMode = prevPoint.mode;
    }
  });

  const modeChangePoints: ModeChangePoint[] = [];
  chartData.forEach((point: ChartDataPoint, index: number) => {
    if (index === 0) {
      return;
    }
    const prevPoint = chartData[index - 1];
    if (prevPoint.mode !== point.mode) {
      modeChangePoints.push({
        x: point.timestamp,
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
            {xDomain && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setXDomain(undefined);
                  setRefAreaLeft(null);
                  setRefAreaRight(null);
                }}
                className="h-9"
              >
                Reset zoom
              </Button>
            )}
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
          <div ref={containerRef} className="relative">
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
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  onDoubleClick={() => {
                    setXDomain(undefined);
                    setRefAreaLeft(null);
                    setRefAreaRight(null);
                  }}
                  onMouseDown={(nextState: CategoricalChartState) => {
                    if (nextState && typeof nextState.activeLabel === 'number') {
                      setRefAreaLeft(nextState.activeLabel);
                      setRefAreaRight(null);
                    }
                  }}
                  onMouseMove={(nextState: CategoricalChartState) => {
                    if (refAreaLeft !== null && nextState && typeof nextState.activeLabel === 'number') {
                      setRefAreaRight(nextState.activeLabel);
                    }
                  }}
                  onMouseUp={() => {
                    if (refAreaLeft !== null && refAreaRight !== null && refAreaLeft !== refAreaRight) {
                      const [start, end] =
                        refAreaLeft < refAreaRight ? [refAreaLeft, refAreaRight] : [refAreaRight, refAreaLeft];
                      setXDomain([start, end]);
                    }
                    setRefAreaLeft(null);
                    setRefAreaRight(null);
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="timestamp"
                    type="number"
                    scale="time"
                    allowDataOverflow
                    domain={xDomain ?? ['dataMin', 'dataMax']}
                    tickFormatter={(ts: number) =>
                      new Date(ts).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    }
                    className="text-xs select-none"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-xs select-none"
                    tick={{ fontSize: 12 }}
                    label={{
                      value: `Temperature (${getTemperatureUnitSymbol(temperatureDisplay)})`,
                      angle: -90,
                      position: 'insideLeft',
                    }}
                    domain={temperatureDisplay === 'Fahrenheit' ? [53.6, 82.4] : [12, 28]}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value, payload) => {
                          const p = payload && payload[0] ? payload[0].payload : undefined;
                          const baseLabel = p?.fullDate ?? value;

                          if (p?.isModeChange) {
                            const fromLabel =
                              p?.prevMode !== undefined
                                ? modeLabels[p.prevMode as DeviceInformation['mode']]
                                : undefined;
                            const toLabel = modeLabels[p.mode as DeviceInformation['mode']];
                            return (
                              <div className="flex flex-col">
                                <span>{baseLabel}</span>
                                <span className="text-muted-foreground">{`Mode changed: ${fromLabel ?? ''} → ${toLabel}`}</span>
                              </div>
                            );
                          }

                          const label =
                            p?.mode !== undefined ? modeLabels[p.mode as DeviceInformation['mode']] : 'unknown';

                          return (
                            <div className="flex flex-col">
                              <span>{baseLabel}</span>
                              <span className="text-muted-foreground">{`Mode: ${label}`}</span>
                            </div>
                          );
                        }}
                        formatter={(value, name, props) => {
                          if (typeof value === 'number' && typeof name === 'string' && props?.payload) {
                            // Format temperature values with proper precision using original Celsius values
                            if (name === 'Max Temperature') {
                              return `Max: ${formatTemperature(props.payload.maxTempCelsius, temperatureDisplay)}`;
                            }
                            if (name === 'Min Temperature') {
                              return `Min: ${formatTemperature(props.payload.minTempCelsius, temperatureDisplay)}`;
                            }
                            if (name === 'Current Temperature') {
                              return `Current: ${formatTemperature(props.payload.currentTempCelsius, temperatureDisplay)}`;
                            }
                          }
                          return `${name}: ${value}`;
                        }}
                      />
                    }
                  />
                  {chartData.length > 0 && (
                    <ReferenceLine x={chartData[0].timestamp} stroke={modeStrokes[chartData[0].mode]} strokeWidth={1}>
                      {showLabels && (
                        <Label
                          value={modeLabels[chartData[0].mode]}
                          position="insideTopLeft"
                          style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                        />
                      )}
                    </ReferenceLine>
                  )}
                  {showModeChangeLines &&
                    modeChangePoints.map((changePoint: ModeChangePoint, index: number) => (
                      <ReferenceLine
                        key={`mode-change-${index}`}
                        x={changePoint.x}
                        stroke={modeStrokes[changePoint.mode]}
                        strokeDasharray="5 5"
                        strokeWidth={1}
                      >
                        {showLabels && (
                          <Label
                            value={modeLabels[changePoint.mode]}
                            position="insideTopLeft"
                            style={{ fontSize: '12px', fill: 'var(--muted-foreground)' }}
                          />
                        )}
                      </ReferenceLine>
                    ))}
                  <Line
                    isAnimationActive={false}
                    dot={false}
                    type="monotone"
                    dataKey="maxTemp"
                    stroke="var(--chart-3)"
                    strokeWidth={2}
                    name="Max Temperature"
                  />
                  <Line
                    isAnimationActive={false}
                    dot={false}
                    type="monotone"
                    dataKey="minTemp"
                    stroke="var(--chart-1)"
                    strokeWidth={2}
                    name="Min Temperature"
                  />
                  <Line
                    isAnimationActive={false}
                    dot={false}
                    type="monotone"
                    dataKey="currentTemp"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    name="Current Temperature"
                  />
                  {refAreaLeft !== null && refAreaRight !== null && (
                    <ReferenceArea
                      x1={Math.min(refAreaLeft, refAreaRight)}
                      x2={Math.max(refAreaLeft, refAreaRight)}
                      strokeOpacity={0.3}
                      fill="var(--accent)"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div
              ref={legendRef}
              className="absolute bg-background/90 backdrop-blur border rounded-md shadow-sm p-2 select-none cursor-move"
              style={
                legendPosition.x === null || legendPosition.y === null
                  ? { top: 8, right: 33 }
                  : { top: legendPosition.y, left: legendPosition.x }
              }
              onMouseDown={(e) => {
                if (!containerRef.current || !legendRef.current) {
                  return;
                }
                const containerRect = containerRef.current.getBoundingClientRect();
                const legendRect = legendRef.current.getBoundingClientRect();
                setIsDragging(true);
                dragOffsetRef.current = {
                  x: e.clientX - legendRect.left,
                  y: e.clientY - legendRect.top,
                };
                setLegendPosition({
                  x: legendRect.left - containerRect.left,
                  y: legendRect.top - containerRect.top,
                });
              }}
            >
              <div className="text-xs font-medium text-muted-foreground mb-1">Modes</div>
              <div className="flex flex-col gap-1">
                {([0, 1, 2, 3, 4] as DeviceInformation['mode'][]).map((mode) => (
                  <div key={mode} className="flex items-center gap-2 text-xs">
                    <span className="inline-block h-2.5 w-2.5 rounded" style={{ backgroundColor: modeStrokes[mode] }} />
                    <span className="text-foreground/90">{modeLabels[mode]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-end gap-2">
        <LabelUI htmlFor="show-labels">
          <span className="text-sm font-medium leading-none cursor-pointer">Show Mode Labels</span>
          <Checkbox
            id="show-labels"
            aria-label="Toggle labels"
            checked={showLabels}
            onCheckedChange={(value) => {
              const next = !!value;
              setShowLabels(next);
              document.cookie = `show_labels=${next ? 'true' : 'false'}; path=/; max-age=${60 * 60 * 24 * 7}`;
            }}
          />
        </LabelUI>
        <LabelUI htmlFor="show-mode-lines">
          <span className="text-sm font-medium leading-none cursor-pointer">Show Mode Change Lines</span>
          <Checkbox
            id="show-mode-lines"
            aria-label="Toggle mode change lines"
            checked={showModeChangeLines}
            onCheckedChange={(value) => {
              const next = !!value;
              setShowModeChangeLines(next);
              document.cookie = `show_mode_lines=${next ? 'true' : 'false'}; path=/; max-age=${60 * 60 * 24 * 7}`;
            }}
          />
        </LabelUI>
      </CardFooter>
    </Card>
  );
}
