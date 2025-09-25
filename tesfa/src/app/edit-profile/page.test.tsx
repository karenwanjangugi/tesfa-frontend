import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditProfilePage from "./page";


jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));


jest.mock("@/app/hooks/useFetchOrganization.tsx", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: null,
    loading: true,
    error: null,
    refetch: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock("@/app/utils/fetchOrganization", () => ({
  updateUser: jest.fn(),
}));

process.env.API_URL = "http://localhost:3000";

describe("EditProfilePage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows loading state initially", () => {
    render(<EditProfilePage />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it("renders profile data and logo when loaded", async () => {
    require("@/app/hooks/useFetchOrganization.tsx").default.mockReturnValue({
      user: {
        email: "ngo@example.com",
        org_name: "Hope NGO",
        logo_image: "/logos/hope.png",
      },
      loading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByDisplayValue("ngo@example.com")).toBeInTheDocument();
    });

    expect(screen.getByText("Hope NGO")).toBeInTheDocument();

    const logo = screen.getByAltText("Current Logo");
    expect(logo).toHaveAttribute("src", "http://localhost:3000/logos/hope.png");
  });



  it("toggles password visibility", async () => {
    require("@/app/hooks/useFetchOrganization.tsx").default.mockReturnValue({
      user: { email: "ngo@example.com", org_name: "Hope NGO" },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    });

    const passwordInput = screen.getByPlaceholderText("password");
    const toggleButton = screen.getByLabelText(/Show password/i);

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("submits form and shows success message", async () => {
    const mockPush = jest.fn();

    require("next/navigation").useRouter.mockReturnValue({
      push: mockPush,
    });

    require("@/app/hooks/useFetchOrganization.tsx").default.mockReturnValue({
      user: { email: "ngo@example.com", org_name: "Hope NGO" },
      loading: false,
      error: null,
      refetch: jest.fn().mockResolvedValue(undefined),
    });

    require("@/app/utils/fetchOrganization").updateUser.mockResolvedValue({});

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("password"), "newPass123");
    await user.click(screen.getByRole("button", { name: /Save/i }));

    expect(require("@/app/utils/fetchOrganization").updateUser).toHaveBeenCalled();
    expect(await screen.findByText("Successfully updated!")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/profile");
    }, { timeout: 2000 });
  });

  it("shows error message on update failure", async () => {
    require("@/app/hooks/useFetchOrganization.tsx").default.mockReturnValue({
      user: { email: "ngo@example.com", org_name: "Hope NGO" },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    require("@/app/utils/fetchOrganization").updateUser.mockRejectedValue(
      new Error("Invalid credentials")
    );

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("password")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Save/i }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
      },
      { timeout: 2500 }
    );
  });

  it("navigates to /profile when Cancel is clicked", async () => {
    const mockPush = jest.fn();

    require("next/navigation").useRouter.mockReturnValue({
      push: mockPush,
    });

    require("@/app/hooks/useFetchOrganization.tsx").default.mockReturnValue({
      user: { email: "ngo@example.com", org_name: "Hope NGO" },
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<EditProfilePage />);

    await waitFor(() => {
      expect(screen.getByText("Hope NGO")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });
});