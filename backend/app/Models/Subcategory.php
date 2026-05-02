<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subcategory extends Model
{
    protected $fillable = ['subcategory_name', 'category_id'];

    // Belongs to a category
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // One subcategory has many products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
