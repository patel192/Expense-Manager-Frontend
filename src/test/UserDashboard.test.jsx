import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { UserDashboard } from "../components/User/UserDashboard";
import axiosInstance from "../components/Utils/axiosInstance";
import { expect, vi } from "vitest";

vi.mock("../components/Utils/axiosInstance");

axiosInstance.get.mockResolvedValue({
  data: {
    data: [],
  },
});

describe("UserDashboard", () => {
  test("fetches dashboard data on mount", async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <UserDashboard />
        </AuthProvider>
      </MemoryRouter>,
    );
    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
    });
  });
});
