<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class VehicleCost extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'vehicle_id', 'registered_by', 'maintenance_id', 'category',
        'description', 'amount', 'date', 'invoice_ref',
    ];

    protected $casts = [
        'date'   => 'date',
        'amount' => 'decimal:2',
    ];

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function registeredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'registered_by');
    }

    public function maintenance(): BelongsTo
    {
        return $this->belongsTo(Maintenance::class);
    }

    public static function categoryLabel(string $category): string
    {
        return match ($category) {
            'maintenance' => 'Mantenimiento',
            'fuel'        => 'Combustible',
            'materials'   => 'Materiales/Repuestos',
            'insurance'   => 'Seguros',
            'taxes'       => 'Impuestos/Peajes',
            'tolls'       => 'Peajes',
            'other'       => 'Otros',
            default       => $category,
        };
    }
}
