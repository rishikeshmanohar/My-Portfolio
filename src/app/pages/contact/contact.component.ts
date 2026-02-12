import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  name = '';
  email = '';
  subject = '';
  message = '';

  status: 'idle' | 'sending' | 'success' | 'error' = 'idle';

  private endpoint = 'https://formspree.io/f/xojnewad';

  async send(form: NgForm) {
    if (this.status === 'sending') return;

    this.status = 'sending';

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: this.name,
          email: this.email,
          subject: this.subject,
          message: this.message,
        }),
      });

      if (res.ok) {
        this.status = 'success';
        form.resetForm();

        // auto-hide popup after 3 seconds
        setTimeout(() => {
          this.status = 'idle';
        }, 3000);
      } else {
        this.status = 'error';
      }
    } catch {
      this.status = 'error';
    }
  }

  closeToast() {
    this.status = 'idle';
  }
}
