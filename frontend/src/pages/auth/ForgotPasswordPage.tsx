import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      console.error("Reset error:", err);
      setError(err.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#faf8ff] text-[#191b23] min-h-screen flex flex-col">

      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#ededf9] transition-colors"
        >
          <span className="material-symbols-outlined text-[#191b23]">
            arrow_back
          </span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[480px]">

          {/* Top Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-xl bg-[#dbe1ff] flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[#004ac6] text-[32px]">
                lock_reset
              </span>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">
              Reset Password
            </h1>

            <p className="text-[#64748B] text-base">
              Enter your email to receive a password reset link
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-[#E2E8F0]">
            {success ? (
              <div className="text-center space-y-4 py-4">
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl font-medium">
                  Password reset link sent! Please check your email inbox.
                </div>
                <Link
                  to="/auth/login"
                  className="inline-block text-[#004ac6] font-bold hover:underline"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form
                className="space-y-6"
                onSubmit={handleSubmit}
              >
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Email Field */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-[#191b23]"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#faf8ff] rounded-lg border border-[#E2E8F0] focus:border-[#004ac6] focus:ring-1 focus:ring-[#004ac6] outline-none transition-all text-base placeholder:text-[#737686]"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#004ac6] text-white font-bold py-3 px-6 rounded-lg shadow-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>{loading ? "Sending..." : "Send Reset Link"}</span>

                  {!loading && (
                    <span className="material-symbols-outlined text-[20px]">
                      send
                    </span>
                  )}
                </button>
              </form>
            )}
          </div>


          {/* Footer Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-[#64748B]">
              Remember your password?{" "}

              <Link
                to="/auth/login"
                className="text-[#004ac6] font-semibold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Background Illustration */}
      <div className="fixed bottom-0 right-0 p-6 opacity-10 pointer-events-none hidden lg:block">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVv2PzVL6R2lZRHh0VCKZQkhpKJe8IKH59sqYgRdOHirSulchgLBJocxk_YTvlkfCJTtTEkbyO0MjGYQk73g6_MzkBCtp7oD9T6Z8LzgABi48OAaewJVQrfobd736OLwujRM5FNPXWdAkzpLUVQ3PHb-WmYPXVJkg6nqT2hQ4YT4zZPF1osx__yCxCLLXpmmfpDk9hPFLDZK31jq8qdWeIRPokflAmb5TGhlBCK-xEVQHPjxD0Y2_TF05utXlOAb2BitwenbXXocM"
          alt="Security illustration"
          className="max-w-[300px]"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
