import {
  useState,
  useRef,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import "./TwoFactorAuth.css";

export default function TwoFactorAuth() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>(Array(6).fill(null));

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;

    const arr = [...otp];
    for (let i = 0; i < pasteData.length; i++) arr[i] = pasteData[i];
    setOtp(arr);

    const next = arr.findIndex((x) => !x);
    (next === -1 ? inputRefs.current[5] : inputRefs.current[next])?.focus();
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      toast.error("Please fill the OTP completely!");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("userId"), // simpan saat login
          otp: otpValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error("Invalid OTP", {
          description: data.message,
        });
        return;
      }

      toast.success("Authentication Successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error("Server Error");
    }
  };

  return (
    <div className="two-factor-container">
      <div className="two-factor-branding">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <svg
            className="w-12 h-12"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 44C24 44 40 36 40 24V10L24 4L8 10V24C8 36 24 44 24 44Z"
              stroke="#1E1E1E"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1>SecureHub</h1>
        </div>
        <p>Two-Factor Authentication</p>
      </div>

      <div className="two-factor-card">
        <svg viewBox="0 0 52 52" fill="none">
          <path
            d="M15.1667 23.8334V15.1667C15.1667 12.2935 16.308 9.53803 18.3397 7.50638C20.3713 5.47474 23.1268 4.33337 26 4.33337C28.8732 4.33337 31.6287 5.47474 33.6603 7.50638C35.692 9.53803 36.8333 12.2935 36.8333 15.1667V23.8334M10.8333 23.8334H41.1667C43.5599 23.8334 45.5 25.7735 45.5 28.1667V43.3334C45.5 45.7266 43.5599 47.6667 41.1667 47.6667H10.8333C8.4401 47.6667 6.5 45.7266 6.5 43.3334V28.1667C6.5 25.7735 8.4401 23.8334 10.8333 23.8334Z"
            stroke="#F5F5F5"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <h2>2FA Verification</h2>
        <p>Enter the 6-digit code from your authenticator app</p>

        <div className="otp-inputs">
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
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
            />
          ))}
        </div>

        <button onClick={handleSubmit} className="btn-authenticate">
          Authenticate
        </button>
        <button onClick={() => navigate("/login")} className="btn-back">
          Back to Login
        </button>
      </div>
    </div>
  );
}
