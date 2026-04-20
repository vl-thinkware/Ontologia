import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Network, Loader2, Github, ArrowRight } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("valentin@thinkware.fr");
  const [password, setPassword] = useState("demo-password");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate("/dashboard"), 600);
  }

  return (
    <div className="flex min-h-full bg-ink-50">
      {/* Left: form */}
      <div className="flex flex-1 flex-col px-6 py-10 sm:px-10">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-800 text-white shadow-sm">
            <Network className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-ink-900">
            Ontologia
          </span>
        </Link>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center">
          <h1 className="text-2xl font-bold tracking-tight text-ink-900">
            Sign in to your workspace
          </h1>
          <p className="mt-1.5 text-sm text-ink-600">
            Welcome back. Enter your credentials to access your ontologies.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <button className="btn-secondary">
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.07 5.07 0 0 1-2.2 3.33v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.11Z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.99.66-2.25 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.83Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.62 0 3.06.56 4.2 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.07l3.66 2.83C6.71 6.68 9.14 4.75 12 4.75Z"
                />
              </svg>
              Google
            </button>
            <button className="btn-secondary">
              <Github className="h-4 w-4" />
              GitHub
            </button>
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-ink-400">
              or
            </span>
            <div className="h-px flex-1 bg-ink-200" />
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">
                Work email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                autoComplete="email"
              />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="block text-xs font-semibold text-ink-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-brand-700 hover:text-brand-800"
                >
                  Forgot?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-600">
            New to Ontologia?{" "}
            <a
              href="#"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Create a workspace
            </a>
          </p>
        </div>

        <div className="mx-auto flex w-full max-w-sm items-center justify-between text-xs text-ink-400">
          <span>© 2026 Thinkware SAS</span>
          <div className="flex gap-3">
            <a href="#" className="hover:text-ink-600">
              Privacy
            </a>
            <a href="#" className="hover:text-ink-600">
              Terms
            </a>
            <a href="#" className="hover:text-ink-600">
              Status
            </a>
          </div>
        </div>
      </div>

      {/* Right: marketing panel */}
      <div className="relative hidden flex-1 overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-950 lg:block">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,.15) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Private beta — April 2026
            </div>
            <h2 className="mt-6 text-3xl font-bold leading-tight tracking-tight">
              The ontology platform for teams building knowledge-rich AI
              products.
            </h2>
            <p className="mt-4 text-brand-100/90">
              Version your concepts and relations, review changes, and ship the
              right schema to your RAG pipeline — without the enterprise
              graph-DB tax.
            </p>
          </div>

          <figure className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <blockquote className="text-sm leading-relaxed text-brand-50">
              “We consolidated four scattered Google Sheets into a single source
              of truth for our product taxonomy. Ontologia is the first tool
              that feels built for AI teams, not database admins.”
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-3 text-xs">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 font-semibold">
                CM
              </div>
              <div>
                <div className="font-semibold">Claire Moreau</div>
                <div className="text-brand-200">Head of AI, Aurelia Retail</div>
              </div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
