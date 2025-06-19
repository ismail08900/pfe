import {
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Leaf,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useUser } from "../contexts/useUser";
import { Link } from "react-router-dom";

const LearnMore = () => {
  const { token } = useUser();
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#F4FFF7] pb-16 pt-36">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 underline">
              En Savoir Plus
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Découvrez comment EatWise révolutionne l'approche de la nutrition
              personnalisée
            </p>
          </div>
        </div>
      </div>

      {/* Our Approach Section */}
      <section className="py-16 bg-white">
        <div className="mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Notre Approche
              </h2>
              <p className="text-gray-700 mb-4">
                EatWise utilise une technologie avancée pour analyser votre
                profil nutritionnel unique et vous proposer des recommandations
                alimentaires personnalisées.
              </p>
              <p className="text-gray-700 mb-6">
                Notre algorithme prend en compte vos objectifs de santé, vos
                allergies, vos préférences alimentaires, et même votre mode de
                vie pour créer un plan nutritionnel sur mesure qui vous convient
                parfaitement.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#4CAF50] mr-3 h-5 w-5 mt-0.5" />
                  <p className="text-gray-700">
                    Analyse complète de vos besoins nutritionnels
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#4CAF50] mr-3 h-5 w-5 mt-0.5" />
                  <p className="text-gray-700">
                    Recommandations basées sur des données scientifiques
                  </p>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="text-[#4CAF50] mr-3 h-5 w-5 mt-0.5" />
                  <p className="text-gray-700">
                    Ajustements continus selon vos progrès
                  </p>
                </div>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src="public\brooke-lark-HlNcigvUi4Q-unsplash.jpg"
                  alt="Équipe EatWise"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Comment Ça Fonctionne
            </h2>
            <p className="text-gray-700">
              Un processus simple en quatre étapes pour obtenir vos
              recommandations nutritionnelles personnalisées
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="font-bold text-[#4CAF50]">1</span>
              </div>
              <h3 className="text-2xl font-[650] mb-2">Créez votre profil</h3>
              <p className="text-gray-600">
                Renseignez vos informations personnelles, vos objectifs et vos
                préférences alimentaires.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#4CAF50] font-bold">2</span>
              </div>
              <h3 className="text-2xl font-[650] mb-2">Analyse</h3>
              <p className="text-gray-600">
                Notre algorithme analyse votre profil et identifie vos besoins
                nutritionnels spécifiques.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#4CAF50] font-bold">3</span>
              </div>
              <h3 className="text-2xl font-[650] mb-2">Recommandations</h3>
              <p className="text-gray-600">
                Recevez des recommandations de repas personnalisées adaptées à
                vos besoins.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="bg-[#4CAF50]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <span className="text-[#4CAF50] font-bold">4</span>
              </div>
              <h3 className="text-2xl font-[650] mb-2">Suivi et ajustement</h3>
              <p className="text-gray-600">
                Suivez vos progrès et recevez des ajustements en fonction de vos
                résultats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Les Avantages de EatWise
            </h2>
            <p className="text-gray-700">
              Pourquoi choisir notre approche de la nutrition personnalisée
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-[#4CAF50]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Précision</h3>
              <p className="text-gray-700">
                Des recommandations nutritionnelles précises basées sur votre
                profil individuel.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mb-4">
                <Leaf className="h-8 w-8 text-[#4CAF50]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Équilibre</h3>
              <p className="text-gray-700">
                Un régime alimentaire équilibré qui répond à tous vos besoins
                nutritionnels.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#4CAF50]/20 flex items-center justify-center mb-4">
                <ShieldCheck className="h-8 w-8 text-[#4CAF50]" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sécurité</h3>
              <p className="text-gray-700">
                Des recommandations qui tiennent compte de vos allergies et
                restrictions alimentaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
              Questions Fréquentes
            </h2>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-[#4CAF50] mr-3" />
                  <h1 className="text-lg font-bold">
                    Comment EatWise détermine-t-il mes besoins nutritionnels?
                  </h1>
                </div>

                <p className="text-gray-700 mt-4">
                  Notre algorithme analyse plusieurs facteurs comme votre âge,
                  votre sexe, votre poids, votre taille, votre niveau d'activité
                  physique, vos objectifs de santé et vos restrictions
                  alimentaires pour déterminer vos besoins nutritionnels précis.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-[#4CAF50] mr-3" />
                  <h1 className="text-lg font-bold">
                    Les recommandations sont-elles validées par des
                    professionnels?
                  </h1>
                </div>

                <p className="text-gray-700 mt-4">
                  Oui, toutes nos recommandations nutritionnelles sont basées
                  sur des recherches scientifiques et sont validées par une
                  équipe de nutritionnistes professionnels avant d'être
                  proposées aux utilisateurs.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center">
                  <HelpCircle className="h-5 w-5 text-[#4CAF50] mr-3" />
                  <h1 className="text-lg font-bold">
                    Puis-je modifier mon profil après l'avoir créé?
                  </h1>
                </div>

                <p className="text-gray-700 mt-4">
                  Absolument! Vous pouvez modifier votre profil à tout moment
                  pour refléter les changements dans vos objectifs, vos
                  préférences ou votre situation personnelle. Vos
                  recommandations seront automatiquement ajustées en
                  conséquence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Commencez votre parcours nutritionnel personnalisé
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers d'utilisateurs qui ont déjà transformé leur
            alimentation et leur santé grâce à EatWise.
          </p>

          <Link
            to={!token ? "/register" : "/dashboard"}
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

export default LearnMore;
