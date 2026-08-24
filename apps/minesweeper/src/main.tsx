import { ThemeProvider } from "@core/ui";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";

import { App } from "./App.tsx";
import { Menu } from "./pages/menu.tsx";

import "./index.css";
import { Game } from "./pages/game.tsx";
import { Leaderboard } from "./pages/leaderboard.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: Menu,
      },
      {
        path: "game",
        Component: Game,
      },
      {
        path: "leaderboard",
        Component: Leaderboard,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);
