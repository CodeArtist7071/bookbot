import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Phone as SmartToy,
  Eye as Visibility,
  EyeOff as VisibilityOff,
  ChartBar as Chat,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#faf8ff]">
      <div className="w-full max-w-[800px] flex flex-col items-center">
        {/* Main Card */}
        <div className="relative flex flex-col w-full bg-white rounded-xl shadow-sm border border-[#E2E8F0] overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-center p-4 pb-2">
            <div className="flex items-center gap-2">
              <SmartToy className="text-[#004ac6]" size={32} />
              <h2 className="text-[#191b23] text-lg font-bold">
                BookBot
              </h2>
            </div>
          </div>

          {/* Hero Image */}
          <div className="px-4 py-3">
            <div
              className="w-full min-h-[160px] rounded-lg bg-cover bg-center bg-no-repeat bg-[#f3f3fe]"
              style={{
                backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA6N0TV0Y4aPs7SkNcDw8uPFtevLku0z4w41rk3Q3Nss60jsQP7lb9IOImuC0Q2NotG-PVG4QDgcJKwGOzb-b_IiZ_gBvajdeK4A7OhdplaV0A5GjxyPHQrxw7rMCXIwKF8VLo-jr4AB6SYb3DJ_XV8xl-x7VPRn2Jyt_0NbnrAJQIBg4V8VYYxdncTNG3_of67RU1A6iZbxYHbsZXX63ZyOytwJtlUvL24Q8lGk0ZU3qcAoh_g6Uqwqshy6YQBOYWAGVYkw-dE6vk")`,
              }}
            />
          </div>

          {/* Welcome Text */}
          <div className="px-6 pt-6 text-center">
            <h1 className="text-[28px] font-bold text-[#191b23]">
              Welcome back
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your business appointments effortlessly.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#191b23] mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. john@business.com"
                  className="w-full h-12 bg-[#f8fafc] border border-[#E2E8F0] rounded-xl px-4 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#191b23] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-12 bg-[#f8fafc] border border-[#E2E8F0] rounded-xl px-4 pr-12 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <VisibilityOff size={20} /> : <Visibility size={20} />}
                </button>
              </div>
            </div>

            <div className="text-right">
              <Link
                to="/auth/forgot-password"
                className="text-sm font-semibold text-blue-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition shadow-md shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>


          {/* Sign Up Link */}
          <div className="p-6 pt-0 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account?{" "}
              <Link
                to="/auth/signup"
                className="font-bold text-blue-600 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex gap-6 text-xs text-gray-400">
          <Link to="/">Privacy</Link>
          <Link to="/">Terms</Link>
          <Link to="/">Help</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
