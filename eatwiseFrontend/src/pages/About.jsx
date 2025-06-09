import { ArrowRight, BookOpen, User, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/useUser";

const About = () => {
  const { token } = useUser();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="pb-16 pt-36 bg-[#F4FFF7]">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 underline">
              À propos de EatWise
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Votre partenaire pour une nutrition personnalisée et équilibrée
            </p>
          </div>
        </div>
      </div>
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Qui sommes nous ?
            </h2>
            <p className="text-gray-700 mb-4">
              EatWise est une plateforme innovante qui vous aide à trouver des
              repas équilibrés et des restaurants adaptés à votre profil
              nutritionnel. Notre mission est de rendre l’alimentation saine
              accessible à tous, sans compromis sur le goût ou le plaisir de
              manger.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className=" mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Notre Mission
              </h2>
              <p className="text-gray-700 mb-4">
                Chez EatWise, notre mission est de rendre la nutrition
                personnalisée accessible à tous. Nous croyons que chaque
                personne mérite un accompagnement nutritionnel personnalisé.
                C’est pourquoi EatWise propose des recommandations de repas et
                de restaurants basées sur vos besoins, préférences et objectifs
                santé.
              </p>
              <p className="text-gray-700 mb-6">
                Grâce à notre technologie intelligente, EatWise analyse votre
                profil nutritionnel complet afin de vous proposer des repas
                parfaitement alignés avec vos objectifs de santé, vos
                éventuelles allergies, vos préférences alimentaires et votre
                mode de vie.
              </p>
              <Link to="/learnmore">
                <button className="btn text-white text-md rounded-xl bg-green-600 hover:bg-[#2E7D32] pb-1">
                  En savoir plus
                  <ArrowRight size={16} className="ml-2 mt-1" />
                </button>
              </Link>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="public\photo-1498837167922-ddd27525d352.jpg"
                  alt="Équipe EatWise"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
            Nos Valeurs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl text-center shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-16 h-16 rounded-full  flex items-center justify-center mx-auto mb-4">
                <BookOpen className="text-[#4CAF50]" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expertise</h3>
              <p className="text-gray-600">
                Nos recommandations sont basées sur les dernières recherches
                scientifiques en nutrition et diététique.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-16 h-16 rounded-full  flex items-center justify-center mx-auto mb-4">
                <User className="text-[#4CAF50]" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Personnalisation</h3>
              <p className="text-gray-600">
                Chaque personne est unique. Nos recommandations sont adaptées à
                votre profil individuel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl text-center shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-16 h-16 rounded-full  flex items-center justify-center mx-auto mb-4">
                <Users className="text-[#4CAF50]" size={30} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibilité</h3>
              <p className="text-gray-600">
                Nous rendons la nutrition personnalisée accessible à tous, peu
                importe votre niveau de connaissances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Vision d'avenir
            </h2>
            <p className="text-gray-700 mb-4">
              Chez EatWise, nous ne nous arrêtons pas à ce qui est possible
              aujourd’hui. Notre ambition est d’évoluer constamment pour mieux
              accompagner nos utilisateurs dans leur parcours nutritionnel. Dans
              un avenir proche, nous prévoyons d’intégrer une application mobile
              intuitive, un chatbot intelligent, ainsi qu’un tableau de bord
              statistique interactif permettant aux utilisateurs de suivre
              l’évolution de leurs habitudes alimentaires, leurs progrès vers
              leurs objectifs santé, et leurs apports nutritionnels au fil du
              temps.
            </p>
            <p className="text-gray-700 mb-4">
              Nous souhaitons également renforcer nos partenariats avec des
              nutritionnistes certifiés et intégrer encore plus de restaurants
              partenaires pour une expérience personnalisée, intelligente et
              complète.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Prêt à découvrir votre plan nutritionnel personnalisé ?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez EatWise aujourd'hui et commencez votre voyage vers une
            alimentation parfaitement adaptée à vos besoins.
          </p>
          <Link
            to={!token ? "/register" : "/home"}
            className="btn bg-white text-green-600 hover:bg-gray-100 text-md rounded-xl"
          >
            {!token ? "Commencer maintenant" : "Consulter Mon profil"}

            <ArrowRight size={16} className="ml-2 mt-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-600">© 2025 EatWise. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;
