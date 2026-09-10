import { useRef, useState, type FormEvent } from 'react'

import styles from './LoginView.module.css'

export const DEMO_EMAIL = 'analista@digotec.demo'
export const DEMO_PASSWORD = 'Digotec2026!'

interface LoginViewProps {
  onLogin: () => void
}

export function LoginView({ onLogin }: LoginViewProps) {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
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
      <header className={styles.masthead}>
        <div className={styles.brand}>
          <span className={styles.brandMark} aria-hidden="true">D</span>
          <div className={styles.brandText}>
            <strong>Digotec Analytics</strong>
            <small>Cliente 360</small>
          </div>
        </div>
        <p className={styles.folio}>Demo · 31 ago 2026</p>
      </header>

      <div className={styles.desk}>
        <section className={styles.dossier} aria-labelledby="access-title">
          <p className={styles.step}>Acceso de demostración</p>
          <h1 id="access-title">Ingresar al tablero</h1>
          <p className={styles.helper}>Las credenciales ya están cargadas. Entra y recorre los 2.200 perfiles.</p>

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

            <div className={styles.passwordHead}>
              <label htmlFor="password">Contraseña</label>
              <button
                type="button"
                className={styles.reveal}
                aria-pressed={showPassword}
                aria-controls="password"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
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

            <button type="submit">Ingresar al dashboard</button>
          </form>

          <aside className={styles.credentials} aria-label="Credenciales de demostración">
            <p>Uso interno</p>
            <span>Correo</span><code>{DEMO_EMAIL}</code>
            <span>Contraseña</span><code>{DEMO_PASSWORD}</code>
          </aside>
        </section>

        <aside className={styles.facts} aria-label="Contexto de la cartera">
          <p className={styles.figure}>
            <strong aria-hidden="true">2.200</strong>
            <span>perfiles en cartera</span>
          </p>
          <p className={styles.intro}>
            Lectura de tenencia, uso y siguiente acción sobre una base sintética.
          </p>
          <dl className={styles.context}>
            <div><dt>Clientes</dt><dd>2.200</dd></div>
            <div><dt>Base</dt><dd>Sintética</dd></div>
            <div><dt>Corte</dt><dd>31 ago 2026</dd></div>
          </dl>
          <p className={styles.warning}>
            Este acceso solo controla la experiencia local. No es autenticación bancaria ni productiva.
          </p>
        </aside>
      </div>
    </main>
  )
}
