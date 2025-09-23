
import { render, screen } from "@testing-library/react";
import SuccessPage from "./page"; 

describe("SuccessPage", () => {
  it("renders success message and heading", () => {
    render(<SuccessPage />);

  
    expect(screen.getByText("Successful")).toBeInTheDocument();
    expect(
      screen.getByText("Your password has successfully changed")
    ).toBeInTheDocument();
  });

  it("renders Back To Dashboard button that links to /dashboard", () => {
    render(<SuccessPage />);

  
    const link = screen.getByRole("link", { name: /Back To Dashboard/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });


});