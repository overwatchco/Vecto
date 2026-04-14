<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // admin → company_admin, employee → operator
        DB::table('users')->where('role', 'admin')->update(['role' => 'company_admin']);
        DB::table('users')->where('role', 'employee')->update(['role' => 'operator']);
    }

    public function down(): void
    {
        DB::table('users')->where('role', 'company_admin')->update(['role' => 'admin']);
        DB::table('users')->where('role', 'operator')->update(['role' => 'employee']);
    }
};
