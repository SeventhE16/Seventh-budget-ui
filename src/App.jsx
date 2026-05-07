import { useEffect, useMemo, useState } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
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

  // TOTAL DAILY BUDGET
  const totalDailyBudget = Object.values(dailyBudget).reduce(
    (a, b) => a + b,
    0
  );

  // REDISTRIBUTION
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
    <div className="min-h-screen bg-[#050816] text-green-300 p-4 font-mono">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-4">

        {/* LEFT */}
        <div className="border-4 border-green-500 p-5 bg-black/70">

          <h1 className="text-2xl mb-5 text-green-400">
            KINICH_SYS
          </h1>

          {/* WEEKLY */}
          <div className="mb-5">
            <p className="text-sm mb-2">WEEKLY BUDGET</p>

            <input
              type="number"
              value={weeklyBudget}
              onChange={(e) =>
                setWeeklyBudget(Number(e.target.value))
              }
              className="w-full bg-black border border-green-500 px-3 py-2"
            />
          </div>

          {/* DAILY */}
          <div className="mb-5">
            <p className="text-sm mb-3">DAILY BUDGET</p>

            <div className="space-y-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="uppercase w-20">
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
                    className="bg-black border border-green-500 px-2 py-1 w-24"
                  />
                </div>
              ))}
            </div>

            {totalDailyBudget > weeklyBudget && (
              <p className="text-red-400 text-xs mt-2">
                ⚠ TOTAL DAILY BUDGET EXCEEDS WEEKLY LIMIT
              </p>
            )}
          </div>

          {/* EXPENSE */}
          <div className="mb-5">
            <p className="text-sm mb-3">INPUT EXPENSE</p>

            <div className="space-y-2">
              {days.map((day) => (
                <div
                  key={day}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="uppercase w-20">
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
                    className="bg-black border border-green-500 px-2 py-1 w-24"
                  />

                  <span className="text-xs text-green-500 w-20 text-right">
                    {adjustedBudget[day]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PROGRESS */}
          <div className="mb-5">

            <div className="flex justify-between text-xs mb-1">
              <span>USED</span>
              <span>{Math.floor(percent)}%</span>
            </div>

            <div className="w-full h-4 border border-green-500">
              <div
                className={`h-full ${
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
          <div className="border border-green-500 p-3 text-sm space-y-1">

            <div className="flex justify-between">
              <span>TOTAL USED</span>
              <span>Rp{totalExpense}</span>
            </div>

            <div className="flex justify-between">
              <span>REMAINING</span>
              <span>Rp{remaining}</span>
            </div>

          </div>

          <button
            onClick={saveWeek}
            className="mt-5 w-full border border-green-500 py-2 hover:bg-green-500 hover:text-black"
          >
            SAVE WEEK
          </button>

        </div>

        {/* RIGHT */}
        <div className="border-4 border-green-500 p-5 bg-black/70">

          <h2 className="text-xl text-green-400 mb-5">
            ANALYTICS
          </h2>

          {/* CHART */}
          <div className="h-64 mb-6">
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
                barCategoryGap="20%"
              >
                <XAxis
                  dataKey="name"
                  stroke="#22c55e"
                  tick={{
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  stroke="#22c55e"
                  tick={{
                    fontSize: 11,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="budget"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />

                <Bar
                  dataKey="expense"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* HISTORY */}
          <div>

            <h3 className="text-sm mb-3">
              MONTHLY HISTORY
            </h3>

            <div className="space-y-3 max-h-[400px] overflow-auto">

              {history.map((item, index) => (
                <div
                  key={index}
                  className="border border-green-500 p-3 text-sm"
                >

                  <div className="flex justify-between mb-2">
                    <span>
                      {item.month.toUpperCase()}
                    </span>

                    <span>
                      Rp{item.total}
                    </span>
                  </div>

                  {days.map((day) => (
                    <div
                      key={day}
                      className="flex justify-between text-xs text-green-500"
                    >
                      <span>{day}</span>
                      <span>
                        Rp{item.data[day]}
                      </span>
                    </div>
                  ))}

                </div>
              ))}

            </div>

            <div className="mt-5 border border-green-500 p-3">

              <div className="flex justify-between text-sm">
                <span>MONTH TOTAL</span>
                <span>Rp{monthlyTotal}</span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}