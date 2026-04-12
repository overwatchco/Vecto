<?php

namespace App\Http\Requests;

use App\Enums\UserRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $userId = $this->route('user')?->id;

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', "unique:users,email,{$userId}"],
            'role'     => ['required', new Enum(UserRole::class)],
            'phone'    => ['nullable', 'string', 'max:30'],
            'position' => ['nullable', 'string', 'max:100'],
            'password' => ['nullable', 'confirmed', Password::defaults()],
        ];
    }

    public function attributes(): array
    {
        return [
            'name'     => 'nombre',
            'email'    => 'correo electrónico',
            'role'     => 'rol',
            'phone'    => 'teléfono',
            'position' => 'cargo',
            'password' => 'contraseña',
        ];
    }
}
