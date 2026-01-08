<?php

use App\Models\User;
use Tests\TestCase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, get, patch, delete};

/** @var TestCase $this */
uses(TestCase::class, RefreshDatabase::class);

test('profile page is displayed', function () {
    $user = User::factory()->create();

    actingAs($user);
    $response = get(route('profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create();

    actingAs($user);
    $response = patch(route('profile.update'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '1234567890',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create();

    actingAs($user);
    $response = patch(route('profile.update'), [
        'email' => $user->email,
        'phone' => '1234567890',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('user can delete their account', function () {
    $user = User::factory()->create();

    actingAs($user);
    $response = delete(route('profile.destroy'), [
        'password' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));
    expect(Auth::check())->toBeFalse();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create();

    actingAs($user);
    $response = delete(route('profile.destroy'), [
        'password' => 'wrong-password',
    ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('profile.edit'));

    expect($user->fresh())->not->toBeNull();
});