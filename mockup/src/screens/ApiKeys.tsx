import { Plus, Copy, Trash2, BookOpen } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { apiKeys } from "../data/mock";

export default function ApiKeys() {
  return (
    <SettingsLayout
      title="API keys"
      description="Server-side keys for reading and writing ontologies from your pipelines."
      actions={
        <button className="btn-primary">
          <Plus className="h-3.5 w-3.5" />
          Create key
        </button>
      }
    >
      <section className="card p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <BookOpen className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-ink-900">
              Authenticate requests
            </h2>
            <p className="mt-1 text-xs text-ink-600">
              Pass the key in the <code>Authorization</code> header. Keys are
              scoped per workspace and never expire unless revoked.
            </p>
            <pre className="mt-3 overflow-x-auto rounded-lg border border-ink-200 bg-ink-900 px-3 py-2 font-mono text-[11.5px] leading-relaxed text-ink-100">
{`curl https://api.ontologia.app/v1/ontologies \\
  -H "Authorization: Bearer ont_live_8f2a…"`}
            </pre>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">
              Active keys ({apiKeys.length})
            </h2>
            <p className="text-xs text-ink-500">
              Rotate keys at least every 90 days.
            </p>
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-ink-50/60 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-2.5 text-left">Name</th>
              <th className="px-5 py-2.5 text-left">Key</th>
              <th className="px-5 py-2.5 text-left">Scopes</th>
              <th className="px-5 py-2.5 text-left">Last used</th>
              <th className="px-5 py-2.5 text-left">Created</th>
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            {apiKeys.map((k, i) => (
              <tr
                key={k.id}
                className={i !== 0 ? "border-t border-ink-100" : ""}
              >
                <td className="px-5 py-3">
                  <div className="text-[13px] font-semibold text-ink-900">
                    {k.name}
                  </div>
                  <div className="text-[11.5px] text-ink-500">
                    by {k.createdBy}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <code className="rounded-md border border-ink-200 bg-ink-50 px-2 py-0.5 font-mono text-[11.5px] text-ink-700">
                      {k.prefix}••••••••
                    </code>
                    <button
                      title="Copy prefix"
                      className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex flex-wrap gap-1">
                    {k.scopes.map((s) => (
                      <span
                        key={s}
                        className="chip bg-ink-100 text-ink-700 font-mono text-[10px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {k.lastUsed}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {k.createdAt}
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-md p-1.5 text-ink-400 hover:bg-red-50 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-5">
        <h2 className="text-sm font-semibold text-ink-900">Webhooks</h2>
        <p className="mt-0.5 text-xs text-ink-500">
          Push change events to your own infrastructure.
        </p>
        <div className="mt-4 rounded-lg border border-dashed border-ink-300 bg-ink-50/50 p-6 text-center">
          <p className="text-[12.5px] text-ink-600">
            No webhooks configured yet.{" "}
            <a
              href="#"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Add your first endpoint →
            </a>
          </p>
        </div>
      </section>
    </SettingsLayout>
  );
}
