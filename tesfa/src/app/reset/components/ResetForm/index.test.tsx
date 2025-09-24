import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

import ResetFormClient from ".";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));


jest.mock("../../../hooks/usePasswordConfirm", () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe("ResetFormClient", () => {
  const defaultProps = {
    uid: "abc123",
    token: "xyz789",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form and allows password input", () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: jest.fn().mockResolvedValue({}),
    });

    render(<ResetFormClient {...defaultProps} />);

    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("shows password error if less than 8 characters", async () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: jest.fn(),
    });

    render(<ResetFormClient {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    fireEvent.change(passwordInput, { target: { value: "123" } });

    expect(await screen.findByText("Must be at least 8 characters")).toBeInTheDocument();
  });

  it("shows confirm password error if passwords don't match", async () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: jest.fn(),
    });

    render(<ResetFormClient {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    const confirmInput = screen.getByPlaceholderText("Confirm New Password");

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password12" } });

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  });

  it("submits form successfully and redirects after 150ms", async () => {
    const mockPush = jest.fn();

    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: mockPush,
    });

    const mockConfirmReset = jest.fn().mockResolvedValue({});
    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: mockConfirmReset,
    });

    render(<ResetFormClient {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    const confirmInput = screen.getByPlaceholderText("Confirm New Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton);

    expect(mockConfirmReset).toHaveBeenCalledWith({
      uidb64: defaultProps.uid,
      token: defaultProps.token,
      new_password: "password123",
      confirm_password: "password123",
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/resetsuccess");
    }, { timeout: 200 });
  });

  it("disables submit button when loading", () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: true,
      error: null,
      message: null,
      confirmReset: jest.fn(),
    });

    render(<ResetFormClient {...defaultProps} />);

 
    const submitButton = screen.getByRole("button", { name: "Resetting..." });
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent("Resetting...");
  });

  it("displays error message if API fails", async () => {
    const errorMessage = "Something went wrong";

    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

 
    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: errorMessage,
      message: null,
      confirmReset: jest.fn().mockResolvedValue({}), 
    });

    render(<ResetFormClient {...defaultProps} />);

    const passwordInput = screen.getByPlaceholderText("New Password");
    const confirmInput = screen.getByPlaceholderText("Confirm New Password");
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.change(confirmInput, { target: { value: "password123" } });
    fireEvent.submit(submitButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });

  it("toggles password visibility when eye icon is clicked", () => {
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: jest.fn(),
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: jest.fn(),
    });

    render(<ResetFormClient {...defaultProps} />);

    const toggle1 = screen.getAllByRole("button")[1]; 
    const passwordInput = screen.getByPlaceholderText("New Password");

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggle1);
    expect(passwordInput).toHaveAttribute("type", "text");

    fireEvent.click(toggle1);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("navigates back when back button is clicked", () => {
    const mockBack = jest.fn();

    (require("next/navigation").useRouter as jest.Mock).mockReturnValue({
      back: mockBack,
      push: jest.fn(),
    });

    (require("../../../hooks/usePasswordConfirm").default as jest.Mock).mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: jest.fn(),
    });

    render(<ResetFormClient {...defaultProps} />);

    const backButton = screen.getByLabelText("Go back");
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalled();
  });
});