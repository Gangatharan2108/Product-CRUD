<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * GET /api/products
     */
    public function index()
    {
        $products = Product::with(['category', 'subcategory'])
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($products);
    }

    /**
     * POST /api/products
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_name'   => 'required|string|max:255',
            'product_code'   => 'required|string|max:100|unique:products,product_code',
            'category_id'    => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand'          => 'required|string|max:255',
            'mrp'            => 'required|numeric|min:0',
            'price'          => 'required|numeric|min:0|lte:mrp',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only([
            'product_name', 'product_code', 'category_id',
            'subcategory_id', 'brand', 'mrp', 'price',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product = Product::create($data);

        return response()->json([
            'message' => 'Product created successfully',
            'data'    => $product->load(['category', 'subcategory']),
        ], 201);
    }

    /**
     * GET /api/products/{id}
     */
    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'subcategory']));
    }

    /**
     * POST /api/products/{id} (use POST with _method=PUT for file uploads)
     */
    public function update(Request $request, Product $product)
    {
        $request->validate([
            'product_name'   => 'required|string|max:255',
            'product_code'   => 'required|string|max:100|unique:products,product_code,' . $product->id,
            'category_id'    => 'required|exists:categories,id',
            'subcategory_id' => 'required|exists:subcategories,id',
            'brand'          => 'required|string|max:255',
            'mrp'            => 'required|numeric|min:0',
            'price'          => 'required|numeric|min:0|lte:mrp',
            'image'          => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only([
            'product_name', 'product_code', 'category_id',
            'subcategory_id', 'brand', 'mrp', 'price',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image) {
                Storage::disk('public')->delete($product->image);
            }
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return response()->json([
            'message' => 'Product updated successfully',
            'data'    => $product->load(['category', 'subcategory']),
        ]);
    }

    /**
     * DELETE /api/products/{id}
     */
    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
