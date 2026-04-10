import {  screen } from "@testing-library/react";
import {renderWithProviders as render} from "./test-utils"
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

    expect(
      screen.getByRole("heading", { name: /welcome back/i })
    ).toBeInTheDocument();
  });
});