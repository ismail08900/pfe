import { useEffect, useRef, useState } from "react";
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
import { ChevronLeft, ChevronRight } from "lucide-react";
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
  const [currentWeek] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
    );
    return monday.toISOString().split("T")[0];
  });
  const [viewedWeek, setViewedWeek] = useState(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(
      now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1)
    );
    return monday.toISOString().split("T")[0];
  });
  const chartRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/planning/weekly-consumptions?week_start=${viewedWeek}`)
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
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [viewedWeek]);

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

  // Calcul des totaux hebdomadaires
  const weekTotals = data.reduce(
    (acc, d) => ({
      calories: acc.calories + (d.calories || 0),
      protein: acc.protein + (d.protein || 0),
      carbs: acc.carbs + (d.carbs || 0),
      fat: acc.fat + (d.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  const weekGoals = {
    calories: calorieTarget * 7,
    protein: macrosTargets.protein * 7,
    carbs: macrosTargets.carbs * 7,
    fat: macrosTargets.fat * 7,
  };

  // Navigation semaine précédente/actuelle
  function handlePrevWeek() {
    const prevWeek = new Date(viewedWeek);
    prevWeek.setDate(prevWeek.getDate() - 7);
    setViewedWeek(prevWeek.toISOString().split("T")[0]);
  }
  function handleCurrentWeek() {
    setViewedWeek(currentWeek);
  }
  const isCurrentWeek = viewedWeek === currentWeek;

  // Fonction pour formater la date de la semaine
  function formatWeekDate(dateString) {
    const date = new Date(dateString);
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);

    const formatDate = (d) => {
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}`;
    };

    return `${formatDate(date)} - ${formatDate(endDate)}`;
  }

  return (
    <section className="mb-24">
      <h2 className="text-xl font-bold mb-1">Historique hebdomadaire</h2>
      <p className="text-gray-500 text-sm mb-8">
        Visualise l'évolution de ta consommation de calories et de
        macronutriments sur la semaine.
        <br />
        Compare tes apports réels à tes objectifs pour progresser chaque semaine
        !
      </p>
      <div
        ref={chartRef}
        style={{
          width: "100%",
          maxWidth: 1100,
          height: 520,
          margin: "0 auto",
          position: "relative",
        }}
      >
        {/* Header du graphique : boutons Calories/Macros à gauche, date à droite */}
        <div
          className="flex items-center justify-between w-full"
          style={{ position: "relative", zIndex: 2 }}
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
          <span className="font-semibold text-base flex items-center gap-2 text-gray-700">
            {formatWeekDate(viewedWeek)}
          </span>
        </div>
        {/* Bouton semaine précédente à gauche, verticalement centré */}
        {isCurrentWeek && (
          <button
            onClick={handlePrevWeek}
            className="absolute -left-16 top-1/2 -translate-y-1/2 border-2 border-gray-900 text-gray-900 rounded-full p-2 shadow"
            style={{ zIndex: 2 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {/* Bouton semaine actuelle à droite, verticalement centré */}
        {!isCurrentWeek && (
          <button
            onClick={handleCurrentWeek}
            className="absolute -right-16 top-1/2 -translate-y-1/2 border-2 border-gray-900 text-gray-900 rounded-full p-2 shadow"
            style={{ zIndex: 2 }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
        <div
          style={{
            width: "100%",
            height: 420,
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
        {/* Totaux hebdomadaires */}
        {!isEmpty &&
          (mode === "calories" ? (
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center text-base">
            <div
              className="bg-orange-50 border border-orange-200 rounded-xl px-6 py-3 flex flex-col items-center min-w-[180px] tooltip"
              data-tip={`${Math.round(
                (weekTotals.calories / weekGoals.calories) * 100
              )}%`}
            >
              <span className="font-bold text-orange-600 text-lg">
                Calories
              </span>
              <span className="text-xl font-bold text-orange-700">
                {weekTotals.calories} / {weekGoals.calories} kcal
              </span>
              <span className="text-xs text-gray-500">
                Total consommé / Objectif hebdo
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center items-center text-base">
            <div
              className="bg-green-50 border border-green-200 rounded-xl px-6 py-3 flex flex-col items-center min-w-[180px] tooltip"
              data-tip={`${Math.round(
                (weekTotals.protein / weekGoals.protein) * 100
              )}%`}
            >
              <span className="font-bold text-green-600 text-md">
                Protéines
              </span>
              <span className="text-xl font-bold text-green-700">
                {weekTotals.protein} / {weekGoals.protein} g
              </span>
              <span className="text-xs text-gray-500">
                Total consommé / Objectif hebdo
              </span>
            </div>
            <div
              className="bg-yellow-50 border border-yellow-200 rounded-xl px-6 py-3 flex flex-col items-center min-w-[180px] tooltip"
              data-tip={`${Math.round(
                (weekTotals.carbs / weekGoals.carbs) * 100
              )}%`}
            >
              <span className="font-bold text-yellow-600 text-md">
                Glucides
              </span>
              <span className="text-xl font-bold text-yellow-700">
                {weekTotals.carbs} / {weekGoals.carbs} g
              </span>
              <span className="text-xs text-gray-500">
                Total consommé / Objectif hebdo
              </span>
            </div>
            <div
              className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 flex flex-col items-center min-w-[180px] tooltip"
              data-tip={`${Math.round(
                (weekTotals.fat / weekGoals.fat) * 100
              )}%`}
            >
              <span className="font-bold text-blue-600 text-md">Lipides</span>
              <span className="text-xl font-bold text-blue-700">
                {weekTotals.fat} / {weekGoals.fat} g
              </span>
              <span className="text-xs text-gray-500">
                Total consommé / Objectif hebdo
              </span>
            </div>
          </div>
          ))}
      </div>
    </section>
  );
}
