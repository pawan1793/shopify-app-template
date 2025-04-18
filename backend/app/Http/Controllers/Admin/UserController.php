<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the users.
     */
    public function index()
    {
        $users = User::latest()->paginate(10);
        
        return view('admin.users.index', compact('users'));
    }
    
    /**
     * Impersonate a user.
     */
    public function impersonate(User $user)
    {
        // Store the admin's ID in the session
        session(['impersonator_id' => Auth::guard('admin')->id()]);
        
        // Login as the user
        Auth::login($user);
        
        return redirect()->route('dashboard')->with('success', 'You are now impersonating ' . $user->name);
    }
    
    /**
     * Stop impersonating a user.
     */
    public function stopImpersonation()
    {
        // Get the admin ID from the session
        $adminId = session('impersonator_id');
        
        if (!$adminId) {
            return redirect()->route('dashboard');
        }
        
        // Logout the current user
        Auth::logout();
        
        // Login as the admin
        Auth::guard('admin')->loginUsingId($adminId);
        
        // Remove the impersonator_id from the session
        session()->forget('impersonator_id');
        
        return redirect()->route('admin.dashboard')->with('success', 'You are no longer impersonating a user.');
    }
}
