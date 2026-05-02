<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;

class SubcategoryController extends Controller
{
    /**
     * GET /api/subcategories
     * Return all subcategories with their category
     */
    public function index()
    {
        $subcategories = Subcategory::with('category')
            ->orderBy('id', 'desc')
            ->get();

        return response()->json($subcategories);
    }

    /**
     * POST /api/subcategories
     * Create a new subcategory
     */
    public function store(Request $request)
    {
        $request->validate([
            'subcategory_name' => 'required|string|max:255',
            'category_id'      => 'required|exists:categories,id',
        ]);

        $subcategory = Subcategory::create([
            'subcategory_name' => $request->subcategory_name,
            'category_id'      => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Subcategory created successfully',
            'data'    => $subcategory->load('category'),
        ], 201);
    }

    /**
     * GET /api/subcategories/{id}
     * Return a single subcategory
     */
    public function show(Subcategory $subcategory)
    {
        return response()->json($subcategory->load('category'));
    }

    /**
     * PUT /api/subcategories/{id}
     * Update an existing subcategory
     */
    public function update(Request $request, Subcategory $subcategory)
    {
        $request->validate([
            'subcategory_name' => 'required|string|max:255',
            'category_id'      => 'required|exists:categories,id',
        ]);

        $subcategory->update([
            'subcategory_name' => $request->subcategory_name,
            'category_id'      => $request->category_id,
        ]);

        return response()->json([
            'message' => 'Subcategory updated successfully',
            'data'    => $subcategory->load('category'),
        ]);
    }

    /**
     * DELETE /api/subcategories/{id}
     * Delete a subcategory
     */
    public function destroy(Subcategory $subcategory)
    {
        $subcategory->delete();

        return response()->json([
            'message' => 'Subcategory deleted successfully',
        ]);
    }

    /**
     * GET /api/categories/{category}/subcategories
     * Get subcategories for a specific category (used in Product form dropdown)
     */
    public function byCategory(Category $category)
    {
        $subcategories = $category->subcategories()->orderBy('subcategory_name')->get();
        return response()->json($subcategories);
    }
}
