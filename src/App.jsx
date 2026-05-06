import { useState, useMemo, useEffect } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function App() {
  const budget = 100000;

  const base = {
    senin: 12000,
    selasa: 14000,
    rabu: 22000,
    kamis: 14000,
    jumat: 14000,
    sabtu: 12000,
    minggu: 12000,
  };

  const [extra, setExtra] = useState(() => {
    const saved = localStorage.getItem("budget-extra");

    return saved
      ? JSON.parse(saved)
      : {
          senin: 0,
          selasa: 0,
          rabu: 0,
          kamis: 0,
          jumat: 0,
          sabtu: 0,
          minggu: 0,
        };
  });

  useEffect(() => {
    localStorage.setItem("budget-extra", JSON.stringify(extra));
  }, [extra]);

  const computed = useMemo(() => {
    let total = 0;
    const expenses = {};

    Object.keys(base).forEach((day) => {
      const val = base[day] + extra[day];
      expenses[day] = val;
      total += val;
    });

    return {
      expenses,
      total,
      sisa: budget - total,
      percent: (total / budget) * 100,
    };
  }, [extra]);

  const chartData = Object.keys(computed.expenses).map((day) => ({
    name: day,
    total: computed.expenses[day],
  }));

  return (
    <div className="min-h-screen bg-[#050816] text-green-300 flex items-center justify-center overflow-hidden relative font-mono p-4">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/10 blur-3xl rounded-full top-[-150px] left-[-150px]" />
      <div className="absolute w-[400px] h-[400px] bg-lime-400/10 blur-3xl rounded-full bottom-[-100px] right-[-100px]" />

      {/* Main Card */}
      <div
        className="
          relative z-10 w-full max-w-md
          bg-black/70 backdrop-blur-md
          p-6
          border-4 border-green-400
          shadow-[0_0_40px_rgba(34,197,94,0.35)]
        "
        style={{
          clipPath:
            "polygon(0px 8px, 8px 8px, 8px 0px, calc(100% - 8px) 0px, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 0px) 100%, 8px 100%, 8px calc(100% - 8px), 0px calc(100% - 8px))",
        }}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl tracking-widest text-green-400 drop-shadow-[0_0_8px_#22c55e]">
              WEEKLY BUDGET INTERFACE
            </h1>

            <p className="text-[11px] text-green-700">
              Seventh_System
            </p>
          </div>

          <div className="w-12 h-12 border border-green-500 flex items-center justify-center text-xl shadow-[0_0_12px_#22c55e]">
            🌿
          </div>
        </div>

        {/* Budget Info */}
        <div className="space-y-2 text-sm border border-green-500/30 p-3 bg-green-950/10">

          <div className="flex justify-between">
            <span className="text-green-600">TOTAL</span>
            <span>Rp{budget}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-green-600">USED</span>
            <span>Rp{computed.total}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-green-600">LEFT</span>

            <span className={computed.sisa < 0 ? "text-red-400" : ""}>
              Rp{computed.sisa}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex justify-between text-[11px] mb-1 text-green-700">
            <span>ENERGY</span>
            <span>{Math.floor(computed.percent)}%</span>
          </div>

          <div className="w-full h-4 border border-green-500 bg-black overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                computed.percent > 90
                  ? "bg-red-500"
                  : computed.percent > 70
                  ? "bg-yellow-400"
                  : "bg-green-400"
              } shadow-[0_0_12px_currentColor]`}
              style={{ width: `${computed.percent}%` }}
            />
          </div>
        </div>

        {/* Chart */}
        <div className="mt-6 border border-green-500/30 p-3 bg-green-950/10">
          <h3 className="text-xs text-green-500 mb-3 tracking-widest">
            EXPENSE_GRAPH.exe
          </h3>

          <div className="w-full h-44">
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <XAxis
                  dataKey="name"
                  stroke="#22c55e"
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  stroke="#22c55e"
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#020617",
                    border: "1px solid #22c55e",
                    color: "#22c55e",
                  }}
                />

                <Bar
                  dataKey="total"
                  fill="#22c55e"
                  radius={[0, 0, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Input */}
        <div className="mt-6">
          <h3 className="text-xs tracking-widest text-green-500 mb-3">
            INPUT_PANEL
          </h3>

          <div className="space-y-2">
            {Object.keys(extra).map((day) => (
              <div
                key={day}
                className="flex items-center justify-between border border-green-500/20 px-2 py-2 bg-black/40 text-xs"
              >

                <span className="uppercase w-16 text-green-400">
                  {day}
                </span>

                <input
                  type="number"
                  value={extra[day]}
                  onChange={(e) =>
                    setExtra({
                      ...extra,
                      [day]: Number(e.target.value),
                    })
                  }
                  className="bg-black border border-green-500 text-green-300 px-2 py-1 w-20 text-right outline-none focus:shadow-[0_0_8px_#22c55e]"
                />

                <span className="w-24 text-right text-green-600">
                  Rp{computed.expenses[day]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        {computed.sisa < 0 && (
          <div className="mt-4 border border-red-500 bg-red-950/20 p-2 text-red-400 text-xs animate-pulse">
            ⚠ OVER BUDGET DETECTED
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => {
            localStorage.removeItem("budget-extra");
            window.location.reload();
          }}
          className="mt-5 w-full border border-green-500 py-2 text-sm tracking-widest hover:bg-green-500 hover:text-black transition-all duration-300 shadow-[0_0_12px_#22c55e]"
        >
          RESET_SYSTEM
        </button>

        {/* Footer */}
        <div className="mt-4 flex justify-between text-[10px] text-green-800">
          <span>SeventhE16</span>
          <span>Farel Assadida</span>
        </div>

      </div>
    </div>
  );
}