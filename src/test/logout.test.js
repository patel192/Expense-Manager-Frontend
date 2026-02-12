import { expect } from "vitest";
import { logout } from "../components/Utils/Logout";

describe("logout", () => {
  test("clears localStorage", () => {
    localStorage.setItem("token", "123");
    localStorage.setItem("id", "abc");
    logout();

    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("id")).toBeNull();
  });
});
