<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

class ImpersonationMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (session()->has('impersonator_id')) {
            $admin = Admin::find(session('impersonator_id'));
            
            if ($admin) {
                View::share('impersonating', true);
                View::share('impersonator', $admin);
                View::share('impersonated_user', Auth::user());
            }
        }
        
        return $next($request);
    }
}
