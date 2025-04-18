<x-layouts.app>
    <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        <div class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Welcome, {{ Auth::user()->name }}</h2>
            <p class="text-gray-600">This is your dashboard. You can manage your account and access various features from here.</p>
        </div>
    </div>
</x-layouts.app>
