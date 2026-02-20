import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserDashboard } from "../components/User/UserDashboard";
import axiosInstance from "../components/Utils/axiosInstance";
import { vi } from "vitest";

vi.mock("../components/Utils/axiosInstance", () => ({
  default: {
    get: vi.fn(),
  },
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { _id: "test-user-id" },
  }),
}));

describe("UserDashboard", () => {
  beforeEach(() => {
    axiosInstance.get.mockResolvedValue({
      data: { data: [] },
    });
  });

  test("fetches dashboard data on mount and renders overview", async () => {
    render(
      <MemoryRouter>
        <UserDashboard />
      </MemoryRouter>
    );

    // Wait until API calls happen
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });

    // Verify UI rendered
    expect(
      screen.getByText(/financial overview/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/total income/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/total expenses/i)
    ).toBeInTheDocument();
  });
});
