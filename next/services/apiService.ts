const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('jwt')
}

export function saveToken(token: string) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem('jwt', token)
}

export function clearToken() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem('jwt')
}

async function request(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(options.headers as any || {}) }
  const token = getToken()
  if (token) headers['Authorization'] = 'Bearer ' + token

  const res = await fetch(baseUrl + path, {
    headers,
    credentials: 'include',
    ...options,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `${res.status} ${res.statusText}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  baseUrl,
  checkSession: async () => {
    return request('/user/me', { method: 'GET' })
  },
  login: async (email: string, password: string) => {
    const resp: any = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    if (resp && resp.token) saveToken(resp.token)
    return resp
  },
  register: async (email: string, password: string) => {
    const resp: any = await request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) })
    if (resp && resp.token) saveToken(resp.token)
    return resp
  },
}

export default api
