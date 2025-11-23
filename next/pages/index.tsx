import React, { useEffect, useState } from 'react'
import { api } from '../services/apiService'

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const u = await api.checkSession()
        setUser(u)
      } catch (e) {
        setError((e as Error).message || 'Sem sessão')
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  return (
    <main style={{ padding: 24, fontFamily: 'Inter, sans-serif' }}>
      <h1>PriceCompass — Next.js (Teste Seguro)</h1>
      <p>
        Backend base: <code>{api.baseUrl}</code>
      </p>
      {loading && <p>Carregando...</p>}
      {error && <p style={{ color: 'crimson' }}>Erro: {error}</p>}
      {user ? (
        <section>
          <h2>Usuário</h2>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </section>
      ) : (
        <div>
          <p>Nenhum usuário autenticado — faça login no frontend principal ou use a API.</p>
        </div>
      )}
    </main>
  )
}
