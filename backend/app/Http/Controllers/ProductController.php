<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Get all products for authenticated user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Retrieve only products belonging to the authenticated user
        $products = Product::where('user_id', $user->id)->get();
        
        return response()->json([
            'products' => $products,
            'status' => 'success'
        ]);
    }

    /**
     * Store a newly created product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
        ]);

        // Associate product with authenticated user
        $product = new Product($validatedData);
        $product->user_id = $request->user()->id;
        $product->save();

        return response()->json([
            'product' => $product,
            'message' => 'Product created successfully',
            'status' => 'success'
        ], 201);
    }

    /**
     * Display the specified product.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Check if the authenticated user owns this product
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized access to this product',
                'status' => 'error'
            ], 403);
        }

        return response()->json([
            'product' => $product,
            'status' => 'success'
        ]);
    }

    /**
     * Update the specified product.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Check if the authenticated user owns this product
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to update this product',
                'status' => 'error'
            ], 403);
        }

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
        ]);

        $product->update($validatedData);

        return response()->json([
            'product' => $product,
            'message' => 'Product updated successfully',
            'status' => 'success'
        ]);
    }

    /**
     * Remove the specified product.
     *
     * @param  int  $id
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        // Check if the authenticated user owns this product
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Unauthorized to delete this product',
                'status' => 'error'
            ], 403);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
            'status' => 'success'
        ]);
    }
}