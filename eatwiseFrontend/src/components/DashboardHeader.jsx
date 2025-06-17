import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, IconButton } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { useUser } from "../contexts/useUser";
import { Info } from "lucide-react";

function formatDelta(value) {
  const rounded = parseFloat(value).toFixed(2);
  if (Math.abs(rounded) < 1) {
    // Convertir en grammes si moins d'1 kg
    const grams = Math.round(Math.abs(rounded) * 1000);
    return value > 0 ? `+${grams} g` : `-${grams} g`;
  }
  return value > 0 ? `+${rounded}` : `${rounded}`;
}

function formatTimeToGoal(weeks) {
  if (!weeks || weeks <= 0) return null;

  const totalDays = Math.ceil(weeks * 7);
  const months = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;
  const remainingWeeks = Math.floor(remainingDays / 7);
  const finalDays = remainingDays % 7;

  let timeString = "";

  if (months > 0) {
    timeString += `${months} mois`;
  }

  if (remainingWeeks > 0) {
    if (timeString) timeString += " et ";
    timeString += `${remainingWeeks} semaine${remainingWeeks > 1 ? "s" : ""}`;
  }

  if (finalDays > 0) {
    if (timeString) timeString += " et ";
    timeString += `${finalDays} jour${finalDays > 1 ? "s" : ""}`;
  }

  return timeString;
}

const DashboardHeader = ({ tdee }) => {
  const { user } = useUser();
  const displayName = user?.first_name;
  const today = format(new Date(), "EEEE d MMMM yyyy", { locale: fr });

  const poidsActuel = user?.weight;
  const poidsObjectif = user?.weight_target || null;
  const calorieTarget = tdee?.calories;
  const maintenanceCalories = tdee?.maintenance_calories;

  let objectifType = "perte";
  if (tdee?.goal_name) {
    if (tdee.goal_name.toLowerCase().includes("muscle"))
      objectifType = "muscle";
    else if (
      tdee.goal_name.toLowerCase().includes("gain") ||
      tdee.goal_name.toLowerCase().includes("prise")
    )
      objectifType = "prise";
    else objectifType = "perte";
  } else if (poidsObjectif && poidsActuel) {
    if (poidsObjectif < poidsActuel) objectifType = "perte";
    else if (poidsObjectif > poidsActuel) objectifType = "prise";
  }

  let motivationMessage = null;

  if (calorieTarget && maintenanceCalories && poidsActuel) {
    const calorieDiff = calorieTarget - maintenanceCalories;
    const weeklyKiloChange = (calorieDiff * 7) / 7700;
    const monthlyKiloChange = (calorieDiff * 30) / 7700;

    if (!poidsObjectif) {
      if (objectifType === "muscle") {
        if (weeklyKiloChange > 0) {
          motivationMessage = `Si vous suivez ce programme, vous pouvez gagner environ ${formatDelta(
            monthlyKiloChange / 2
          )} de muscle ce mois-ci.`;
        } else {
          motivationMessage =
            "Votre apport calorique est insuffisant pour gagner du muscle. Augmentez vos calories pour un objectif prise de muscle.";
        }
      } else if (objectifType === "prise") {
        if (weeklyKiloChange > 0) {
          motivationMessage = `Si vous suivez ce programme, vous pouvez prendre environ ${formatDelta(
            weeklyKiloChange
          )} par semaine et environ ${formatDelta(
            monthlyKiloChange
          )} par mois.`;
        } else {
          motivationMessage =
            "Votre apport calorique est insuffisant pour une prise de poids. Augmentez vos calories pour un objectif prise de poids.";
        }
      } else {
        if (weeklyKiloChange < 0) {
          motivationMessage = `Si vous suivez ce programme, vous pouvez perdre environ ${formatDelta(
            Math.abs(weeklyKiloChange)
          )} par semaine et environ ${formatDelta(
            Math.abs(monthlyKiloChange)
          )} par mois.`;
        } else {
          motivationMessage =
            "Votre apport calorique est trop élevé pour une perte de poids. Diminuez vos calories pour un objectif perte de poids.";
        }
      }
    } else {
      const delta = poidsObjectif - poidsActuel;

      if (objectifType === "muscle" && delta > 0) {
        const displayedChange =
          weeklyKiloChange > 0 ? weeklyKiloChange / 2 : null;
        const weeksToGoal = displayedChange ? delta / displayedChange : null;

        if (!displayedChange) {
          motivationMessage =
            "Votre apport calorique est insuffisant pour gagner du muscle. Augmentez vos calories pour un objectif prise de muscle.";
        } else {
          motivationMessage = `Si vous suivez ce programme, vous pouvez gagner environ ${formatDelta(
            displayedChange
          )} de muscle par semaine.${
            weeksToGoal && weeksToGoal > 0
              ? ` À ce rythme, vous atteindrez votre objectif de ${poidsObjectif} kg dans environ ${formatTimeToGoal(
                  weeksToGoal
                )}.`
              : ""
          }`;
        }
      } else if (objectifType === "prise" && delta > 0) {
        const weeksToGoal =
          weeklyKiloChange > 0 ? delta / weeklyKiloChange : null;

        if (!weeklyKiloChange || weeklyKiloChange <= 0) {
          motivationMessage =
            "Votre apport calorique est insuffisant pour une prise de poids. Augmentez vos calories pour un objectif prise de poids.";
        } else {
          motivationMessage = `Si vous suivez ce programme, vous pouvez prendre environ ${formatDelta(
            weeklyKiloChange
          )} par semaine.${
            weeksToGoal && weeksToGoal > 0
              ? ` À ce rythme, vous atteindrez votre objectif de ${poidsObjectif} kg dans environ ${formatTimeToGoal(
                  weeksToGoal
                )}.`
              : ""
          }`;
        }
      } else if (objectifType === "perte" && delta < 0) {
        const weeksToGoal =
          weeklyKiloChange < 0 ? Math.abs(delta / weeklyKiloChange) : null;

        if (!weeklyKiloChange || weeklyKiloChange >= 0) {
          motivationMessage =
            "Votre apport calorique est trop élevé pour une perte de poids. Diminuez vos calories pour un objectif perte de poids.";
        } else {
          motivationMessage = `Si vous suivez ce programme, vous pouvez perdre environ ${formatDelta(
            Math.abs(weeklyKiloChange)
          )} par semaine.${
            weeksToGoal && weeksToGoal > 0
              ? ` À ce rythme, vous atteindrez votre objectif de ${poidsObjectif} kg dans environ ${formatTimeToGoal(
                  weeksToGoal
                )}.`
              : ""
          }`;
        }
      }
    }
  }

  return (
    <header className="w-full">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4 mb-5">
        <div>
          <div className="flex items-center flex-wrap space-x-2">
            <span className="text-2xl font-semibold text-gray-900">
              Bonjour, {displayName}
            </span>
            <span className="hidden md:inline text-gray-400 text-base">|</span>
            <span className="text-gray-500 text-base">
              {today.charAt(0).toUpperCase() + today.slice(1)}
            </span>
          </div>
        </div>
      </div>
      {motivationMessage && (
        
          <div className="flex">
            <Info/>
            <p className="text-gray-700 ml-2 mb-5  font-medium">
              {motivationMessage}
            </p>
          </div>
        
      )}
    </header>
  );
};

export default DashboardHeader;
