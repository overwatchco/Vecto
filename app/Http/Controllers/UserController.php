<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        abort_if(! auth()->user()->isAdmin(), 403);

        $query = auth()->user()->isSuperAdmin()
            ? User::orderBy('name')
            : User::where('company_id', auth()->user()->company_id)->orderBy('name');

        $users = $query->get()->map(fn (User $u) => [
            'id'         => $u->id,
            'name'       => $u->name,
            'email'      => $u->email,
            'phone'      => $u->phone,
            'position'   => $u->position,
            'role'       => $u->role->value,
            'role_label' => $u->role->label(),
            'created_at' => $u->created_at->format('d/m/Y'),
        ]);

        return Inertia::render('users/index', [
            'users' => $users,
        ]);
    }

    public function create(): Response
    {
        abort_if(! auth()->user()->isAdmin(), 403);

        $roles = auth()->user()->isSuperAdmin()
            ? UserRole::options()
            : UserRole::companyOptions();

        return Inertia::render('users/create', [
            'roles' => $roles,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create([
            'company_id' => auth()->user()->company_id,
            'name'       => $request->name,
            'email'      => $request->email,
            'role'       => $request->role,
            'phone'      => $request->phone,
            'position'   => $request->position,
            'password'   => Hash::make($request->password),
        ]);

        return redirect()->route('users.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function edit(User $user): Response
    {
        abort_if(! auth()->user()->isAdmin(), 403);
        abort_if(! auth()->user()->isSuperAdmin() && $user->company_id !== auth()->user()->company_id, 403);

        $roles = auth()->user()->isSuperAdmin()
            ? UserRole::options()
            : UserRole::companyOptions();

        return Inertia::render('users/edit', [
            'user'  => [
                'id'       => $user->id,
                'name'     => $user->name,
                'email'    => $user->email,
                'phone'    => $user->phone,
                'position' => $user->position,
                'role'     => $user->role->value,
            ],
            'roles' => $roles,
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        abort_if(! auth()->user()->isSuperAdmin() && $user->company_id !== auth()->user()->company_id, 403);

        $data = $request->only(['name', 'email', 'role', 'phone', 'position']);

        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return redirect()->route('users.index')
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user): RedirectResponse
    {
        abort_if(! auth()->user()->isAdmin(), 403);
        abort_if(! auth()->user()->isSuperAdmin() && $user->company_id !== auth()->user()->company_id, 403);
        abort_if($user->id === auth()->id(), 403, 'No puedes eliminar tu propio usuario.');

        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'Usuario eliminado correctamente.');
    }
}
