import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App, { AUTH_STORAGE_KEY } from './App'
import { makeFullClientList, reportFixture } from './test/fixtures'

const successfulFetch = vi.fn((url: string) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(url.includes('clientes') ? makeFullClientList() : reportFixture),
}))

describe('acceso demostrativo y carga', () => {
  beforeEach(() => {
    sessionStorage.clear()
    successfulFetch.mockClear()
    vi.stubGlobal('fetch', successfulFetch)
  })

  it('rechaza credenciales incorrectas con un mensaje accesible', async () => {
    const user = userEvent.setup()
    render(<App />)
    const password = screen.getByLabelText('Contraseña')
    await user.clear(password)
    await user.type(password, 'incorrecta')
    await user.click(screen.getByRole('button', { name: /ingresar al dashboard/i }))
    expect(await screen.findByRole('alert')).toHaveTextContent('no coinciden')
  })

  it('inicia y cierra sesión guardando solo el marcador de autenticación', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /ingresar al dashboard/i }))
    expect(await screen.findByRole('heading', { name: 'Panorama de clientes' })).toBeInTheDocument()
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBe('authenticated')
    expect(sessionStorage.length).toBe(1)
    expect(sessionStorage.key(0)).toBe(AUTH_STORAGE_KEY)
    expect(Array.from({ length: sessionStorage.length }, (_, index) => sessionStorage.getItem(sessionStorage.key(index) ?? ''))).not.toContain('Digotec2026!')
    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('heading', { name: 'Ingresar al tablero' })).toBeInTheDocument()
    expect(sessionStorage.getItem(AUTH_STORAGE_KEY)).toBeNull()
  })

  it('anuncia el estado de carga mientras espera los archivos', () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated')
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)))
    render(<App />)
    expect(screen.getByText('Preparando la vista de clientes…')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true')
  })

  it('restaura la sesión y permite reintentar un error de red', async () => {
    sessionStorage.setItem(AUTH_STORAGE_KEY, 'authenticated')
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: false })
      .mockImplementation((url: string) => Promise.resolve({ ok: true, json: () => Promise.resolve(url.includes('clientes') ? makeFullClientList() : reportFixture) }))
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'No pudimos cargar los datos' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Reintentar carga' }))
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Panorama de clientes' })).toBeInTheDocument())
  })
})
