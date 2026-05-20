import {Utensils} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mb-6 md:mb-0">
            <div className="flex items-center space-x-2">
              <Utensils className="text-gray-800" size={22}/>
              <span className="font-bold text-xl text-gray-800 -mb-1">EatWise</span>
            </div>
            <p className="text-gray-600 mt-2 max-w-md">
              Des recommandations de repas personnalisées adaptées à votre
              profil nutritionnel.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Accueil
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Comment ça marche
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Conseils
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Société</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    À propos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Équipe
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Légal</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-green-600"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row md:justify-between">
          <p className="text-gray-600 text-sm">
            &copy; 2026 EatWise. Tous droits réservés.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-600 hover:text-green-600">
              Facebook
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              Twitter
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              Instagram
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
