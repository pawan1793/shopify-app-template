@if(session()->has('impersonator_id'))
    <div class="bg-yellow-500 text-white py-2 px-4 fixed top-0 left-0 right-0 z-50">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <div>
                <span class="font-bold">Admin Mode:</span> You are currently impersonating {{ Auth::user()->name }}
            </div>
            <a href="{{ route('admin.stop-impersonation') }}" class="bg-white text-yellow-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-yellow-100">
                Exit Impersonation
            </a>
        </div>
    </div>
@endif
