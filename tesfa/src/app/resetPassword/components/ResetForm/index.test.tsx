import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ResetFormClient from "./index"; 
import { useRouter } from "next/navigation";

jest.mock("../../../../app/hooks/usePasswordConfirm", () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ResetFormClient", () => {
  const mockRouter = { push: jest.fn(), back: jest.fn() };
  const mockConfirmReset = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    const mockHook = require("../../../../app/hooks/usePasswordConfirm").default as jest.Mock;
    mockHook.mockReturnValue({
      loading: false,
      error: null,
      message: null,
      confirmReset: mockConfirmReset,
    });

    jest.clearAllMocks();
  });

  const setup = (uid = "test-uid", token = "test-token") => {
    render(<ResetFormClient uid={uid} token={token} />);
  };

  it("renders form with all fields and button", () => {
    setup();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm New Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });

  it("shows local error if password is too short", async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("New Password"), "short");
    await user.type(screen.getByPlaceholderText("Confirm New Password"), "short");
    await user.click(screen.getByRole("button", { name: /Reset Password/i }));
    expect(screen.getAllByText("Must be at least 8 characters").length).toBe(2);
    expect(mockConfirmReset).not.toHaveBeenCalled();
  });

  it("shows local error if passwords do not match", async () => {
    setup();
    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText("New Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm New Password"), "password456");
    await user.click(screen.getByRole("button", { name: /Reset Password/i }));
    expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    expect(mockConfirmReset).not.toHaveBeenCalled();
  });

  it("calls confirmReset with correct payload and redirects on success", async () => {
    setup();
    const user = userEvent.setup();
    mockConfirmReset.mockResolvedValue({});

    await user.type(screen.getByPlaceholderText("New Password"), "password123");
    await user.type(screen.getByPlaceholderText("Confirm New Password"), "password123");
    await user.click(screen.getByRole("button", { name: /Reset Password/i }));

    expect(mockConfirmReset).toHaveBeenCalledWith({
      uidb64: "test-uid",
      token: "test-token",
      new_password: "password123",
      confirm_password: "password123",
    });
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/resetsuccess");
    }, { timeout: 2000 });
  });

  it("navigates back when back button is clicked", async () => {
    setup();
    const user = userEvent.setup();
    await user.click(screen.getByLabelText(/Go back/i));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});