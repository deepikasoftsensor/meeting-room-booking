import { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import { getMembers, inviteMember } from "../../services/companyService";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const Members = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member" });

  useEffect(() => { fetchMembers(); }, []);

  const fetchMembers = async () => {
    try { const res = await getMembers(); setMembers(res.members); }
    catch { toast.error("Failed to load members"); }
    finally { setLoading(false); }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await inviteMember(form);
      toast.success("Member added!");
      setShowModal(false);
      setForm({ name: "", email: "", password: "", role: "member" });
      fetchMembers();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
    finally { setSubmitting(false); }
  };

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Members</h1>
          <p className="text-slate-500 mt-1">Everyone in your company</p>
        </div>
        {isAdmin && <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold">+ Add Member</button>}
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-left text-slate-500 text-sm">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m._id} className="border-t text-sm">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">{m.name[0].toUpperCase()}</div>
                    {m.name}
                    {m._id === user?.id && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">You</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{m.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${m.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-slate-100 text-slate-600"}`}>{m.role}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-[440px]">
            <h2 className="text-2xl font-bold mb-6">Add Member</h2>
            <form onSubmit={handleInvite}>
              <input type="text" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg p-3 mb-4" required />
              <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg p-3 mb-4" required />
              <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full border rounded-lg p-3 mb-4" required />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg p-3 mb-6">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-slate-300 py-2.5 rounded-lg font-semibold">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold">{submitting ? "Adding..." : "Add Member"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </MainLayout>
  );
};
export default Members;
