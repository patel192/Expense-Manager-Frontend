import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../redux/store";

/* Custom render */

const renderWithProviders = (ui) => {
  return render(
    <Provider store={store}>
      {ui}
    </Provider>
  );
};

export * from "@testing-library/react";

export { renderWithProviders };