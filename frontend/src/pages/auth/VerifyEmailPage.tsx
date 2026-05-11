import React, { useRef, useState } from "react";

export default function VerifyEmail() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1);
    setOtp(updatedOtp);

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8ff] text-[#191b23]">
      {/* Header */}
      <header className="flex items-center border-b border-[#E2E8F0] bg-white px-6 py-4">
        <button className="flex items-center justify-center rounded-full p-2 text-[#434655] transition-colors hover:bg-[#f3f3fe]">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <span className="ml-4 text-lg font-semibold text-[#1E293B]">
          Back to Sign Up
        </span>
      </header>

      {/* Main */}
      <main className="flex flex-1 items-center justify-center p-6">
        <div className="flex w-full max-w-md flex-col items-center">
          {/* Illustration */}
          <div className="mb-6 flex w-full justify-center">
            <div className="relative h-48 w-48 overflow-hidden rounded-xl shadow-md">
              <div
                className="h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBx_LweXU5MJ6QY0iAZMvu1nvVqCZa4SeLdsnfJEEtc72kOCNg_uXF0Yqp5K6nFkM6X3SW-xFzkRqImYbrJ6ypNdKXH6KFn6p1xae8MkmGYzYVa9wbtjmtHjzHaQmpzeqQLXN_bJPYlVNY0ImmtSX5b6S61mjK-cS6AVJIQxtkjWuhVfmllIFjPdzglwTno6vj0LOO2EUZwiUrFXZzrDwMiP2o9Xf-DOO00XzZu7CqQpkPDR0_M_v99_q5d9qBUQBtS7A6wIjFghBo')",
                }}
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 text-3xl font-bold text-[#191b23]">
              Verify your email
            </h1>

            <p className="text-[#434655]">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-[#004ac6]">
                sarah.j@example.com
              </span>
              . Please enter it below to confirm your account.
            </p>
          </div>

          {/* OTP Inputs */}
          <div className="w-full space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) =>
                    handleChange(e.target.value, index)
                  }
                  onKeyDown={(e) =>
                    handleKeyDown(e, index)
                  }
                  placeholder="0"
                  className="h-14 w-full rounded-lg border border-[#E2E8F0] bg-white text-center text-2xl font-bold outline-none transition-all focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] py-4 font-semibold text-white shadow-md transition-all hover:bg-[#2563eb] active:scale-[0.98]">
              Verify & Continue
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </button>

            {/* Resend */}
            <div className="text-center">
              <p className="text-sm text-[#64748B]">
                Didn't receive the email?
                <button className="ml-1 font-semibold text-[#004ac6] hover:underline">
                  Resend Code
                </button>
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-16 w-full border-t border-[#E2E8F0] pt-6 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-[#434655]">
              <span
                className="material-symbols-outlined text-[#25D366]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                lock
              </span>
              Your data is secured with enterprise-grade encryption
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-sm text-[#64748B]">
          © 2024 BookBot Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}