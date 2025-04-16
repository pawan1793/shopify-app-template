<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function authenticate(Request $request)
    {
        // Validate shop and id from Shopify session
        $request->validate([
            'shop' => 'required|string',
            'id' => 'required|string',
        ]);

        // Find or create a user based on the Shopify shop domain
        $user = User::firstOrCreate(
            ['email' => $request->shop], // Using shop as the unique identifier
            ['name' => $request->shop, 'password' => bcrypt($request->id)] // Use id as a password equivalent
        );

        $session = Session::where('shop', $request->shop)->first();
        if (!$session) {
            return response()->json(['message' => 'Session not found'], 404);
        }
        
        // Update access_token in User table
        $user->access_token = $session->accessToken;
        $user->save();

        // Create token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => 60 * 24 * 30, // 30 days in minutes
            'message' => 'Authentication successful'
        ]);
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

    public function user(Request $request)
    {
        // Check if the user is authenticated using Sanctum
        if ($user = $request->user()) {
            // Return authenticated user data
            return response()->json([
                'user' => $user,
                'message' => 'User data retrieved successfully'
            ]);
        }
        
        // User not authenticated
        return response()->json(['message' => 'Unauthorized'], 401);
    }
}