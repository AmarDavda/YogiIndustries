import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Icon } from './icon';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast',
  imports: [Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toasts" aria-live="polite" role="status">
      @for (t of toasts.toasts(); track t.id) {
        <div class="toast"><app-icon name="check" /><span>{{ t.text }}</span></div>
      }
    </div>
  `,
  styles: `
    .toasts { position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%); z-index: 400;
      display: flex; flex-direction: column; gap: 8px; align-items: center; width: max-content; max-width: calc(100vw - 32px); pointer-events: none; }
    .toast { display: flex; align-items: center; gap: 10px; background: var(--ink); color: #fff; padding: 12px 18px;
      border-radius: 999px; box-shadow: var(--shadow-lg); font-weight: 600; font-size: .95rem; animation: toast-in .3s ease both; }
    .toast app-icon { color: #7be0a4; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(12px) scale(.96); } to { opacity: 1; transform: none; } }
    @media (max-width: 480px) { .toasts { bottom: 84px; } .toast { font-size: .88rem; padding: 10px 14px; } }
  `,
})
export class Toast {
  readonly toasts = inject(ToastService);
}
