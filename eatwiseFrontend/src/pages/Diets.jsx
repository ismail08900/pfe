import {
  Leaf,
  Egg,
  Droplet,
  Fish,
  Drumstick,
  ShieldCheck,
  Salad,
  Smile,
  Wheat,
  CakeSlice,
  Milk,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const diets = [
  {
    name: "Pescétarien",
    icon: <Fish className="text-blue-600" size={32} />,
    description:
      "Le régime pescétarien exclut la viande rouge et la volaille mais inclut le poisson, les fruits de mer, les œufs et les produits laitiers. Il est apprécié pour ses bienfaits cardiovasculaires et sa richesse en oméga-3.",
  },
  {
    name: "Végétarien",
    icon: <Leaf className="text-green-600" size={32} />,
    description:
      "Le régime végétarien exclut toutes les viandes et poissons, mais inclut les œufs et les produits laitiers. Il favorise les légumes, céréales, légumineuses et fruits.",
  },
  {
    name: "Lacto-végétarien",
    icon: <Milk className="text-yellow-700" size={32} />,
    description:
      "Le régime lacto-végétarien exclut la viande, le poisson et les œufs, mais autorise les produits laitiers. Il est courant dans certaines cultures asiatiques.",
  },
  {
    name: "Ovo-végétarien",
    icon: <Egg className="text-orange-600" size={32} />,
    description:
      "Le régime ovo-végétarien exclut la viande, le poisson et les produits laitiers, mais inclut les œufs. Il permet ainsi d'apporter des protéines d'origine animale sans lactose.",
  },
  {
    name: "Végan",
    icon: <Salad className="text-green-500" size={32} />,
    description:
      "Le régime végan exclut tous les produits d'origine animale (viande, poisson, œufs, produits laitiers, miel). Il repose exclusivement sur des aliments végétaux.",
  },
  {
    name: "Cétogène (Keto)",
    icon: <Drumstick className="text-amber-700" size={32} />,
    description:
      "Le régime cétogène est très pauvre en glucides et riche en graisses. Il vise à induire la cétose, un état métabolique qui favorise la combustion des graisses comme source d'énergie principale.",
  },
  {
    name: "Sans gluten",
    icon: <Wheat className="text-yellow-500" size={32} />,
    description:
      "Le régime sans gluten exclut toutes les sources de gluten (blé, orge, seigle, etc.). Il est essentiel pour les personnes atteintes de la maladie cœliaque ou d'une sensibilité au gluten.",
  },
  {
    name: "Paléo",
    icon: <ShieldCheck className="text-brown-600" size={32} />,
    description:
      "Le régime paléo s'inspire de l'alimentation des chasseurs-cueilleurs : viande maigre, poisson, fruits, légumes, noix et graines. Il exclut les aliments transformés, céréales et produits laitiers.",
  },
  {
    name: "Primal",
    icon: <Smile className="text-green-700" size={32} />,
    description:
      "Le régime primal est proche du paléo mais tolère les produits laitiers crus et fermentés. Il favorise les aliments naturels, non transformés et riches en nutriments.",
  },
  {
    name: "Low FODMAP",
    icon: <CakeSlice className="text-orange-400" size={32} />,
    description:
      "Le régime Low FODMAP vise à réduire certains sucres fermentescibles responsables de troubles digestifs (ballonnements, douleurs, etc.). Il est recommandé pour les personnes souffrant du syndrome de l'intestin irritable.",
  },
  {
    name: "Whole30",
    icon: <Droplet className="text-blue-400" size={32} />,
    description:
      "Le régime Whole30 est un programme de 30 jours qui élimine sucre ajouté, céréales, produits laitiers, légumineuses et aliments transformés afin de réinitialiser les habitudes alimentaires et améliorer la santé générale.",
  },
];

export default function Diets() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#F4FFF7] pb-16 pt-36">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 underline">
              Les régimes alimentaires
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Découvrez les différents régimes alimentaires et trouvez celui qui
              correspond à vos besoins et à votre mode de vie.
            </p>
          </div>
        </div>
      </div>

      {/* Diets List */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {diets.slice(0, -2).map((diet) => (
              <div
                key={diet.name}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  {diet.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{diet.name}</h2>
                <p className="text-gray-700">{diet.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-8 mt-8">
            {diets.slice(-2).map((diet) => (
              <div
                key={diet.name}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center w-[calc(33.333%-1rem)]"
              >
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  {diet.icon}
                </div>
                <h2 className="text-2xl font-semibold mb-2">{diet.name}</h2>
                <p className="text-gray-700">{diet.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Prêt à découvrir un régime adapté à votre profil ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explorez nos suggestions de repas et trouvez des restaurants adaptés
            à votre régime alimentaire avec EatWise.
          </p>
          <Link
            to="/"
            className="btn bg-white text-green-600 hover:bg-gray-100 text-md rounded-xl"
          >
            Retour à l'accueil
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
