import { Component } from '@angular/core';
import { HeroCarousel } from './hero-carousel/hero-carousel';
import { AboutSection } from './about-section/about-section';
import { FlowerTypes } from './flower-types/flower-types';
import { SpecialArrangements } from './special-arrangements/special-arrangements';
import { TrustSection } from './trust-section/trust-section';
import { CtaSection } from './cta-section/cta-section';

@Component({
  selector: 'app-home',
  imports: [HeroCarousel, AboutSection, FlowerTypes, SpecialArrangements, TrustSection, CtaSection],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
