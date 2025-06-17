import { Flame, Dumbbell, Wheat, Droplet } from "lucide-react";

const goals = [
  {
    label: "Calories",
    key: "calories",
    icon: <Flame className="w-7 h-7 text-orange-500" />,
    circle: "bg-orange-100",
    unit: "kcal",
    pill: "bg-orange-50 border-orange-100",
  },
  {
    label: "Protéines",
    key: "protein",
    icon: <Dumbbell className="w-7 h-7 text-green-500" />,
    circle: "bg-green-100",
    unit: "g",
    pill: "bg-green-50 border-green-100",
  },
  {
    label: "Glucides",
    key: "carbs",
    icon: <Wheat className="w-7 h-7 text-yellow-500" />,
    circle: "bg-yellow-100",
    unit: "g",
    pill: "bg-yellow-50 border-yellow-100",
  },
  {
    label: "Lipides",
    key: "fat",
    icon: <Droplet className="w-7 h-7 text-blue-500" />,
    circle: "bg-blue-100",
    unit: "g",
    pill: "bg-blue-50 border-blue-100",
  },
];

export default function GoalCards({ tdee = {} }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold mb-1">Objectifs journaliers</h2>
      <p className="text-gray-500 text-sm mb-4">
        Voici la quantité recommandée à consommer chaque jour pour atteindre ton objectif.
      </p>
      <div className="flex flex-col gap-4 md:flex-row">
        {goals.map((goal) => (
          <div
            key={goal.key}
            className={`
              flex-1 flex items-center
              rounded-full border ${goal.pill}
              px-5 py-4 min-w-[220px] shadow-sm
              transition-all duration-200 hover:shadow-md
            `}
          >
            <div className={`mr-4 flex items-center justify-center w-11 h-11 rounded-full ${goal.circle}`}>
              {goal.icon}
            </div>
            <div className="flex-1 flex flex-col items-start">
              <div className="text-2xl font-bold text-gray-800 flex items-baseline">
                {tdee[goal.key] !== undefined && tdee[goal.key] !== null
                  ? tdee[goal.key]
                  : <span className="text-gray-300 animate-pulse">--</span>}
                <span className="ml-1 text-base font-medium text-gray-500">{goal.unit}</span>
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{goal.label}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}