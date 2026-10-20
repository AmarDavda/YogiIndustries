import { HttpClient } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { DataService } from './data.service';
import { Dict } from './models';

const STORAGE_KEY = 'yogi_lang';
const FALLBACK = 'en';

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly http = inject(HttpClient);
  private readonly data = inject(DataService);

  private readonly dicts = signal<Record<string, Dict>>({});
  private readonly _lang = signal<string>(FALLBACK);

  readonly lang = this._lang.asReadonly();
  readonly current = computed(
    () => this.data.site.languages.find((l) => l.code === this._lang()) ?? this.data.site.languages[0],
  );

  constructor() {
    effect(() => {
      document.documentElement.lang = this._lang();
    });
  }

  /** Called once at start-up (after DataService.load): loads English + the saved language. */
  async init(): Promise<void> {
    await this.ensure(FALLBACK);
    const saved = this.readSaved();
    if (saved !== FALLBACK) await this.ensure(saved);
    this._lang.set(saved);
  }

  /** Switch language (loads its JSON file the first time). */
  async set(code: string): Promise<void> {
    if (!this.data.site.languages.some((l) => l.code === code)) return;
    await this.ensure(code);
    this._lang.set(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* storage may be blocked - ignore */
    }
  }

  /** Translate a key; `{n}`-style placeholders are replaced from `params`. Falls back to English, then to the key. */
  t(key: string, params?: Record<string, string | number>): string {
    return this.format(this.lookup(this._lang(), key), params);
  }

  /** Always English - used for WhatsApp / e-mail messages so the business team can read them. */
  en(key: string): string {
    return this.lookup(FALLBACK, key);
  }

  format(text: string, params?: Record<string, string | number>): string {
    if (!params) return text;
    for (const [name, value] of Object.entries(params)) {
      text = text.split(`{${name}}`).join(String(value));
    }
    return text;
  }

  private lookup(lang: string, key: string): string {
    const all = this.dicts();
    return all[lang]?.[key] ?? all[FALLBACK]?.[key] ?? key;
  }

  private async ensure(code: string): Promise<void> {
    if (this.dicts()[code]) return;
    try {
      const dict = await firstValueFrom(
        this.http.get<Dict>(`data/i18n/${code}.json`, { headers: { 'Cache-Control': 'no-cache' } }),
      );
      this.dicts.update((d) => ({ ...d, [code]: dict }));
    } catch {
      if (code !== FALLBACK) return; // keep using English if a language file is missing
      this.dicts.update((d) => ({ ...d, [code]: {} }));
    }
  }

  private readSaved(): string {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && this.data.site.languages.some((l) => l.code === saved)) return saved;
    } catch {
      /* ignore */
    }
    return this.data.site.defaultLanguage || FALLBACK;
  }
}
