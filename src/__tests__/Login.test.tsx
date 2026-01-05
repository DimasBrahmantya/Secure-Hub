import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Login } from "../pages/Login/Login";
import { toast } from "sonner";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("Login Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const setup = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  it("Menampilkan form login", () => {
    setup();
    expect(screen.getByText("Login Securely")).toBeInTheDocument();
  });

  it("Menampilkan input email dan password", () => {
    setup();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("Menampilkan error jika email atau password kosong", async () => {
    setup();
    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });

  it("Mengirim request login jika input valid", async () => {
    globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ userId: "123" }),
  })
) as any;

    setup();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
      expect(localStorage.getItem("userId")).toBe("123");
    });
  });

  it("Redirect ke halaman 2FA setelah login sukses", async () => {
    globalThis.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ userId: "123" }),
  })
) as any;

    setup();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@email.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/2fa");
    });
  });
});
