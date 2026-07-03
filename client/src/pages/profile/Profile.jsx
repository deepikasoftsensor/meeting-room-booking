import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = { name: form.name };
      if (form.password) payload.password = form.password;
      await api.put("/users/me", payload);
      await fetchCurrentUser();
      toast.success("Profile updated!");
      setForm((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Profile</h1>
        <p className="text-slate-500 mt-1">Manage your account</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-slate-500">{user?.email}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${user?.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>
                {user?.role}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-slate-500 mb-1">Company</p>
            <p className="font-semibold">{user?.company?.name}</p>
          </div>
          {user?.role === "admin" && user?.company?.inviteCode && (
            <div className="border-t pt-4 mt-4">
              <p className="text-sm text-slate-500 mb-2">Invite Code</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold tracking-widest bg-slate-100 px-4 py-2 rounded-lg">
                  {user.company.inviteCode}
                </span>
                <button onClick={() => { navigator.clipboard.writeText(user.company.inviteCode); toast.success("Copied!"); }} className="text-blue-600 text-sm font-semibold hover:underline">
                  Copy
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1">Share this with team members</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-xl font-bold mb-6">Update Profile</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-600 mb-1">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-3" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-600 mb-1">New Password <span className="text-slate-400 font-normal">(leave blank to keep current)</span></label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg p-3" placeholder="••••••••" minLength={6} />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};
export default Profile;
