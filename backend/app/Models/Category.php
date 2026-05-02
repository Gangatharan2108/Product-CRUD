<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['category_name'];

    // One category has many subcategories
    public function subcategories()
    {
        return $this->hasMany(Subcategory::class);
    }

    // One category has many products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
