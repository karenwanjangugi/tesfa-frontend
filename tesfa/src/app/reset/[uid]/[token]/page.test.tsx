
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
jest.mock("../../components/ResetForm", () => {
  return function MockResetFormClient({
    uid,
    token,
  }: {
    uid: string;
    token: string;
  }) {
    return <div data-testid="reset-form">Reset Form: {uid} - {token}</div>;
  };
});

import ResetPage from "@/app/reset/[uid]/[token]/page";

describe("ResetPage", () => {
  it("renders reset form with correct uid and token", async () => {
    const mockParams = Promise.resolve({
      uid: "mock-uid",
      token: "mock-token",
    });
    render(await ResetPage({ params: mockParams }));

    const form = await screen.findByTestId("reset-form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveTextContent("Reset Form: mock-uid - mock-token");
   
  });
});

