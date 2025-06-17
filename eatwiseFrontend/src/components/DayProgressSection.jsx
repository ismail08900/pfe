import { useEffect, useState } from "react";
import api from "../api";
import ProgressRing from "./ProgressRing";

const RINGS = [
  {
    key: "calories",
    label: "Calories",
    color: ["#fb923c", "#f59e42"],
    unit: "kcal",
  },
  {
    key: "protein",
    label: "Protéines",
    color: ["#34d399", "#059669"],
    unit: "g",
  },
  {
    key: "carbs",
    label: "Glucides",
    color: ["#fde047", "#fbbf24"],
    unit: "g",
  },
  {
    key: "fat",
    label: "Lipides",
    color: ["#38bdf8", "#0ea5e9"],
    unit: "g",
  },
];

function getTodayKey() {
  const jours = [
    "dimanche",
    "lundi",
    "mardi",
    "mercredi",
    "jeudi",
    "vendredi",
    "samedi",
  ];
  return jours[new Date().getDay()];
}

export default function DayProgressSection({ goals = {} }) {
  const [consumed, setConsumed] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/planning/consumptions")
      .then((res) => {
        const todayKey = getTodayKey();
        const data = res.data.days?.[todayKey] ?? {};
        setConsumed({
          calories: data.calories || 0,
          protein: data.protein || 0,
          carbs: data.carbs || 0,
          fat: data.fat || 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-1">Consommation du jour</h2>
      <p className="text-gray-500 text-sm mb-8">
        Visualise ta progression sur chacun de tes apports principaux aujourd’hui.
      </p>
      <div className="flex flex-wrap justify-center gap-8">
        {RINGS.map((ring) => (
          <ProgressRing
            key={ring.key}
            value={loading ? 0 : consumed[ring.key]}
            max={goals[ring.key] ?? 1}
            label={ring.label}
            color={ring.color}
            unit={ring.unit}
          />
        ))}
      </div>
      {loading && (
        <div className="text-center text-gray-400 text-base mt-4">Chargement...</div>
      )}
    </section>
  );
}