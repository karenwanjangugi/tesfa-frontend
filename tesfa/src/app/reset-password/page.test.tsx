
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ForgotPasswordPage from "./page"; 
import { useRouter } from "next/navigation";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));



jest.mock("../hooks/usePasswordReset", () => ({
  usePasswordReset: jest.fn(),
}));


jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
  
    return <img {...props} alt={props.alt ?? "mock"} />;
  },
}));


import { usePasswordReset } from "../hooks/usePasswordReset";

describe("ForgotPasswordPage", () => {
  const mockPush = jest.fn();
  const mockBack = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    });

    (usePasswordReset as jest.Mock).mockReturnValue({
      loading: false,
      message: null,
      error: null,
      requestReset: jest.fn().mockResolvedValue(undefined),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly with all elements", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your email here")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
 
  });

  it("allows user to type email", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email here");
    await user.type(emailInput, "test@example.com");

    expect(emailInput).toHaveValue("test@example.com");
  });

  it("calls requestReset with email on form submit", async () => {
    const user = userEvent.setup();
    const mockRequestReset = jest.fn().mockResolvedValue(undefined);
    (usePasswordReset as jest.Mock).mockReturnValue({
      loading: false,
      message: null,
      error: null,
      requestReset: mockRequestReset,
    });

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email here");
    await user.type(emailInput, "test@example.com");

    const submitButton = screen.getByRole("button", { name: /send/i });
    await user.click(submitButton);

    expect(mockRequestReset).toHaveBeenCalledWith("test@example.com");
  });

  it("disables button and shows 'Sending...' when loading", async () => {
    const user = userEvent.setup();
    (usePasswordReset as jest.Mock).mockReturnValue({
      loading: true,
      message: null,
      error: null,
      requestReset: jest.fn(),
    });

    render(<ForgotPasswordPage />);

    const submitButton = screen.getByRole("button", { name: /sending.../i });
    expect(submitButton).toBeDisabled();
  });

  it("shows success message when message is present", async () => {
    (usePasswordReset as jest.Mock).mockReturnValue({
      loading: false,
      message: "Password reset email sent!",
      error: null,
      requestReset: jest.fn(),
    });

    render(<ForgotPasswordPage />);

    expect(screen.getByText("Password reset email sent!")).toBeInTheDocument();
  });

  it("shows error message when error is present", async () => {
    (usePasswordReset as jest.Mock).mockReturnValue({
      loading: false,
      message: null,
      error: "Failed to send email",
      requestReset: jest.fn(),
    });

    render(<ForgotPasswordPage />);

    expect(screen.getByText("Failed to send email")).toBeInTheDocument();
  });


  it("respects required email field (shows invalid state)", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByPlaceholderText("Enter your email here");
    const submitButton = screen.getByRole("button", { name: /send/i });

   
    await user.clear(emailInput);
    await user.click(submitButton);

    
    expect(emailInput).toBeInvalid();
  });
});