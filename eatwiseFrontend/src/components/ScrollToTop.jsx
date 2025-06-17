import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
/*import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import api from "../api";

const DAYS_ORDER = [
  { key: "lundi", label: "Lun" },
  { key: "mardi", label: "Mar" },
  { key: "mercredi", label: "Mer" },
  { key: "jeudi", label: "Jeu" },
  { key: "vendredi", label: "Ven" },
  { key: "samedi", label: "Sam" },
  { key: "dimanche", label: "Dim" },
];

const COLORS = {
  calories: "#f97316",
  protein: "#22c55e",
  carbs: "#eab308",
  fat: "#3b82f6",
};

const MACROS_TARGETS = { protein: 120, carbs: 200, fat: 60 }; // à adapter selon l'utilisateur
const CALORIE_TARGET = 2000; // à adapter selon l'utilisateur

export default function WeeklyHistoryChart({
  calorieTarget = 2000,
  macrosTargets = { protein: 120, carbs: 200, fat: 60 },
}) {
  const [data, setData] = useState([]);
  const [mode, setMode] = useState("calories");
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api
      .get("/planning/consumptions")
      .then((res) => {
        const days = res.data.days || {};
        const daysData = DAYS_ORDER.map(({ key, label }) => {
          const vals = days[key] || {};
          return {
            day: label,
            calories: Math.round(Number(vals.calories) || 0),
            protein: Math.round(Number(vals.protein) || 0),
            carbs: Math.round(Number(vals.carbs) || 0),
            fat: Math.round(Number(vals.fat) || 0),
          };
        });
        setData(daysData);
      })
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer pour déclencher l'animation au scroll
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setAnimate(true);
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -20% 0px",
      }
    );
    if (chartRef.current) observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const yMax = mode === "calories" ? 4000 : 600;
  const yLabel = mode === "calories" ? "kcal" : "g";

  // Vérifie si toutes les valeurs sont à zéro
  const isEmpty = data.every((d) =>
    mode === "calories"
      ? d.calories === 0
      : d.protein === 0 && d.carbs === 0 && d.fat === 0
  );

  return (
    <div
      ref={chartRef}
      style={{ width: "100%", maxWidth: 800, height: 400, margin: "0 auto" }}
    >
      <div style={{ marginBottom: 12, display: "flex", gap: 8 }}>
        <button
          onClick={() => setMode("calories")}
          style={{
            marginRight: 8,
            background: mode === "calories" ? COLORS.calories : "#fff",
            color: mode === "calories" ? "#fff" : COLORS.calories,
            border: `1px solid ${COLORS.calories}`,
            borderRadius: 6,
            padding: "4px 12px",
            fontWeight: "bold",
          }}
        >
          Calories
        </button>
        <button
          onClick={() => setMode("macros")}
          style={{
            background: mode === "macros" ? COLORS.protein : "#fff",
            color: mode === "macros" ? "#fff" : COLORS.protein,
            border: `1px solid ${COLORS.protein}`,
            borderRadius: 6,
            padding: "4px 12px",
            fontWeight: "bold",
          }}
        >
          Macros
        </button>
      </div>
      <div
        style={{
          width: "100%",
          height: 360,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: 16,
        }}
      >
        {loading ? (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: 18,
              marginTop: 100,
            }}
          >
            Chargement…
          </div>
        ) : isEmpty ? (
          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: 18,
              marginTop: 100,
            }}
          >
            Aucune donnée disponible
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis
                domain={[0, yMax]}
                label={{ value: yLabel, angle: -90, position: "insideLeft" }}
              />
              <Tooltip />
              <Legend />
              {mode === "calories"
                ? [
                    <Line
                      key="calories"
                      type="monotone"
                      dataKey="calories"
                      stroke={COLORS.calories}
                      strokeWidth={1}
                      dot={{ r: 4, fill: COLORS.calories }}
                      activeDot={{ r: 7, fill: COLORS.calories }}
                      isAnimationActive={animate}
                      connectNulls={true}
                      name="Calories"
                    />,
                    <ReferenceLine
                      key="calories-ref"
                      y={calorieTarget}
                      label="Objectif"
                      stroke={COLORS.calories}
                      strokeDasharray="6 2"
                      ifOverflow="extendDomain"
                    />,
                  ]
                : [
                    <Line
                      key="protein"
                      type="monotone"
                      dataKey="protein"
                      stroke={COLORS.protein}
                      strokeWidth={1}
                      dot={{ r: 4, fill: COLORS.protein }}
                      activeDot={{ r: 7, fill: COLORS.protein }}
                      isAnimationActive={animate}
                      connectNulls={true}
                      name="Protéines"
                    />,
                    <Line
                      key="carbs"
                      type="monotone"
                      dataKey="carbs"
                      stroke={COLORS.carbs}
                      strokeWidth={1}
                      dot={{ r: 4, fill: COLORS.carbs }}
                      activeDot={{ r: 7, fill: COLORS.carbs }}
                      isAnimationActive={animate}
                      connectNulls={true}
                      name="Glucides"
                    />,
                    <Line
                      key="fat"
                      type="monotone"
                      dataKey="fat"
                      stroke={COLORS.fat}
                      strokeWidth={1}
                      dot={{ r: 4, fill: COLORS.fat }}
                      activeDot={{ r: 7, fill: COLORS.fat }}
                      isAnimationActive={animate}
                      connectNulls={true}
                      name="Lipides"
                    />,
                    <ReferenceLine
                      key="protein-ref"
                      y={macrosTargets.protein}
                      label="Prot. obj."
                      stroke={COLORS.protein}
                      strokeDasharray="6 2"
                      ifOverflow="extendDomain"
                    />,
                    <ReferenceLine
                      key="carbs-ref"
                      y={macrosTargets.carbs}
                      label="Gluc. obj."
                      stroke={COLORS.carbs}
                      strokeDasharray="6 2"
                      ifOverflow="extendDomain"
                    />,
                    <ReferenceLine
                      key="fat-ref"
                      y={macrosTargets.fat}
                      label="Lip. obj."
                      stroke={COLORS.fat}
                      strokeDasharray="6 2"
                      ifOverflow="extendDomain"
                    />,
                  ]}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}*/
 /* import { useEffect, useState } from "react";
import api from "../api";
import DashboardHeader from "../components/DashboardHeader";
import GoalCards from "../components/GoalCards";
import DayProgressSection from "../components/DayProgressSection";
import MealsOfTheDaySection from "../components/MealsOfTheDaySection";
import WeeklyHistoryChart from "../components/WeeklyHistoryChart";
import MonthlyHistoryChart from "../components/MonthlyHistoryChart";

export default function Dashboard() {
  const [tdee, setTdee] = useState({});
  useEffect(() => {
    api.get("/user/tdee").then((res) => setTdee(res.data));
  }, []);

  return (
    <div className="mx-auto mt-16 bg-gray-50 px-4 py-6">
      <DashboardHeader />
      <GoalCards tdee={tdee} />
      <DayProgressSection goals={tdee} />
      <MealsOfTheDaySection />
      <WeeklyHistoryChart
        calorieTarget={tdee.calories || 2000}
        macrosTargets={{
          protein: tdee.protein || 120,
          carbs: tdee.carbs || 200,
          fat: tdee.fat || 60,
        }}
      />
      <MonthlyHistoryChart calorieTarget={tdee.calories} macrosTargets={tdee} />

      
    </div>
  );
}

 */