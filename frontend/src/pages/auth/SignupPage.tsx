// BusinessSignup.jsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers/AuthProvider";
import { ArrowLeft, ArrowRight, Expand, Eye, EyeOff } from "lucide-react";

export default function BusinessSignup() {
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    businessType: "",
    phoneCountryCode: "+91",
    phoneNationalNumber: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const code = (formData.phoneCountryCode || "").trim();
      const national = (formData.phoneNationalNumber || "").replace(/\D/g, "").trim();
      if (!code || !national) {
        setError("Phone number is required");
        return;
      }
      const normalizedPhone = `${code}${national}`;

      await signUp(formData.email, formData.password, {
        sub: "", // Will be populated by Supabase
        email: formData.email,
        owner_name: formData.ownerName,
        business_name: formData.businessName,
        business_type: formData.businessType,
        phone: normalizedPhone,
        email_verified: false, // Will be updated by Supabase
        phone_verified: false,
      });
      // Supabase by default might require email verification, 
      // but if it's disabled, it will log the user in.
      // We'll navigate to dashboard and let the AuthProvider handle the state.
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4">
        <Link to="/auth/login" className="w-12 h-12 flex items-center justify-center text-[#0e121b]">
          <ArrowLeft size={24}/>
        </Link>

        <h2 className="text-lg font-bold text-[#0e121b]">
          Business Signup
        </h2>

        <div className="w-12 h-12" />
      </header>

      {/* Progress */}
      <div className="flex items-center justify-center gap-3 py-5">
        <div className="w-8 h-2 rounded-full bg-blue-600"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
        <div className="w-2 h-2 rounded-full bg-gray-300"></div>
      </div>

      {/* Main Form */}
      <main className="w-full max-w-[480px] mx-auto px-4 pb-16">
        <h1 className="text-[32px] font-extrabold text-[#0e121b] leading-tight mb-2">
          Launch your business portal
        </h1>

        <p className="text-gray-500 mb-8">
          Join thousands of businesses managing bookings via WhatsApp.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {/* Business Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Business Name
            </label>

            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              placeholder="e.g. Acme Corp"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Owner's Full Name
            </label>

            <input
              type="text"
              name="ownerName"
              required
              value={formData.ownerName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Business Type */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Business Type
            </label>

            <div className="relative">
              <select 
                name="businessType"
                required
                value={formData.businessType}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-gray-300 px-4 appearance-none outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 bg-white"
              >
                <option value="">Select category</option>
                <option value="salon">Hair Salon & Spa</option>
                <option value="consulting">
                  Professional Consulting
                </option>
                <option value="health">Health & Wellness</option>
                <option value="automotive">
                  Automotive Services
                </option>
                <option value="other">
                  Other Service Provider
                </option>
              </select>

              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                <Expand size={24}/>
              </span>
            </div>
          </div>

          {/* Email */}
          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Business Phone Number
            </label>

            <div className="grid grid-cols-[140px_1fr] gap-3">
              <select
                name="phoneCountryCode"
                required
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600 bg-white"
                aria-label="Country code"
              >
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+64">+64 (NZ)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+92">+92 (PK)</option>
                <option value="+93">+93 (AF)</option>
                <option value="+94">+94 (LK)</option>
                <option value="+95">+95 (MM)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+966">+966 (SA)</option>
              </select>

              <input
                type="tel"
                name="phoneNationalNumber"
                required
                value={formData.phoneNationalNumber}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
                aria-label="Phone number"
              />
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Select your ISD code and enter your number.
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Work Email
            </label>

            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="john@company.com"
              className="w-full h-14 rounded-xl border border-gray-300 px-4 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-[#0e121b] mb-2">
              Create Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full h-14 rounded-xl border border-gray-300 px-4 pr-14 outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              />

              {/* <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <span className="material-symbols-outlined">
                  {showPassword ? <Eye size={24} /> : <EyeOff size={24} />}
                </span>
              </button> */}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? "Creating account..." : "Signup"}</span>

              {!loading && (
                  <ArrowRight size={24}/>
              )}
            </button>
          </div>
        </form>


        {/* Terms */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500 px-4 leading-relaxed">
            By signing up, you agree to our{" "}
            <a
              href="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="/"
              className="text-blue-600 font-semibold hover:underline"
            >
              Privacy Policy
            </a>
            .
          </p>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-[#0e121b]">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="text-blue-600 font-bold hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-12 p-6 bg-[#f3f4fa] rounded-2xl border border-gray-200 flex items-start gap-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT8K4rCk4oU7fbeljWJZJcdmb2xPiHagPYXwRLAk2I56WrxMcQlPMrIslCF3MpQMirLr4ZYjwRwHatmSF1i4Ro7qe_8jUw04tmFrxf3S99EyxePDAmY-ys_2vZvWwZ-yBMT_8EOT_bBQcu5Ct7cKQorhFgKNa1e2-uWCikjO5-hs2yMEcAmVmWAvyBKNj3Ym0-0-HE17Qe-9NE4gzoyl76XFfNAcT9hFo6s7rrln1PBkmgUt9Tf8Ca5v_0kq1GLUya_9W-7BwWG6g"
            alt="Business Owner"
            className="w-12 h-12 rounded-full object-cover"
          />

          <div>
            <p className="text-sm italic text-gray-600 leading-relaxed">
              "Setting up our studio portal took less than 2 minutes.
              The WhatsApp integration changed how we handle clients."
            </p>

            <p className="text-sm mt-3 font-bold text-[#0e121b]">
              — Sarah Chen, Bloom Yoga Studio
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}