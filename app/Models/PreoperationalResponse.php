<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PreoperationalResponse extends Model
{
    protected $fillable = ['inspection_id', 'item_id', 'value', 'note'];

    public function inspection(): BelongsTo
    {
        return $this->belongsTo(PreoperationalInspection::class, 'inspection_id');
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(PreoperationalItem::class, 'item_id');
    }
}
