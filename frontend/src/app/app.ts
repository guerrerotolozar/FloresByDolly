import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/header/header';
import { Footer } from './shared/footer/footer';
import { WhatsappFloat } from './shared/whatsapp-float/whatsapp-float';

declare var AOS: any;

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, WhatsappFloat],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  ngOnInit() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 120,
      });
    }
  }
}
