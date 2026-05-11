import React, { useState } from "react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#faf8ff] text-[#191b23]">
      <main className="w-full max-w-[480px] mx-auto min-h-screen bg-white sm:shadow-sm">
        
        {/* Header */}
        <div className="flex items-center p-4 pb-2 justify-between bg-[#faf8ff]">
          <button className="flex size-12 items-center cursor-pointer">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h2 className="text-lg font-bold flex-1 text-center pr-12">
            Reset Password
          </h2>
        </div>

        {/* Intro */}
        <div className="px-4 pt-8 pb-4">
          <div className="w-16 h-16 bg-[#dbe1ff] rounded-xl flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-[#004ac6] text-[32px]">
              lock_reset
            </span>
          </div>

          <h3 className="text-2xl font-bold pb-2">
            Create new password
          </h3>

          <p className="text-[#434655] text-base">
            Your new password must be at least 8 characters long and include a
            mix of letters, numbers, and symbols.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4">
          
          {/* New Password */}
          <div className="flex flex-col gap-4 px-4 py-3">
            <label className="flex flex-col w-full">
              <p className="pb-2 font-medium">New Password</p>

              <div className="flex w-full items-stretch rounded-lg">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full h-14 border border-[#E2E8F0] border-r-0 rounded-l-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="border border-[#E2E8F0] border-l-0 px-4 rounded-r-lg flex items-center"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </label>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-4 px-4 py-3">
            <label className="flex flex-col w-full">
              <p className="pb-2 font-medium">Confirm New Password</p>

              <div className="flex w-full items-stretch rounded-lg">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat new password"
                  className="w-full h-14 border border-[#E2E8F0] border-r-0 rounded-l-lg px-4 focus:outline-none focus:ring-2 focus:ring-[#004ac6]/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="border border-[#E2E8F0] border-l-0 px-4 rounded-r-lg flex items-center"
                >
                  <span className="material-symbols-outlined">
                    {showConfirmPassword
                      ? "visibility_off"
                      : "visibility"}
                  </span>
                </button>
              </div>
            </label>
          </div>

          {/* Password Requirements */}
          <div className="px-4 py-2 space-y-2">
            <div className="flex items-center gap-2 text-sm text-[#006c49]">
              <span className="material-symbols-outlined text-[18px]">
                check_circle
              </span>
              <span>At least 8 characters long</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#434655]">
              <span className="material-symbols-outlined text-[18px]">
                radio_button_unchecked
              </span>
              <span>Contains a number (0-9)</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#434655]">
              <span className="material-symbols-outlined text-[18px]">
                radio_button_unchecked
              </span>
              <span>Contains a special character (!@#$)</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="px-4 pt-6 pb-8">
            <button
              type="submit"
              className="w-full h-14 rounded-xl bg-[#004ac6] text-white font-bold flex items-center justify-center gap-2 hover:bg-[#0053db] transition-colors"
            >
              Update Password

              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>

            <button
              type="button"
              className="w-full mt-4 h-12 rounded-xl text-[#004ac6] font-semibold hover:bg-[#004ac6]/5 transition-colors"
            >
              Cancel and go back
            </button>
          </div>
        </form>

        {/* Illustration */}
        <div className="px-4 pb-12">
          <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E2E8F0]">
            <img
              className="w-full h-48 object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlExHCZ_vmPvg4UQxsFaAbrEvOI94Kf0RYwgGP62H0IVTHLjuZCFiY1QoiJ1i6blCtyn2_bMfs53jsCfOpd0HNr5SsQ8bWgTQ6Mu9VXMlJXN9wdNdotbhReta7-n9IhwbSKYulllrPJuhyrZevKLOBaCL1NGNuwmF3I5lAbKdGKMFnJmmHTYRGw5MXsVkrqqfxDr5TwG3DJkzC3U9jDPEYy3sBjLCI5UD-clDXoN0Ur_aT-SQTdzF_UqhLeuQfaOqOVx7yyd4xKds"
              alt="Security illustration"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;