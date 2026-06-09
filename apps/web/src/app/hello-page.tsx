import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'

interface HealthResponse {
  status: string
  uptime: number
  timestamp: string
}

export function HelloPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: () => apiFetch<HealthResponse>('/health'),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Hello
        </h1>
        <p className="text-zinc-400 text-lg">
          Base app is running.
        </p>

        <div className="mt-8 rounded-lg border border-zinc-800 bg-zinc-900 p-6 text-left font-mono text-sm">
          <p className="text-zinc-500 mb-2">GET /api/health</p>
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
    </div>
  )
}
