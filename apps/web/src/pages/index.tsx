import { useQuery } from '@tanstack/react-query'
import { orpc } from '@/lib/api-client'

export default function HomePage() {
  const health = useQuery(orpc.health.queryOptions())

  return (
    <div className="text-center space-y-6">
      <h1 className="text-5xl font-bold tracking-tight">
        Hello
      </h1>
      <p className="text-zinc-400 text-lg">
        Base app is running.
      </p>

      <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left font-mono text-sm">
        <p className="text-zinc-500 mb-2">rpc health</p>
        {health.isLoading && (
          <p className="text-zinc-400">connecting...</p>
        )}
        {health.isError && (
          <p className="text-red-400">
            offline —
            {' '}
            {health.error.message}
          </p>
        )}
        {health.data && (
          <pre className="text-emerald-400">
            {JSON.stringify(health.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  )
}
