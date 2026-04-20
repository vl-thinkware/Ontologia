import { UserPlus, MoreHorizontal, Mail } from "lucide-react";
import SettingsLayout from "../components/SettingsLayout";
import { members } from "../data/mock";

export default function Members() {
  return (
    <SettingsLayout
      title="Members"
      description="Unlimited seats on the Team plan. Invite anyone on your team."
      actions={
        <button className="btn-primary">
          <UserPlus className="h-3.5 w-3.5" />
          Invite people
        </button>
      }
    >
      <section className="card p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-ink-900">
              Invite by email
            </div>
            <p className="text-xs text-ink-500">
              New teammates receive an email to join <strong>Thinkware</strong>.
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            placeholder="name@company.com, another@company.com…"
            className="input flex-1"
          />
          <select className="input w-40">
            <option>Editor</option>
            <option>Viewer</option>
            <option>Owner</option>
          </select>
          <button className="btn-primary">Send invites</button>
        </div>
      </section>

      <section className="card">
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3.5">
          <div>
            <h2 className="text-sm font-semibold text-ink-900">
              {members.length} members
            </h2>
            <p className="text-xs text-ink-500">
              Includes 1 pending invitation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select className="input w-36 py-1.5 text-[12px]">
              <option>All roles</option>
              <option>Owners</option>
              <option>Editors</option>
              <option>Viewers</option>
            </select>
            <input
              placeholder="Search…"
              className="input w-48 py-1.5 text-[12px]"
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-ink-50/60 text-[11px] font-semibold uppercase tracking-wider text-ink-500">
            <tr>
              <th className="px-5 py-2.5 text-left">Member</th>
              <th className="px-5 py-2.5 text-left">Role</th>
              <th className="px-5 py-2.5 text-left">Last active</th>
              <th className="px-5 py-2.5 text-left">Invited</th>
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            {members.map((m, i) => (
              <tr
                key={m.email}
                className={i !== 0 ? "border-t border-ink-100" : ""}
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                      style={{ background: m.color }}
                    >
                      {m.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-ink-900">
                        {m.name}
                      </div>
                      <div className="truncate text-[11.5px] text-ink-500">
                        {m.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <select
                    defaultValue={m.role}
                    className={`rounded-md border px-2 py-1 text-[12px] font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/15 ${
                      m.role === "Owner"
                        ? "border-brand-200 bg-brand-50 text-brand-700"
                        : "border-ink-200 bg-white text-ink-700"
                    }`}
                  >
                    <option>Owner</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {m.lastActive}
                </td>
                <td className="px-5 py-3 text-[12px] text-ink-600">
                  {m.invitedAt}
                </td>
                <td className="px-5 py-3 text-right">
                  <button className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-ink-100">
              <td className="px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-200 text-[11px] font-semibold text-ink-500">
                    ?
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink-900">
                      sofia@thinkware.fr
                    </div>
                    <div className="text-[11.5px] text-ink-500">
                      Invitation sent · awaiting acceptance
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-5 py-3">
                <span className="chip bg-amber-50 text-amber-700">Pending</span>
              </td>
              <td className="px-5 py-3 text-[12px] text-ink-400">—</td>
              <td className="px-5 py-3 text-[12px] text-ink-600">2026-04-19</td>
              <td className="px-5 py-3 text-right">
                <button className="text-[12px] font-semibold text-brand-700 hover:text-brand-800">
                  Resend
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </SettingsLayout>
  );
}
