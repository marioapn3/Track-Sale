<?php

namespace App\Modules\DashboardPermission\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DashboardPermission extends Model
{
    use HasFactory;

    protected $table = 'dashboard_permissions';

    protected $fillable = [
        //
    ];
}