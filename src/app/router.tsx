import {
  createBrowserRouter,
  createMemoryRouter,
  Navigate,
  type InitialEntry,
} from "react-router-dom";
import { PageLayout } from "../components/layout/PageLayout";
import { HomePage } from "../pages/HomePage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { landingHref, legacyLandingSections } from "./landingSections";

const children = [
  { index: true as const, element: <HomePage /> },
  ...legacyLandingSections.map(({ legacyPath, id }) => ({
    path: legacyPath.slice(1),
    element: <Navigate to={landingHref(id)} replace />,
  })),
  { path: "*", element: <NotFoundPage /> },
];
const config = [{ path: "/", element: <PageLayout />, children }];

export const router = createBrowserRouter(config);
export function createAppRouter(initialEntries: InitialEntry[]) {
  return createMemoryRouter(config, { initialEntries });
}
