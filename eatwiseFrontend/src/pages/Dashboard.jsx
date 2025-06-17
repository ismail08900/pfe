import { useEffect, useState } from "react";
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
    <div className="mx-auto mt-14 bg-gray-50 px-4 py-6">
      <DashboardHeader tdee={tdee} />
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
      

      {/* ...autres sections */}
    </div>
  );
}
