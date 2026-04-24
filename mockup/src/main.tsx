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
import { PresenceProvider } from "./app/PresenceProvider";

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
      // Ontology views are path segments so the sidebar can deep-link
      // straight into Canvas / Taxonomies / Tables / Schema. A bare
      // /ontologies/:id redirects to the ontology's mode-default view via
      // the <Navigate> branch inside Editor.
      { path: "ontologies/:id", element: <Editor /> },
      { path: "ontologies/:id/canvas", element: <Editor /> },
      { path: "ontologies/:id/tree", element: <Editor /> },
      { path: "ontologies/:id/table", element: <Editor /> },
      { path: "ontologies/:id/schema", element: <Editor /> },
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
      <PresenceProvider>
        <RouterProvider router={router} />
      </PresenceProvider>
    </AppProvider>
  </React.StrictMode>
);
