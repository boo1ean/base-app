import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-6xl font-bold tracking-tight">404</h1>
      <p className="text-zinc-400 text-lg">Page not found.</p>
      <Link to="/" className="inline-block text-emerald-400 hover:text-emerald-300 underline underline-offset-4">
        Go home
      </Link>
    </div>
  )
}
