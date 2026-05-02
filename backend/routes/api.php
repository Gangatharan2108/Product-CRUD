<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\SubcategoryController;
use App\Http\Controllers\ProductController;

// ── Category Routes ──────────────────────────────────────────
Route::apiResource('categories', CategoryController::class);

// ── Subcategory Routes ───────────────────────────────────────
Route::apiResource('subcategories', SubcategoryController::class);
Route::get('categories/{category}/subcategories', [SubcategoryController::class, 'byCategory']);

// ── Product Routes ───────────────────────────────────────────
Route::apiResource('products', ProductController::class);
