import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowRight, ScrollText, Utensils } from "lucide-react";
import { useUser } from "../contexts/useUser";
import "/src/App.css";

export default function Welcome() {
  const { token } = useUser();
  return (
    <div>
      <div className="bg-[#F4FFF7] mt-5 text-black py-16 md:pt-28">
        <div className="px-6">
          <div className="flex flex-col md:flex-row items-center ">
            <div className="md:w-1/2 mb-10 md:mb-0 animate-slide-up opacity-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Découvrez des repas adaptés à&nbsp;
                <span className="text-green-600">
                  votre profil nutritionnel
                </span>
              </h1>
              <p className="text-lg mb-8 opacity-90 max-w-md">
                Obtenez des suggestions de repas équilibrés et trouvez des
                restaurants à proximité compatibles avec vos objectifs
                nutritionnels et vos préférences alimentaires.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                {!token && (
                  <Link
                    to="/register"
                    className="btn text-white text-lg rounded-xl bg-green-600 hover:bg-[#2E7D32] pb-1"
                  >
                    Commencer maintenant
                    <ArrowRight size={16} className="mt-1 ml-2" />
                  </Link>
                )}
                <Link to="/learnmore">
                  <button className="btn btn-outline text-black text-lg rounded-xl pb-1">
                    En savoir plus
                  </button>
                </Link>
              </div>
            </div>

            <div className="md:w-1/2 flex justify-center animate-slide-down opacity-0">
              <div className="relative">
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <img
                  src="public\irina-del-uJQYVRza0VY-unsplash.jpg"
                  alt="Healthy meal"
                  className="w-full max-w-lg rounded-xl shadow-2xl relative z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça fonctionne</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              EatWise analyse votre profil nutritionnel pour vous proposer des
              repas parfaitement adaptés à vos besoins et préférences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="bg-green-200 w-12 h-12 rounded-full  flex items-center justify-center mx-auto mb-4">
                <ScrollText className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Créez votre profil</h3>
              <p className="text-gray-600">
                Renseignez vos préférences alimentaires,allergies et objectifs
                nutritionnels.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="bg-orange-200 w-12 h-12 rounded-full  flex items-center justify-center mx-auto mb-4">
                <Utensils className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Recevez des suggestions
              </h3>
              <p className="text-gray-600">
                Notre algorithme analyse votre profil et vous propose des repas
                et des restaurants parfaitement adaptés.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl text-center">
              <div className="bg-blue-200 w-12 h-12 rounded-full  flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Cuisinez et savourez
              </h3>
              <p className="text-gray-600">
                Accédez aux recettes détaillées et découvrez des repas délicieux
                et adaptés à vos besoins.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-green-600 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à améliorer votre alimentation ?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Créez votre compte gratuitement et recevez chaque jour des
            suggestions de repas et de restaurants parfaitement adaptés à votre
            profil nutritionnel, vos préférences alimentaires et vos objectifs
            santé.
          </p>
          <Link to={!token?"/register":"/home"} className=" btn bg-white text-green-600 text-lg rounded-xl hover:bg-gray-100  px-8 pt-6 pb-7">
           {!token? "Commencer maintenant":"Consulter Mon profil"}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
