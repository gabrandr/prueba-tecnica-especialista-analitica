import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { makeClient, reportFixture } from '../test/fixtures'
import { DashboardView } from './DashboardView'

describe('DashboardView', () => {
  it('filtra, limpia resultados y reinicia la paginación', async () => {
    const clients = Array.from({ length: 12 }, (_, index) => makeClient({
      cliente_id: `C${String(index + 1).padStart(6, '0')}`, nombre_cliente: index === 11 ? 'Caso Loja' : `Cliente ${index + 1}`, ciudad: index === 11 ? 'Loja' : 'Guayaquil',
    }))
    const user = userEvent.setup()
    render(<DashboardView data={{ clients, qualityReport: reportFixture }} onLogout={vi.fn()} powerBIConfig={{}} />)
    await user.click(screen.getByRole('button', { name: 'Siguiente →' }))
    expect(screen.getByText('Página 2 de 2')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Buscar cliente'), 'caso loja')
    expect(screen.getByText('Página 1 de 1')).toBeInTheDocument()
    expect(screen.getAllByText('Caso Loja').length).toBeGreaterThan(0)
    await user.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(screen.getByText(/clientes visibles/)).toHaveTextContent('12 clientes visibles')
  })

  it('muestra cero resultados y Power BI no configurado', async () => {
    const user = userEvent.setup()
    render(<DashboardView data={{ clients: [makeClient()], qualityReport: reportFixture }} onLogout={vi.fn()} powerBIConfig={{}} />)
    await user.type(screen.getByLabelText('Buscar cliente'), 'imposible')
    expect(screen.getByRole('heading', { name: 'Sin coincidencias' })).toBeInTheDocument()
    expect(screen.getByText('Reporte no configurado')).toBeInTheDocument()
  })

  it('renderiza Power BI con una URL HTTPS válida', () => {
    render(<DashboardView data={{ clients: [makeClient()], qualityReport: reportFixture }} onLogout={vi.fn()} powerBIConfig={{ embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=demo' }} />)
    expect(screen.getByTitle('Reporte Power BI de Digotec Analytics')).toBeInTheDocument()
  })
})
