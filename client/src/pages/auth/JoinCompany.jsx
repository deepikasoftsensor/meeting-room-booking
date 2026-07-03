import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { signupJoin } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const JoinCompany = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ inviteCode: "", name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await signupJoin(form);
      login(data.token, data.user);
      toast.success("Joined company successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-8 w-[450px]">
        <h1 className="text-3xl font-bold text-center mb-2">Join Company</h1>
        <p className="text-center text-gray-500 mb-6">Enter your invite code to join</p>
        <input type="text" name="inviteCode" placeholder="Invite Code" value={form.inviteCode} onChange={handleChange} className="w-full border rounded-lg p-3 mb-4 uppercase" required />
        <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} className="w-full border rounded-lg p-3 mb-4" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded-lg p-3 mb-4" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded-lg p-3 mb-6" required />
        <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold">
          {loading ? "Joining..." : "Join Company"}
        </button>
        <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-600 font-semibold">Login</Link></p>
        <p className="text-center mt-2">Want to create a company? <Link to="/signup" className="text-blue-600 font-semibold">Create Here</Link></p>
      </form>
    </div>
  );
};
export default JoinCompany;
