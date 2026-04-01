/**
 * AuthPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Página de Login / Cadastro para app desktop.
 * Baseado no Atomic UI Kit (DM Sans + JetBrains Mono, zinc palette, zero radius).
 *
 * ESTRUTURA (view separada da lógica):
 *   • useAuth()         — hook com toda a lógica de estado e validação
 *   • LoginView         — formulário de login (puro JSX, sem estado)
 *   • RegisterView      — formulário de cadastro (puro JSX, sem estado)
 *   • AuthPage (default)— orquestra as duas views usando o hook
 *
 * COMO USAR:
 *   1. Importe AuthPage no seu roteador/shell
 *   2. Conecte onLoginSuccess / onRegisterSuccess às suas rotas
 *   3. Substitua os console.log() pelos seus serviços reais de auth
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback, type FormEvent, type ChangeEvent } from "react";

// ─── TIPOS ───────────────────────────────────────────────────────────────────

type Tab = "login" | "register";

interface LoginFields {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FieldErrors {
  [key: string]: string | undefined;
}

interface AuthHookReturn {
  tab: Tab;
  setTab: (t: Tab) => void;

  loginFields: LoginFields;
  loginErrors: FieldErrors;
  loginLoading: boolean;
  loginSuccess: boolean;
  handleLoginChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleLoginSubmit: (e: FormEvent) => void;

  registerFields: RegisterFields;
  registerErrors: FieldErrors;
  registerLoading: boolean;
  registerSuccess: boolean;
  handleRegisterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRegisterSubmit: (e: FormEvent) => void;

  showPassword: boolean;
  toggleShowPassword: () => void;
}

// ─── HOOK DE LÓGICA ──────────────────────────────────────────────────────────

function useAuth(): AuthHookReturn {
  const [tab, setTab] = useState<Tab>("login");
  const [showPassword, setShowPassword] = useState(false);

  // — Login state
  const [loginFields, setLoginFields] = useState<LoginFields>({
    email: "",
    password: "",
    remember: false,
  });
  const [loginErrors, setLoginErrors] = useState<FieldErrors>({});
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // — Register state
  const [registerFields, setRegisterFields] = useState<RegisterFields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState<FieldErrors>({});
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // — Helpers
  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Insira um e-mail válido.";

  const validatePassword = (v: string) =>
    v.length >= 8 ? undefined : "Mínimo de 8 caracteres.";

  // — Login handlers
  const handleLoginChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setLoginFields((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setLoginErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleLoginSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const errs: FieldErrors = {
        email: validateEmail(loginFields.email),
        password: validatePassword(loginFields.password),
      };
      const hasErrors = Object.values(errs).some(Boolean);
      if (hasErrors) { setLoginErrors(errs); return; }

      setLoginLoading(true);
      setLoginErrors({});
      try {
        // ── SUBSTITUA PELO SEU SERVIÇO DE AUTH ──
        await new Promise((r) => setTimeout(r, 1200));
        console.log("Login:", loginFields);
        setLoginSuccess(true);
      } catch {
        setLoginErrors({ form: "Credenciais inválidas. Tente novamente." });
      } finally {
        setLoginLoading(false);
      }
    },
    [loginFields]
  );

  // — Register handlers
  const handleRegisterChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterFields((prev) => ({ ...prev, [name]: value }));
    setRegisterErrors((prev) => ({ ...prev, [name]: undefined }));
  }, []);

  const handleRegisterSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      const errs: FieldErrors = {
        name: registerFields.name.trim().length < 2 ? "Nome muito curto." : undefined,
        email: validateEmail(registerFields.email),
        password: validatePassword(registerFields.password),
        confirmPassword:
          registerFields.password !== registerFields.confirmPassword
            ? "As senhas não coincidem."
            : undefined,
      };
      const hasErrors = Object.values(errs).some(Boolean);
      if (hasErrors) { setRegisterErrors(errs); return; }

      setRegisterLoading(true);
      setRegisterErrors({});
      try {
        // ── SUBSTITUA PELO SEU SERVIÇO DE CADASTRO ──
        await new Promise((r) => setTimeout(r, 1400));
        console.log("Register:", registerFields);
        setRegisterSuccess(true);
      } catch {
        setRegisterErrors({ form: "Não foi possível criar a conta. Tente mais tarde." });
      } finally {
        setRegisterLoading(false);
      }
    },
    [registerFields]
  );

  const toggleShowPassword = useCallback(() => setShowPassword((p) => !p), []);

  return {
    tab, setTab,
    loginFields, loginErrors, loginLoading, loginSuccess,
    handleLoginChange, handleLoginSubmit,
    registerFields, registerErrors, registerLoading, registerSuccess,
    handleRegisterChange, handleRegisterSubmit,
    showPassword, toggleShowPassword,
  };
}

// ─── COMPONENTES AUXILIARES (átomos inline) ──────────────────────────────────

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, optional, error, hint, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
        {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
        {optional && <span className="text-zinc-400 text-xs font-normal ml-1">(opcional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-red-600 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {!error && hint && <p className="text-xs text-zinc-500">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  suffix?: React.ReactNode;
}

function Input({ error, suffix, className = "", ...props }: InputProps) {
  const base =
    "w-full px-3 py-2 text-sm text-zinc-900 bg-white border placeholder:text-zinc-400 hover:border-zinc-400 focus:outline-none focus:ring-2 focus:border-transparent transition-colors";
  const ring = error
    ? "border-red-500 focus:ring-red-500"
    : "border-zinc-300 focus:ring-zinc-900";

  if (suffix) {
    return (
      <div className="relative">
        <input className={`${base} ${ring} pr-10 ${className}`} {...props} />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">{suffix}</div>
      </div>
    );
  }
  return <input className={`${base} ${ring} ${className}`} {...props} />;
}

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-2.5 bg-zinc-900 text-white text-sm font-semibold hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
    >
      {loading && (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div role="alert" className="flex gap-3 p-4 bg-green-50 border border-green-200">
      <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-sm font-semibold text-green-800">{message}</p>
      </div>
    </div>
  );
}

function FormErrorBanner({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div role="alert" className="flex gap-3 p-4 bg-red-50 border border-red-200">
      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

// ─── VIEWS (puro JSX — sem lógica de estado) ─────────────────────────────────

interface LoginViewProps {
  fields: LoginFields;
  errors: FieldErrors;
  loading: boolean;
  success: boolean;
  showPassword: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onTogglePassword: () => void;
  onGoRegister: () => void;
}

function LoginView({
  fields, errors, loading, success,
  showPassword, onChange, onSubmit, onTogglePassword, onGoRegister,
}: LoginViewProps) {
  if (success) {
    return (
      <div className="space-y-4">
        <SuccessBanner message="Login realizado com sucesso! Redirecionando…" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormErrorBanner message={errors.form} />

      <Field id="login-email" label="E-mail" required error={errors.email}>
        <Input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          value={fields.email}
          onChange={onChange}
          error={!!errors.email}
          aria-describedby={errors.email ? "login-email-err" : undefined}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field id="login-password" label="Senha" required error={errors.password}>
        <Input
          id="login-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="••••••••"
          value={fields.password}
          onChange={onChange}
          error={!!errors.password}
          aria-describedby={errors.password ? "login-password-err" : undefined}
          aria-invalid={!!errors.password}
          suffix={
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-zinc-400 hover:text-zinc-700 focus:outline-none transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <EyeIcon open={showPassword} />
            </button>
          }
        />
      </Field>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div className="relative">
            <input
              type="checkbox"
              name="remember"
              className="peer sr-only"
              checked={fields.remember}
              onChange={onChange}
            />
            <div className="w-4 h-4 border border-zinc-300 bg-white peer-checked:bg-zinc-900 peer-checked:border-zinc-900 peer-focus-visible:ring-2 peer-focus-visible:ring-zinc-900 peer-focus-visible:ring-offset-2 transition-colors flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white hidden peer-checked:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <span className="text-xs text-zinc-600">Lembrar de mim</span>
        </label>
        <button
          type="button"
          className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors"
        >
          Esqueci a senha
        </button>
      </div>

      <SubmitButton loading={loading}>
        {loading ? "Entrando…" : "Entrar"}
      </SubmitButton>

      <p className="text-xs text-center text-zinc-500">
        Não tem conta?{" "}
        <button
          type="button"
          onClick={onGoRegister}
          className="font-semibold text-zinc-900 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
        >
          Cadastre-se
        </button>
      </p>
    </form>
  );
}

interface RegisterViewProps {
  fields: RegisterFields;
  errors: FieldErrors;
  loading: boolean;
  success: boolean;
  showPassword: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onTogglePassword: () => void;
  onGoLogin: () => void;
}

function RegisterView({
  fields, errors, loading, success,
  showPassword, onChange, onSubmit, onTogglePassword, onGoLogin,
}: RegisterViewProps) {
  if (success) {
    return (
      <div className="space-y-4">
        <SuccessBanner message="Conta criada! Verifique seu e-mail para ativar o acesso." />
        <p className="text-xs text-center text-zinc-500">
          Já verificou?{" "}
          <button
            type="button"
            onClick={onGoLogin}
            className="font-semibold text-zinc-900 hover:underline focus:outline-none"
          >
            Fazer login
          </button>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <FormErrorBanner message={errors.form} />

      <Field id="reg-name" label="Nome completo" required error={errors.name} hint="Como aparece no seu perfil.">
        <Input
          id="reg-name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ana Barros"
          value={fields.name}
          onChange={onChange}
          error={!!errors.name}
          aria-invalid={!!errors.name}
        />
      </Field>

      <Field id="reg-email" label="E-mail" required error={errors.email}>
        <Input
          id="reg-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="voce@empresa.com"
          value={fields.email}
          onChange={onChange}
          error={!!errors.email}
          aria-invalid={!!errors.email}
        />
      </Field>

      <Field id="reg-password" label="Senha" required error={errors.password} hint="Mínimo 8 caracteres.">
        <Input
          id="reg-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          value={fields.password}
          onChange={onChange}
          error={!!errors.password}
          aria-invalid={!!errors.password}
          suffix={
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-zinc-400 hover:text-zinc-700 focus:outline-none transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <EyeIcon open={showPassword} />
            </button>
          }
        />
      </Field>

      <Field id="reg-confirm" label="Confirmar senha" required error={errors.confirmPassword}>
        <Input
          id="reg-confirm"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          value={fields.confirmPassword}
          onChange={onChange}
          error={!!errors.confirmPassword}
          aria-invalid={!!errors.confirmPassword}
        />
      </Field>

      <SubmitButton loading={loading}>
        {loading ? "Criando conta…" : "Criar conta"}
      </SubmitButton>

      <p className="text-xs text-center text-zinc-500">
        Já tem conta?{" "}
        <button
          type="button"
          onClick={onGoLogin}
          className="font-semibold text-zinc-900 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1"
        >
          Fazer login
        </button>
      </p>
    </form>
  );
}

// ─── PAGE PRINCIPAL ───────────────────────────────────────────────────────────

export default function AuthPage() {
  const auth = useAuth();

  return (
    <div
      className="min-h-screen bg-zinc-50 flex"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ── Painel esquerdo (branding) ── */}
      <aside className="hidden lg:flex lg:w-[420px] xl:w-[480px] bg-zinc-900 flex-col justify-between p-10 flex-shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-zinc-50 grid place-items-center flex-shrink-0">
            <div className="w-2 h-2 bg-green-400" />
          </div>
          <span className="text-white text-sm font-semibold tracking-tight">
            Seu App
          </span>
          <span
            className="text-zinc-400 text-[10px] bg-zinc-800 px-1.5 py-0.5"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            desktop
          </span>
        </div>

        {/* Headline */}
        <div className="space-y-6">
          <p
            className="text-xs font-semibold uppercase tracking-widest text-zinc-500"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Bem-vindo de volta
          </p>
          <h1 className="text-4xl font-bold tracking-tight leading-tight text-white">
            Tudo o que você<br />precisa, em um<br />só lugar.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
            Acesse seu espaço de trabalho, gerencie projetos e colabore com sua equipe sem sair do desktop.
          </p>

          {/* Feature list */}
          <ul className="space-y-3 pt-2">
            {[
              "Projetos e tarefas centralizados",
              "Colaboração em tempo real",
              "Integração com suas ferramentas",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 bg-green-400 flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer branding */}
        <p
          className="text-xs text-zinc-600"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          © {new Date().getFullYear()} Seu App · v1.0
        </p>
      </aside>

      {/* ── Painel direito (formulário) ── */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-10">
          <div className="w-6 h-6 bg-zinc-900 grid place-items-center flex-shrink-0">
            <div className="w-2 h-2 bg-green-400" />
          </div>
          <span className="text-zinc-900 text-sm font-semibold tracking-tight">Seu App</span>
        </div>

        <div className="w-full max-w-sm">
          {/* Tab switcher */}
          <div className="flex border border-zinc-200 bg-white mb-8">
            {(["login", "register"] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => auth.setTab(t)}
                className={`flex-1 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-zinc-900 ${
                  auth.tab === t
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
                aria-pressed={auth.tab === t}
              >
                {t === "login" ? "Entrar" : "Cadastrar"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">
              {auth.tab === "login" ? "Acessar conta" : "Criar conta"}
            </h2>
            <p className="text-sm text-zinc-500 mt-1">
              {auth.tab === "login"
                ? "Insira suas credenciais para continuar."
                : "Preencha os dados para começar."}
            </p>
          </div>

          {/* Form views */}
          {auth.tab === "login" ? (
            <LoginView
              fields={auth.loginFields}
              errors={auth.loginErrors}
              loading={auth.loginLoading}
              success={auth.loginSuccess}
              showPassword={auth.showPassword}
              onChange={auth.handleLoginChange}
              onSubmit={auth.handleLoginSubmit}
              onTogglePassword={auth.toggleShowPassword}
              onGoRegister={() => auth.setTab("register")}
            />
          ) : (
            <RegisterView
              fields={auth.registerFields}
              errors={auth.registerErrors}
              loading={auth.registerLoading}
              success={auth.registerSuccess}
              showPassword={auth.showPassword}
              onChange={auth.handleRegisterChange}
              onSubmit={auth.handleRegisterSubmit}
              onTogglePassword={auth.toggleShowPassword}
              onGoLogin={() => auth.setTab("login")}
            />
          )}

          {/* Divisor + SSO (opcional — remova se não usar) */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 border-t border-zinc-200" />
            <span className="text-xs text-zinc-400" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              ou
            </span>
            <div className="flex-1 border-t border-zinc-200" />
          </div>

          <button
            type="button"
            className="mt-4 w-full py-2.5 border border-zinc-300 bg-white text-sm font-medium text-zinc-700 hover:border-zinc-400 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar com Google
          </button>
        </div>
      </main>
    </div>
  );
}
