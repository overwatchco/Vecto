<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\Company;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'company_name' => ['required', 'string', 'max:255'],
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
        ], [], [
            'company_name' => 'nombre de empresa',
        ])->validate();

        $company = Company::create([
            'name' => $input['company_name'],
        ]);

        return User::create([
            'company_id' => $company->id,
            'name'       => $input['name'],
            'email'      => $input['email'],
            'password'   => $input['password'],
            'role'       => 'admin',
        ]);
    }
}
