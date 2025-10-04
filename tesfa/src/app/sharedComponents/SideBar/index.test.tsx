import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from ".";
import "@testing-library/jest-dom";

const localStorageMock = (function () {
  let store: { [key: string]: string } = {};
  return {
    getItem: function (key: string) {
      return store[key] || null;
    },
    setItem: function (key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function (key: string) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
});

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  usePathname: () => "/",
}));
describe("Sidebar Component", () => {
  beforeEach(() => {
    mockPush.mockClear();
    localStorage.clear();
  });
  it("renders the sidebar closed by default", () => {
    render(<Sidebar />);
    const dashboardText = screen.queryByText("Dashboard");
    expect(dashboardText).toHaveClass("opacity-0");
  });
  it("toggles open when sidebar button is clicked", () => {
    render(<Sidebar />);
    const toggleBtn = screen.getByTestId("desktop-toggle-button");
    fireEvent.click(toggleBtn);
    expect(screen.getByText("Dashboard")).toBeVisible();
  });
  it("navigates to Dashboard when clicked", () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByTestId("desktop-toggle-button")); 
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard"); 
  });
  it("navigates to Profile when clicked", () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByTestId("desktop-toggle-button")); 
    fireEvent.click(screen.getByText("Profile"));
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });
  it("logs out and redirects to /onboarding/login", () => {
    const removeItemSpy = jest.spyOn(localStorage, "removeItem");
    render(<Sidebar />);
    fireEvent.click(screen.getByTestId("desktop-toggle-button")); 
    fireEvent.click(screen.getByText("Logout"));
    expect(removeItemSpy).toHaveBeenCalledWith("authToken");
    expect(mockPush).toHaveBeenCalledWith("/onboarding/login");
  });
});