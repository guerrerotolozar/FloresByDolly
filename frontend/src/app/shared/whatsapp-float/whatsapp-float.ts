import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-whatsapp-float',
  templateUrl: './whatsapp-float.html',
  styleUrl: './whatsapp-float.css',
})
export class WhatsappFloat implements OnInit, OnDestroy {
  isVisible = false;
  isPulsing = false;
  private pulseInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    setTimeout(() => {
      this.isVisible = true;
    }, 3000);
    this.pulseInterval = setInterval(() => {
      this.isPulsing = true;
      setTimeout(() => {
        this.isPulsing = false;
      }, 1000);
    }, 5000);
  }

  ngOnDestroy() {
    if (this.pulseInterval) clearInterval(this.pulseInterval);
  }
}
