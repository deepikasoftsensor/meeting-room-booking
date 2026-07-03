import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-8">
      <h1 className="font-bold text-xl">
        Meeting Room Booking
      </h1>

      <div>
        <p className="font-semibold">
          {user?.name}
        </p>

        <p className="text-sm text-gray-500">
          {user?.role}
        </p>
      </div>
    </div>
  );
}