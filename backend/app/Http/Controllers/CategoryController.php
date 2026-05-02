<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /**
     * GET /api/categories
     * Return all categories
     */
    public function index()
    {
        $categories = Category::orderBy('id', 'desc')->get();
        return response()->json($categories);
    }

    /**
     * POST /api/categories
     * Create a new category
     */
    public function store(Request $request)
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name',
        ]);

        $category = Category::create([
            'category_name' => $request->category_name,
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'data'    => $category,
        ], 201);
    }

    /**
     * GET /api/categories/{id}
     * Return a single category
     */
    public function show(Category $category)
    {
        return response()->json($category);
    }

    /**
     * PUT /api/categories/{id}
     * Update an existing category
     */
    public function update(Request $request, Category $category)
    {
        $request->validate([
            'category_name' => 'required|string|max:255|unique:categories,category_name,' . $category->id,
        ]);

        $category->update([
            'category_name' => $request->category_name,
        ]);

        return response()->json([
            'message' => 'Category updated successfully',
            'data'    => $category,
        ]);
    }

    /**
     * DELETE /api/categories/{id}
     * Delete a category
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}
