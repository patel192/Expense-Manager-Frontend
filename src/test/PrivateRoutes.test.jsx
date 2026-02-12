import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PrivateRoutes } from "../components/Hooks/PrivateRoutes";
import { expect } from "vitest";
import { AuthProvider } from "../context/AuthContext";

describe("PrivateRoutes", () => {
  test("redirects to login if not authenticated", () => {
    localStorage.clear();
    render(
      <MemoryRouter initialEntries={["/private"]}>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/private" element={<div>Private Page</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </AuthProvider>
        ,
      </MemoryRouter>,
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
