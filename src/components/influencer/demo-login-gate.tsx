import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { KeyRound, Lock, ShieldCheck, User } from "lucide-react";

/**
 * DEMO-ONLY access screen. Credentials are fixed and checked in the browser,
 * so this is a presentation gate, not real security.
 */
export const DEMO_CREDENTIALS = {
  username: "Softwarevala@admim.com",
  password: "softwarevala#123456",
  licenseKey: "2345-3456-4567",
  backupKey: "5678-2345-3456",
} as const;

export const DEMO_SESSION_KEY = "im-demo-super-admin";

const norm = (v: string) => v.trim();

export function checkDemoCredentials(input: {
  username: string;
  password: string;
  licenseKey: string;
  backupKey: string;
}) {
  return (
    norm(input.username).toLowerCase() === DEMO_CREDENTIALS.username.toLowerCase() &&
    input.password === DEMO_CREDENTIALS.password &&
    norm(input.licenseKey) === DEMO_CREDENTIALS.licenseKey &&
    norm(input.backupKey) === DEMO_CREDENTIALS.backupKey
  );
}

export function DemoLoginGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [form, setForm] = useState({ username: "", password: "", licenseKey: "", backupKey: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    setAuthed(sessionStorage.getItem(DEMO_SESSION_KEY) === "1");
    setReady(true);
  }, []);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!checkDemoCredentials(form)) {
      setError("Invalid username, password, license key or backup key.");
      return;
    }
    sessionStorage.setItem(DEMO_SESSION_KEY, "1");
    setAuthed(true);
  };

  if (!ready) return null;
  if (authed) return <>{children}</>;

  const field = (
    key: keyof typeof form,
    label: string,
    icon: ReactNode,
    type = "text",
    placeholder = "",
  ) => (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="flex h-10 items-center gap-2 rounded-md border border-border bg-background px-3 focus-within:border-primary">
        <span className="text-muted-foreground">{icon}</span>
        <input
          aria-label={label}
          type={type}
          value={form[key]}
          placeholder={placeholder}
          autoComplete="off"
          onChange={(e) => {
            setError("");
            setForm({ ...form, [key]: e.target.value });
          }}
          className="flex-1 bg-transparent text-[13.5px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </span>
    </label>
  );

  return (
    <div className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <form
        onSubmit={submit}
        className="surface-sheen w-full max-w-[420px] space-y-4 rounded-xl border border-border bg-surface p-6 shadow-xl"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-[18px] font-semibold">Super Admin Login</h1>
            <p className="text-[12.5px] text-muted-foreground">Influencer Manager · Demo access</p>
          </div>
        </div>
        {field("username", "Username", <User className="h-4 w-4" />, "email", "name@company.com")}
        {field("password", "Password", <Lock className="h-4 w-4" />, "password")}
        {field("licenseKey", "12-Digit License Key", <KeyRound className="h-4 w-4" />, "text", "XXXX-XXXX-XXXX")}
        {field("backupKey", "Backup Key", <KeyRound className="h-4 w-4" />, "text", "XXXX-XXXX-XXXX")}
        {error && (
          <p role="alert" className="text-[12.5px] text-destructive">
            {error}
          </p>
        )}
        <button
          type="submit"
          className="h-10 w-full rounded-md bg-primary text-[13.5px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
