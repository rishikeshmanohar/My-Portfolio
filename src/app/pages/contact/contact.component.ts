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
  form = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  sendEmail() {
    const to = 'rmanoha8@asu.edu';
    const subject = encodeURIComponent(this.form.subject || 'Portfolio Message');
    const body = encodeURIComponent(
      `Name: ${this.form.name}\nEmail: ${this.form.email}\n\n${this.form.message}`
    );

    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
  }
}
