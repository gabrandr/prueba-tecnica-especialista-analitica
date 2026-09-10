import { useRef, useState, type FormEvent } from 'react'

import styles from './LoginView.module.css'

export const DEMO_EMAIL = 'analista@digotec.demo'
export const DEMO_PASSWORD = 'Digotec2026!'

interface LoginViewProps {
  onLogin: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [error, setError] = useState('')
  const errorRef = useRef<HTMLParagraphElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    if (form.get('email') === DEMO_EMAIL && form.get('password') === DEMO_PASSWORD) {
      setError('')
      onLogin()
      return
    }
    setError('Las credenciales no coinciden con el acceso de demostración.')
    requestAnimationFrame(() => errorRef.current?.focus())
  }

  return (
    <main className={styles.page}>
      <section className={styles.story} aria-labelledby="login-title">
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">D</span>
          <span>Digotec Analytics</span>
        </div>
        <p className={styles.eyebrow}>Inteligencia de clientes 360</p>
        <h1 id="login-title">Decisiones claras, desde una cartera compleja.</h1>
        <p className={styles.intro}>
          Una lectura ejecutiva de productos, comportamiento y oportunidades sobre
          2.200 perfiles sintéticos.
        </p>
        <dl className={styles.context}>
          <div><dt>Base</dt><dd>Datos sintéticos</dd></div>
          <div><dt>Fecha de corte</dt><dd>31 de agosto de 2026</dd></div>
        </dl>
      </section>

      <section className={styles.access} aria-labelledby="access-title">
        <div>
          <p className={styles.step}>Acceso de demostración</p>
          <h2 id="access-title">Ingresar al tablero</h2>
          <p className={styles.helper}>Usa las credenciales visibles para explorar el MVP.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            defaultValue={DEMO_EMAIL}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'login-error' : undefined}
          />
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            defaultValue={DEMO_PASSWORD}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'login-error' : undefined}
          />
          {error ? (
            <p id="login-error" className={styles.error} role="alert" tabIndex={-1} ref={errorRef}>
              {error}
            </p>
          ) : null}
          <button type="submit">Ingresar al dashboard <span aria-hidden="true">→</span></button>
        </form>

        <aside className={styles.credentials} aria-label="Credenciales de demostración">
          <span>Correo</span><code>{DEMO_EMAIL}</code>
          <span>Contraseña</span><code>{DEMO_PASSWORD}</code>
        </aside>
        <p className={styles.warning}>
          Este acceso solo controla la experiencia local. No es autenticación bancaria ni productiva.
        </p>
      </section>
    </main>
  )
}
