import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import "@xyflow/react/dist/style.css";
import "./index.css";
import Shell from "./components/Shell";
import SignIn from "./screens/SignIn";
import Dashboard from "./screens/Dashboard";
import Editor from "./screens/Editor";
import ImportWizard from "./screens/ImportWizard";
import Settings from "./screens/Settings";
import Billing from "./screens/Billing";
import Members from "./screens/Members";
import ApiKeys from "./screens/ApiKeys";
import ConceptDetail from "./screens/ConceptDetail";
import { AppProvider } from "./app/AppContext";

const router = createBrowserRouter([
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/",
    element: <Shell />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "ontologies/:id", element: <Editor /> },
      {
        path: "ontologies/:id/concepts/:conceptId",
        element: <ConceptDetail />,
      },
      { path: "import", element: <ImportWizard /> },
      { path: "settings", element: <Settings /> },
      { path: "settings/members", element: <Members /> },
      { path: "settings/api-keys", element: <ApiKeys /> },
      { path: "settings/billing", element: <Billing /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </React.StrictMode>
);
