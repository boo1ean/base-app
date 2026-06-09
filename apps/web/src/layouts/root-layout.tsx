import { Link, Outlet } from 'react-router'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 px-6 py-4">
        <nav className="mx-auto flex max-w-4xl items-center gap-6">
          <Link to="/" className="text-sm font-semibold tracking-tight hover:text-zinc-300">
            base-app
          </Link>
          <Link to="/about" className="text-sm text-zinc-400 hover:text-zinc-200">
            About
          </Link>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 items-center justify-center px-6 py-12">
        <Outlet />
      </main>
    </div>
  )
}
