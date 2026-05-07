import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const days = [
  "senin",
  "selasa",
  "rabu",
  "kamis",
  "jumat",
  "sabtu",
  "minggu",
];

export default function App() {
  const [weeklyBudget, setWeeklyBudget] = useState(100000);

  const [dailyBudget, setDailyBudget] = useState({
    senin: 12000,
    selasa: 14000,
    rabu: 22000,
    kamis: 14000,
    jumat: 14000,
    sabtu: 12000,
    minggu: 12000,
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");

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

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  const totalDailyBudget = Object.values(dailyBudget).reduce(
    (a, b) => a + b,
    0
  );

  const adjustedBudget = useMemo(() => {
    const updated = { ...dailyBudget };

    let overspend = 0;

    days.forEach((day) => {
      if (expenses[day] > updated[day]) {
        overspend += expenses[day] - updated[day];
      }
    });

    const futureDays = days.filter(
      (day) => expenses[day] <= updated[day]
    );

    if (futureDays.length > 0 && overspend > 0) {
      const cut = Math.ceil(overspend / futureDays.length);

      futureDays.forEach((day) => {
        updated[day] = Math.max(updated[day] - cut, 0);
      });
    }

    return updated;
  }, [expenses, dailyBudget]);

  const totalExpense = Object.values(expenses).reduce(
    (a, b) => a + b,
    0
  );

  const remaining = weeklyBudget - totalExpense;

  const percent = (totalExpense / weeklyBudget) * 100;

  const chartData = days.map((day) => ({
    name: day,
    budget: adjustedBudget[day],
    expense: expenses[day],
  }));

  const monthlyTotal = history.reduce(
    (sum, item) => sum + item.total,
    0
  );

  function saveWeek() {
    const newEntry = {
      month: new Date().toLocaleString("id-ID", {
        month: "long",
      }),
      total: totalExpense,
      data: expenses,
    };

    setHistory([...history, newEntry]);

    setExpenses({
      senin: 0,
      selasa: 0,
      rabu: 0,
      kamis: 0,
      jumat: 0,
      sabtu: 0,
      minggu: 0,
    });
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white font-mono overflow-hidden relative">

      {/* PIXEL BACKGROUND */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#22c55e_1px,transparent_1px),linear-gradient(to_bottom,#22c55e_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* GLOW */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-green-500/10 blur-3xl rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto p-6 grid lg:grid-cols-2 gap-6">

        {/* LEFT PANEL */}
        <div
          className="bg-[#071018] border-4 border-green-400 p-6 shadow-[0_0_30px_rgba(34,197,94,0.25)]"
          style={{
            clipPath:
              "polygon(0px 8px, 8px 8px, 8px 0px, calc(100% - 8px) 0px, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 0px) 100%, 8px 100%, 8px calc(100% - 8px), 0px calc(100% - 8px))",
          }}
        >

          {/* HEADER */}
          <div className="flex justify-between items-center mb-8">

            <div>
              <h1 className="text-4xl text-green-400 tracking-widest drop-shadow-[0_0_10px_#22c55e]">
                KINICH_SYS
              </h1>

              <p className="text-xs text-green-700 mt-1">
                NATLAN BUDGET TERMINAL
              </p>
            </div>

            <div className="border-2 border-green-400 w-14 h-14 flex items-center justify-center text-2xl bg-black">
              🌿
            </div>

          </div>

          {/* WEEKLY BUDGET */}
          <div className="mb-8">

            <div className="mb-3">
              <h2 className="text-xl text-green-300 tracking-widest">
                WEEKLY BUDGET
              </h2>

              <p className="text-[11px] text-green-700">
                Main weekly allocation
              </p>
            </div>

            <input
              type="number"
              value={weeklyBudget}
              onChange={(e) =>
                setWeeklyBudget(Number(e.target.value))
              }
              className="w-full bg-black border-2 border-cyan-400 px-4 py-3 text-cyan-300 text-lg outline-none focus:shadow-[0_0_12px_#22d3ee]"
            />

          </div>

          {/* DAILY BUDGET */}
          <div className="mb-8">

            <div className="mb-5 border-l-4 border-yellow-400 pl-3">

              <h2 className="text-2xl text-yellow-300 tracking-widest">
                DAILY BUDGET
              </h2>

              <p className="text-[11px] text-yellow-700">
                Configure each day allocation
              </p>

            </div>

            <div className="space-y-3">

              {days.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between bg-black border border-yellow-500/30 px-3 py-2"
                >

                  <span className="uppercase text-yellow-300 w-20">
                    {day}
                  </span>

                  <input
                    type="number"
                    value={dailyBudget[day]}
                    onChange={(e) =>
                      setDailyBudget({
                        ...dailyBudget,
                        [day]: Number(e.target.value),
                      })
                    }
                    className="bg-[#0f172a] border border-yellow-400 text-yellow-300 px-2 py-1 w-28 outline-none"
                  />

                </div>
              ))}

            </div>

            {totalDailyBudget > weeklyBudget && (
              <div className="mt-4 border border-red-500 bg-red-950/20 p-3 text-red-400 text-sm animate-pulse">
                ⚠ DAILY LIMIT EXCEEDS WEEKLY BUDGET
              </div>
            )}

          </div>

          {/* INPUT EXPENSE */}
          <div className="mb-8">

            <div className="mb-5 border-l-4 border-red-400 pl-3">

              <h2 className="text-2xl text-red-300 tracking-widest">
                INPUT EXPENSE
              </h2>

              <p className="text-[11px] text-red-700">
                Real spending tracker
              </p>

            </div>

            <div className="space-y-3">

              {days.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-between bg-black border border-red-500/30 px-3 py-2"
                >

                  <span className="uppercase text-red-300 w-20">
                    {day}
                  </span>

                  <input
                    type="number"
                    value={expenses[day]}
                    onChange={(e) =>
                      setExpenses({
                        ...expenses,
                        [day]: Number(e.target.value),
                      })
                    }
                    className="bg-[#0f172a] border border-red-400 text-red-300 px-2 py-1 w-28 outline-none"
                  />

                  <span className="text-xs text-green-400 w-20 text-right">
                    {adjustedBudget[day]}
                  </span>

                </div>
              ))}

            </div>

          </div>

          {/* PROGRESS */}
          <div className="mb-6">

            <div className="flex justify-between text-sm mb-2">
              <span className="text-cyan-300">
                SYSTEM ENERGY
              </span>

              <span>
                {Math.floor(percent)}%
              </span>
            </div>

            <div className="w-full h-5 border-2 border-cyan-400 bg-black overflow-hidden">

              <div
                className={`h-full transition-all duration-500 ${
                  percent > 90
                    ? "bg-red-500"
                    : percent > 70
                    ? "bg-yellow-400"
                    : "bg-green-400"
                }`}
                style={{
                  width: `${percent}%`,
                }}
              />

            </div>

          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 gap-4">

            <div className="border border-green-500 p-4 bg-black">

              <p className="text-xs text-green-700 mb-1">
                TOTAL USED
              </p>

              <h2 className="text-2xl text-green-400">
                Rp{totalExpense}
              </h2>

            </div>

            <div className="border border-cyan-500 p-4 bg-black">

              <p className="text-xs text-cyan-700 mb-1">
                REMAINING
              </p>

              <h2 className="text-2xl text-cyan-300">
                Rp{remaining}
              </h2>

            </div>

          </div>

          {/* SAVE */}
          <button
            onClick={saveWeek}
            className="mt-6 w-full py-3 border-2 border-green-400 text-green-300 hover:bg-green-400 hover:text-black transition-all duration-300 tracking-widest"
          >
            SAVE WEEK DATA
          </button>

        </div>

        {/* RIGHT PANEL */}
        <div
          className="bg-[#071018] border-4 border-cyan-400 p-6 shadow-[0_0_30px_rgba(34,211,238,0.25)]"
          style={{
            clipPath:
              "polygon(0px 8px, 8px 8px, 8px 0px, calc(100% - 8px) 0px, calc(100% - 8px) 8px, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 0px) 100%, 8px 100%, 8px calc(100% - 8px), 0px calc(100% - 8px))",
          }}
        >

          <div className="mb-6">

            <h2 className="text-3xl text-cyan-300 tracking-widest">
              ANALYTICS
            </h2>

            <p className="text-xs text-cyan-700 mt-1">
              Spending analysis terminal
            </p>

          </div>

          {/* CHART */}
          <div className="h-[350px] border border-cyan-500 bg-black p-6 mb-8 flex items-center justify-center">

            <div className="w-full h-full flex items-center justify-center">

              <ResponsiveContainer width="100%" height="95%">

                <BarChart
                  data={chartData}
                  layout="horizontal"
                  margin={{
                    top: 20,
                    right: 20,
                    left: 0,
                    bottom: 10,
                  }}
                  barCategoryGap="18%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#083344"
                  />

                  <XAxis
                    dataKey="name"
                    stroke="#67e8f9"
                    tick={{
                      fontSize: 13,
                      fill: "#67e8f9",
                    }}
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    padding={{
                      left: 20,
                      right: 0,
                    }}
                  />

                  <YAxis
                    stroke="#67e8f9"
                    tick={{
                      fontSize: 11,
                      fill: "#67e8f9",
                    }}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />

                  <Tooltip
                    cursor={{
                      fill: "rgba(255,255,255,0.08)",
                    }}
                    contentStyle={{
                      backgroundColor: "#020617",
                      border: "2px solid #22d3ee",
                      color: "#67e8f9",
                      fontFamily: "monospace",
                    }}
                  />

                  <Bar
                    dataKey="budget"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />

                  <Bar
                    dataKey="expense"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* HISTORY */}
          <div>

            <div className="mb-5 border-l-4 border-cyan-400 pl-3">

              <h2 className="text-2xl text-cyan-300 tracking-widest">
                MONTHLY HISTORY
              </h2>

              <p className="text-[11px] text-cyan-700">
                Weekly spending archive
              </p>

            </div>

            <div className="space-y-4 max-h-[420px] overflow-auto pr-2">

              {history.map((item, index) => (
                <div
                  key={index}
                  className="border border-cyan-500 bg-black p-4"
                >

                  <div className="flex justify-between items-center mb-4">

                    <span className="text-cyan-300 text-lg tracking-widest">
                      {item.month.toUpperCase()}
                    </span>

                    <span className="text-green-400">
                      Rp{item.total}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    {days.map((day) => (
                      <div
                        key={day}
                        className="flex justify-between text-xs border border-cyan-900 px-2 py-1"
                      >

                        <span className="text-cyan-700">
                          {day}
                        </span>

                        <span className="text-cyan-300">
                          Rp{item.data[day]}
                        </span>

                      </div>
                    ))}

                  </div>

                </div>
              ))}

            </div>

            {/* TOTAL */}
            <div className="mt-6 border-2 border-green-500 bg-black p-4 flex justify-between items-center">

              <div>
                <p className="text-xs text-green-700">
                  MONTH TOTAL
                </p>

                <h2 className="text-2xl text-green-400">
                  Rp{monthlyTotal}
                </h2>
              </div>

              <div className="text-3xl">
                📊
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}