export default function ProfileDropdown() {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50">

      <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
        Profile
      </button>

      <button className="w-full text-left px-4 py-3 hover:bg-gray-100">
        Settings
      </button>

      <button className="w-full text-left px-4 py-3 hover:bg-red-100 text-red-600">
        Logout
      </button>

    </div>
  );
}