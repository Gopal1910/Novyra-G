
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent";

interface TimeSeriesChartProps {
  data: any[];
  dataKey: string;
  stroke?: string;
  fill?: string;
  gradient?: boolean;
  title?: string;
  height?: number | string;
  yAxisLabel?: string;
  xAxisDataKey?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel-blue p-3">
        <p className="text-xs font-mono text-gray-400">{`${label}`}</p>
        <p className="text-sm font-mono text-white font-medium">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const TimeSeriesChart = ({
  data,
  dataKey,
  stroke = "#00A3FF",
  fill = "#00A3FF",
  gradient = true,
  title,
  height = 200,
  yAxisLabel,
  xAxisDataKey = "time"
}: TimeSeriesChartProps) => {
  const id = `color-${dataKey}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="glass-panel p-4 h-full">
      {title && <h3 className="text-white text-sm mb-4 font-medium">{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            {gradient && (
              <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={fill} stopOpacity={0.3} />
                <stop offset="95%" stopColor={fill} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey={xAxisDataKey} 
            tick={{ fill: '#8E9196', fontSize: 10 }} 
            stroke="rgba(255,255,255,0.1)" 
          />
          <YAxis 
            tick={{ fill: '#8E9196', fontSize: 10 }} 
            stroke="rgba(255,255,255,0.1)" 
            label={
              yAxisLabel ? { 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#8E9196', fontSize: 10, textAnchor: 'middle' }
              } : undefined
            } 
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={stroke}
            strokeWidth={2}
            fill={gradient ? `url(#${id})` : fill}
            activeDot={{ r: 6, fill: '#fff', stroke: stroke }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSeriesChart;
