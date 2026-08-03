import { Link } from "@tanstack/react-router";
import {
  Search, Bell, Globe, ChevronDown, LifeBuoy, Settings, User,
  LayoutDashboard, Crown, ShieldCheck, KeyRound, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n, LANGUAGES, CURRENCIES } from "@/lib/i18n/I18nProvider";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function TopBar({ onOpenMenu }: { onOpenMenu?: () => void }) {
  const { language, currency, setLanguage, setCurrency, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <button
          className="lg:hidden grid place-items-center h-9 w-9 rounded-lg border border-border shrink-0"
          onClick={onOpenMenu}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link to="/" className="lg:hidden flex items-center gap-2 shrink-0">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground font-bold">
            SV
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 w-56 lg:w-72 2xl:w-96 transition-colors focus-within:border-primary/50">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            placeholder={t("search", "Search…")}
            className="bg-transparent text-sm outline-none placeholder:text-muted-foreground flex-1 min-w-0"
          />
          <kbd className="hidden 2xl:inline text-[10px] text-muted-foreground border border-border px-1.5 rounded">⌘K</kbd>
        </div>

        <div className="flex-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden lg:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label={t("language", "Language")}>
              <Globe className="h-3.5 w-3.5" /> {language.code.toUpperCase()}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel>{t("language", "Language")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {LANGUAGES.map((l) => (
              <DropdownMenuItem
                key={l.code}
                onSelect={() => setLanguage(l.code)}
                className={cn("justify-between gap-2", language.code === l.code && "bg-primary/10 text-foreground")}
              >
                <span className="truncate">{l.native}</span>
                <span className="text-[10px] uppercase text-muted-foreground">{l.code}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="hidden lg:flex items-center gap-1 rounded-full border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors" aria-label={t("currency", "Currency")}>
              <span className="font-semibold">{currency.symbol}</span> {currency.code}
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 max-h-[70vh] overflow-y-auto">
            <DropdownMenuLabel>{t("currency", "Currency")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {CURRENCIES.map((c) => (
              <DropdownMenuItem
                key={c.code}
                onSelect={() => setCurrency(c.code)}
                className={cn("justify-between gap-2", currency.code === c.code && "bg-primary/10 text-foreground")}
              >
                <span className="truncate">{c.label}</span>
                <span className="text-[10px] font-semibold">{c.symbol} {c.code}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/support" className="hidden lg:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors" aria-label="Support">
          <LifeBuoy className="h-4 w-4" />
        </Link>
        <Link to="/notifications" className="relative grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-pink" />
        </Link>
        <Link to="/settings" className="hidden lg:grid place-items-center h-9 w-9 rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="group flex items-center gap-2.5 rounded-full bg-surface border border-border pl-1 pr-2 sm:pr-3 py-1 shrink-0 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-200"
              aria-label="Boss profile menu"
            >
              <span className="relative shrink-0">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-accent-pink via-primary to-primary-glow text-primary-foreground text-[11px] font-bold ring-1 ring-white/10">
                  BV
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-accent-emerald ring-2 ring-background" aria-label="Online" />
              </span>
              <span className="hidden sm:flex flex-col items-start leading-tight min-w-0">
                <span className="text-xs font-semibold truncate max-w-[120px]">Boss Vala</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 text-primary px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide">
                  <Crown className="h-2.5 w-2.5" /> Founder
                </span>
              </span>
              <ChevronDown className="hidden sm:block h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden shadow-2xl">
            <div className="p-4 bg-gradient-to-br from-primary/15 via-accent-pink/10 to-transparent border-b border-border">
              <div className="flex items-center gap-3">
                <span className="relative shrink-0">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-accent-pink via-primary to-primary-glow text-primary-foreground text-sm font-bold ring-1 ring-white/10">
                    BV
                  </span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-accent-emerald ring-2 ring-popover" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">Boss Vala</div>
                  <div className="text-[11px] text-muted-foreground truncate">boss@softwarevala.com</div>
                  <div className="mt-1 flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 text-primary text-[10px] font-semibold px-1.5 py-0.5">
                      <Crown className="h-2.5 w-2.5" /> Founder
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent-emerald/15 text-accent-emerald text-[10px] font-semibold px-1.5 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-emerald" /> Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-1">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer"><User className="h-4 w-4 mr-2" /> Public Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/command-center" className="cursor-pointer"><LayoutDashboard className="h-4 w-4 mr-2" /> Boss Panel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/creator-manager" className="cursor-pointer"><User className="h-4 w-4 mr-2" /> Creator Manager</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer"><Settings className="h-4 w-4 mr-2" /> Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/security" className="cursor-pointer"><ShieldCheck className="h-4 w-4 mr-2" /> Security</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive cursor-pointer">
                <KeyRound className="h-4 w-4 mr-2" /> Sign out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
