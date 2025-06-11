import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmailVerified() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-16">
      <div className="bg-white rounded-xl shadow-lg px-8 py-12 border-y-4 border-green-600 max-w-md w-full text-center">
        <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Votre email est vérifié !</h2>
        <p className="mb-4 text-gray-700">
          Félicitations, votre adresse email a bien été confirmée.
          <br />
          Vous pouvez maintenant vous connecter à votre compte.
        </p>
        <Link
          to="/login"
          className="w-full btn bg-green-600 hover:bg-[#2E7D32] text-white rounded-xl mt-4 font-semibold"
        >
          Se connecter
        </Link>
      </div>
    </div>
  );
}
