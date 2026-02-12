import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Login } from "../Login";
import { expect } from "vitest";
import { AuthProvider } from "../context/AuthContext";
describe("Login Component", () => {
  test("renders Login Form", () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>,
    );
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });
});
