<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Create products table if not exists (first time setup)
        if (!Schema::hasTable('products')) {
            Schema::create('products', function (Blueprint $table) {
                $table->id();
                $table->string('product_name');
                $table->string('product_code')->unique();
                $table->foreignId('category_id')->constrained()->onDelete('cascade');
                $table->foreignId('subcategory_id')->constrained()->onDelete('cascade');
                $table->string('brand');
                $table->decimal('mrp', 10, 2);
                $table->decimal('price', 10, 2);
                $table->string('image')->nullable();
                $table->timestamps();
            });
        } else {
            // Add image column if products table already exists
            if (!Schema::hasColumn('products', 'image')) {
                Schema::table('products', function (Blueprint $table) {
                    $table->string('image')->nullable()->after('price');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('products', 'image')) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropColumn('image');
            });
        }
    }
};
