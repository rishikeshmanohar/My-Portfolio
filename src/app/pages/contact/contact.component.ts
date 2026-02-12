import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';

  send() {
    const to = 'rmanoha8@asu.edu';

    const body =
`Name: ${this.name}
Email: ${this.email}

${this.message}`;

    const url =
      `mailto:${to}` +
      `?subject=${encodeURIComponent(this.subject || 'Portfolio Contact')}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = url;
  }
}
