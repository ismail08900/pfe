<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    //
    public function myAllergies(Request $request)
    {
        // Récupère l'utilisateur connecté
        $user = $request->user(); // ou auth()->user();

        // Récupère ses allergies via la relation
        $allergies = $user->allergies()->get();

        // Retourne en JSON
        return response()->json([
            'allergies' => $allergies
        ]);
    }

    public function updateProfile(Request $request)
    {

        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email,' . $user->id,
            'phone'      => 'nullable|string|max:30',
            'birth_date' => 'nullable|date',
            'height'     => 'nullable|integer',
            'weight'     => 'nullable|integer',
            'diet_type_id' => 'nullable|exists:diet_types,id',
            'allergy_ids' => 'nullable|array',
            'allergy_ids.*' => 'exists:allergies,id',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->first_name = $request->first_name;
        $user->last_name  = $request->last_name;
        $user->email      = $request->email;
        $user->phone      = $request->phone ?? null;
        $user->birth_date = $request->birth_date ?? null;
        $user->height     = $request->height ?? null;
        $user->weight     = $request->weight ?? null;
        $user->diet_type_id = $request->diet_type_id ?? null;
        $user->save();

        // Met à jour les allergies (array d'id)
        if ($request->has('allergy_ids')) {
            $user->allergies()->sync($request->allergy_ids);
        }

        // Recharge les relations pour le retour
        $user->load('allergies', 'dietType');

        return response()->json([
            'message' => 'Profil mis à jour',
            'user' => $user
        ]);
    }
}
