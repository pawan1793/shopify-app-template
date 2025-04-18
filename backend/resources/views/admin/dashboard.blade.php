<x-layouts.admin>
    <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-indigo-50 p-6 rounded-lg shadow-sm">
                <h2 class="text-xl font-semibold text-indigo-800 mb-4">User Statistics</h2>
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-600">Total Users</p>
                        <p class="text-3xl font-bold text-indigo-700">{{ $totalUsers }}</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
            </div>
            
            <div class="bg-green-50 p-6 rounded-lg shadow-sm">
                <h2 class="text-xl font-semibold text-green-800 mb-4">Quick Actions</h2>
                <div class="space-y-2">
                    <a href="{{ route('admin.users.index') }}" class="block w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md text-center">
                        Manage Users
                    </a>
                </div>
            </div>
        </div>
        
        <div class="mt-8">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Recent Users</h2>
            <div class="bg-white shadow overflow-hidden rounded-md">
                <ul class="divide-y divide-gray-200">
                    @forelse ($recentUsers as $user)
                        <li class="px-6 py-4">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="font-medium text-gray-900">{{ $user->name }}</p>
                                    <p class="text-sm text-gray-500">{{ $user->email }}</p>
                                </div>
                                <div class="text-sm text-gray-500">
                                    Joined {{ $user->created_at->diffForHumans() }}
                                </div>
                                <a href="{{ route('admin.users.impersonate', $user) }}" class="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150">
                                    Login as User
                                </a>
                            </div>
                        </li>
                    @empty
                        <li class="px-6 py-4 text-center text-gray-500">
                            No users found.
                        </li>
                    @endforelse
                </ul>
            </div>
        </div>
    </div>
</x-layouts.admin>
