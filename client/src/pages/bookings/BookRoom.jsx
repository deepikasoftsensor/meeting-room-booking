import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getRooms } from "../../services/roomService";
import { createBooking } from "../../services/bookingService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BookRoom = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    roomId: "",
    date: "",
    startTime: "",
    endTime: "",
    purpose: "",
  });

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const res = await getRooms();
      setRooms(res.rooms.filter((room) => room.isAvailable));
    } catch {
      toast.error("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      return toast.error("End time must be after start time");
    }

    try {
      setSubmitting(true);

      await createBooking(form);

      toast.success("Meeting room booked successfully!");

      navigate("/bookings");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Booking failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Book Meeting Room
          </h1>

          <p className="text-slate-500 mt-1">
            Reserve an available meeting room
          </p>
        </div>

        <div className="bg-white rounded-xl shadow p-8">

          {loading ? (
            <p>Loading...</p>
          ) : (
            <form onSubmit={handleSubmit}>

              <div className="mb-5">
                <label className="block mb-2 font-semibold">
                  Meeting Room
                </label>

                <select
                  value={form.roomId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      roomId: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  required
                >
                  <option value="">Select Room</option>

                  {rooms.map((room) => (
                    <option
                      key={room._id}
                      value={room._id}
                    >
                      {room.name} • {room.location} • Capacity{" "}
                      {room.capacity}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-5">
                <label className="block mb-2 font-semibold">
                  Date
                </label>

                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      date: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">

                <div>
                  <label className="block mb-2 font-semibold">
                    Start Time
                  </label>

                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startTime: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-3"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-semibold">
                    End Time
                  </label>

                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endTime: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg p-3"
                    required
                  />
                </div>

              </div>

              <div className="mb-6">
                <label className="block mb-2 font-semibold">
                  Purpose
                </label>

                <textarea
                  rows={4}
                  value={form.purpose}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      purpose: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3"
                  placeholder="Meeting agenda..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
              >
                {submitting ? "Booking..." : "Book Meeting Room"}
              </button>

            </form>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default BookRoom;