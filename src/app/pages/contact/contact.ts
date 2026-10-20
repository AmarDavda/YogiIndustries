import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { I18nService } from '../../core/i18n.service';
import { RevealDirective } from '../../core/reveal.directive';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../../shared/icon';
import { PageHeader } from '../../shared/page-header';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe, Icon, PageHeader, RevealDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {
  private readonly data = inject(DataService);
  private readonly i18n = inject(I18nService);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly contact = inject(ContactService);
  protected readonly site = this.data.site;
  protected readonly products = this.data.products;

  protected readonly mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
    `https://www.google.com/maps?q=${encodeURIComponent(this.site.mapQuery)}&output=embed`,
  );

  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9][0-9\s-]{7,14}$/)]],
    email: ['', [Validators.email]],
    product: [''],
    message: ['', [Validators.required, Validators.minLength(5)]],
  });

  protected readonly submitted = signal(false);
  protected readonly mailOpened = signal(false);

  protected showError(name: 'name' | 'phone' | 'email' | 'message'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || this.submitted());
  }

  /** value sent in the message: English product name, or empty for a general enquiry */
  private values() {
    const v = this.form.getRawValue();
    const p = this.data.getProduct(v.product);
    return { ...v, product: p ? this.contact.englishName(p) : '' };
  }

  protected sendMail(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    window.location.href = this.contact.formMailUrl(this.values());
    this.mailOpened.set(true);
  }

  protected sendWhatsapp(): void {
    this.submitted.set(true);
    if (this.form.invalid) return;
    window.open(this.contact.formWhatsappUrl(this.values()), '_blank', 'noopener');
  }

  protected quickUrl(template: string): string {
    return this.contact.whatsappUrl(this.contact.quickMessage(template));
  }

  protected productLabel(id: number): string {
    return this.i18n.t(`p${id}.name`);
  }
}
