<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UpdateUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  \App\Models\User  $user
     * @param  array  $input
     * @return void
     */
    public function update(User $user, array $input)
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:255'],
        ])->validate();

        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => isset($input['password']) ? Hash::make($input['password']) : $user->password,
            'phone' => $input['phone'] ?? $user->phone ?? '0000000000',
        ])->save();
    }
}