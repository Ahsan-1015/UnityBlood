import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-sm">
        <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
        <p className="text-white font-bold text-base">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#64748b",
];

const Chart = () => {
  const axiosSecure = useAxiosSecure();

  const { data: allFunding10 = [] } = useQuery({
    queryKey: ["allFunding10"],
    queryFn: async () => {
      const res = await axiosSecure.get("/allFunding10");
      return res.data;
    },
  });

  const amountDateArray = allFunding10.map((funding) => ({
    amount: funding.amount,
    date: format(new Date(funding.date), "dd MMM"),
  }));

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-sm shadow-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div>
          <h2 className="text-white font-bold text-lg">Funding Overview</h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Last 10 donations by date
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-red-400 text-xs font-semibold">Live</span>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4 md:p-6">
        {amountDateArray.length === 0 ? (
          <div className="flex items-center justify-center h-48">
            <p className="text-slate-500 text-sm">No funding data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={amountDateArray}
              margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
              barCategoryGap="30%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.05)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "rgba(255,255,255,0.04)", radius: 6 }}
              />
              <Bar
                dataKey="amount"
                radius={[6, 6, 0, 0]}
                activeBar={<Rectangle fill="rgba(239,68,68,0.9)" radius={[6, 6, 0, 0]} />}
              >
                {amountDateArray.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend-style summary */}
      {amountDateArray.length > 0 && (
        <div className="px-6 py-4 border-t border-white/5 flex flex-wrap gap-3">
          {amountDateArray.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></span>
              <span className="text-slate-400 text-xs">
                {item.date}:{" "}
                <span className="text-slate-300 font-semibold">
                  ${item.amount}
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Chart;
