import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-8 lg:px-8 lg:py-10">
      <section className="grid gap-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-pink-600">Create account</p>
          <h1 className="text-3xl font-black text-slate-900">Start building your personal movie profile.</h1>
          <p className="text-base leading-8 text-slate-600">
            Join the platform to keep track of favorites, ratings, and recommendations over time.
          </p>
        </div>

        <form className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Name
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-base" placeholder="Ava" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Email
            <input className="rounded-2xl border border-slate-300 px-4 py-3 text-base" placeholder="you@example.com" />
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Password
            <input type="password" className="rounded-2xl border border-slate-300 px-4 py-3 text-base" placeholder="••••••••" />
          </label>
          <button type="button" className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Create account
          </button>
          <p className="text-sm text-slate-600">
            Already have an account? <Link href="/login" className="font-semibold text-slate-900">Sign in</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
