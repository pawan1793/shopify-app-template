<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $user = User::where('email', $request->email)->first();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json(['token' => $token, 'message' => 'Authentication successful']);
        }

        return response()->json(['message' => 'Invalid Login credentials'], 401);
    }

    public function products(Request $request)
    {
        // Check if the user is authenticated using Sanctum
        if ($request->user()) {
            $products = [
                ['id' => 1, 'name' => 'Product 1'],
                ['id' => 2, 'name' => 'Product 2'],
            ];

            return response()->json(['products' => $products]);
        }
        
        // User not authenticated
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}