import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 1;

  show(text: string, ms = 2600): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list.slice(-2), { id, text }]);
    setTimeout(() => this.toasts.update((list) => list.filter((t) => t.id !== id)), ms);
  }
}
