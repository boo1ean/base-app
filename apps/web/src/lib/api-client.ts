const API_BASE = '/api'

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init)
  if (!res.ok)
    throw new Error(`API ${res.status}: ${res.statusText}`)
  return res.json() as Promise<T>
}
