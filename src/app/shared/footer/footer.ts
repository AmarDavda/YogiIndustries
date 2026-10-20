import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/contact.service';
import { DataService } from '../../core/data.service';
import { TranslatePipe } from '../../core/translate.pipe';
import { Icon } from '../icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  private readonly data = inject(DataService);
  protected readonly site = this.data.site;
  protected readonly categories = this.data.categories;
  protected readonly contact = inject(ContactService);
  protected readonly year = new Date().getFullYear();
}
