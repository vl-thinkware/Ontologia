import { Globe2, Trash2 } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { workspaces, activeWorkspaceId } from "../data/mock";

export default function Settings() {
  const ws = workspaces.find((w) => w.id === activeWorkspaceId)!;
  return (
    <SettingsLayout
      title="Workspace"
      description="General settings for the Thinkware workspace."
      actions={<button className="btn-primary">Save changes</button>}
    >
      <section className="card p-6">
        <h2 className="text-sm font-semibold text-ink-900">General</h2>
        <p className="mt-0.5 text-xs text-ink-500">
          Shown to members across Ontologia, the API and exports.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-5">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Workspace name
            </label>
            <input className="input" defaultValue={ws.name} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Slug
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-ink-200 bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-500/20">
              <span className="px-3 text-xs text-ink-400">
                ontologia.app/
              </span>
              <input
                className="flex-1 border-0 bg-transparent px-0 py-2 text-sm focus:outline-none"
                defaultValue="thinkware"
              />
            </div>
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Description
            </label>
            <textarea
              className="input min-h-[64px] resize-y"
              defaultValue="Internal workspace for Ontologia product development. Houses the e-commerce, CRM and knowledge-base ontologies."
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Default locale
            </label>
            <div className="relative">
              <Globe2 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <select className="input pl-9">
                <option>English — US</option>
                <option>English — GB</option>
                <option>Français</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Time zone
            </label>
            <select className="input">
              <option>Europe/Paris (UTC+02:00)</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-ink-900">Defaults</h2>
        <p className="mt-0.5 text-xs text-ink-500">
          Applied to new ontologies created in this workspace.
        </p>
        <div className="mt-4 space-y-3">
          <ToggleRow
            title="Require message on every change"
            description="Ask editors to describe the change when they save."
            defaultChecked
          />
          <ToggleRow
            title="Enable revert protection"
            description="Admins must approve reverts of tagged change events."
            defaultChecked
          />
          <ToggleRow
            title="Auto-tag weekly snapshots"
            description="Create a dated tag every Monday at 09:00 UTC."
          />
        </div>
      </section>

      <section className="rounded-xl border border-red-200 bg-red-50/50 p-6">
        <h2 className="text-sm font-semibold text-red-900">Danger zone</h2>
        <p className="mt-0.5 text-xs text-red-800/80">
          Irreversible actions. Please be careful.
        </p>
        <div className="mt-4 flex items-center justify-between rounded-lg border border-red-200 bg-white p-4">
          <div>
            <div className="text-sm font-semibold text-ink-900">
              Delete workspace
            </div>
            <p className="text-xs text-ink-600">
              Removes every ontology, change event and tag. There is no undo.
            </p>
          </div>
          <button className="btn-danger">
            <Trash2 className="h-3.5 w-3.5" />
            Delete workspace
          </button>
        </div>
      </section>
    </SettingsLayout>
  );
}

function ToggleRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-ink-200 bg-white p-3.5 hover:border-ink-300">
      <div>
        <div className="text-sm font-semibold text-ink-900">{title}</div>
        <p className="mt-0.5 text-xs text-ink-600">{description}</p>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="mt-1 h-4 w-4 accent-brand-600"
      />
    </label>
  );
}
