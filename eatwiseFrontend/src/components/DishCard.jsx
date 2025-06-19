import React from "react";
import { dietLabels, allergyLabels } from "../utils/labels";
import {
  Utensils,
  Flame,
  Egg,
  Droplet,
  Wheat,
  ShoppingCart,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function DishCard({ dish }) {

  const mapsUrl = dish.restaurant?.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        dish.restaurant.location
      )}`
    : "#";
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all hover:-translate-y-[0.30rem] duration-300 p-0 w-full max-w-xs flex flex-col border border-gray-100">
      <div className="relative h-44 w-full bg-gray-100 flex items-center justify-center">
        {dish.image ? (
          <img
            src={`${import.meta.env.VITE_STORAGE_URL || "/storage/"}${
              dish.image
            }`}
            alt={dish.name}
            className="object-cover w-full h-full rounded-t-2xl"
          />
        ) : (
          <Utensils className="text-gray-300" size={48} />
        )}
      </div>
      <div className="p-5 flex flex-col h-full flex-1">
        <h3 className="font-bold text-xl mb-1 truncate">{dish.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {dish.description}
        </p>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize">
            {dish.type}
          </span>
          {dish.diets.map((d) => (
            <span
              className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
              key={d.id}
            >
              {dietLabels[d.name] || d.name}
            </span>
          ))}
          {dish.allergies.map((a) => (
            <span
             className="bg-gray-100 rounded-lg px-2 py-0.5 text-xs font-semibold text-gray-700 capitalize"
              key={a.id}
            >
              {allergyLabels[a.name] || a.name}
            </span>
          ))}
        </div>
        <div className="flex items-center text-gray-500 text-sm mb-3 gap-4">
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4 text-red-500" /> {dish.calories} kcal
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs mb-2">
          <div>
            <div className="font-bold text-green-600 text-base">
              {dish.proteins}g
            </div>
            <div className="text-gray-500">Protéines</div>
          </div>
          <div>
            <div className="font-bold text-orange-500 text-base">
              {dish.carbs}g
            </div>
            <div className="text-gray-500">Glucides</div>
          </div>
          <div>
            <div className="font-bold text-blue-700 text-base">
              {dish.lipids}g
            </div>
            <div className="text-gray-500">Lipides</div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-green-700 font-bold text-lg">
            {dish.price} DH
          </span>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow transition"
            title="Commander (voir l'adresse sur Google Maps)"
          >
            <ShoppingCart size={16} /> Commander
          </a>
        </div>
        <div className="mt-3 text-xs text-gray-400">
          Restaurant : {dish.restaurant?.name || "-"}
        </div>
      </div>
    </div>
  );
}
