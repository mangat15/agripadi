<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Check if user has admin role (1 = admin, 0 = farmer)
        if ($request->user()->role !== 1) {
            abort(403, 'Akses ditolak. Anda tidak mempunyai kebenaran untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
