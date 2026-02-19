import { Component, AfterViewInit, OnDestroy, ElementRef, inject, NgZone } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-carousel',
  imports: [RouterLink],
  templateUrl: './hero-carousel.html',
  styleUrl: './hero-carousel.css',
})
export class HeroCarousel implements AfterViewInit, OnDestroy {
  private el = inject(ElementRef);
  private zone = inject(NgZone);

  private carousel!: HTMLElement;
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private autoScrollInterval: ReturnType<typeof setInterval> | null = null;
  private currentSlide = 0;
  private totalSlides = 0;

  // Bound handlers for cleanup
  private onMouseDown = (e: MouseEvent) => this.handleMouseDown(e);
  private onMouseMove = (e: MouseEvent) => this.handleMouseMove(e);
  private onMouseUp = () => this.handleMouseUp();
  private onMouseLeave = () => this.handleMouseUp();

  ngAfterViewInit() {
    this.carousel = this.el.nativeElement.querySelector('.carousel');
    if (!this.carousel) return;

    const cards = this.carousel.querySelectorAll('.card');
    this.totalSlides = cards.length;

    // Mouse drag events (run outside Angular for performance)
    this.zone.runOutsideAngular(() => {
      this.carousel.addEventListener('mousedown', this.onMouseDown);
      this.carousel.addEventListener('mousemove', this.onMouseMove);
      this.carousel.addEventListener('mouseup', this.onMouseUp);
      this.carousel.addEventListener('mouseleave', this.onMouseLeave);
    });

    // Auto-scroll every 6 seconds
    this.startAutoScroll();
  }

  ngOnDestroy() {
    if (this.carousel) {
      this.carousel.removeEventListener('mousedown', this.onMouseDown);
      this.carousel.removeEventListener('mousemove', this.onMouseMove);
      this.carousel.removeEventListener('mouseup', this.onMouseUp);
      this.carousel.removeEventListener('mouseleave', this.onMouseLeave);
    }
    this.stopAutoScroll();
  }

  private handleMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.carousel.classList.add('dragging');
    this.startX = e.pageX - this.carousel.offsetLeft;
    this.scrollLeft = this.carousel.scrollLeft;
    this.stopAutoScroll();
  }

  private handleMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    e.preventDefault();
    const x = e.pageX - this.carousel.offsetLeft;
    const walk = (x - this.startX) * 1.5; // Multiplier for drag speed
    this.carousel.scrollLeft = this.scrollLeft - walk;
  }

  private handleMouseUp() {
    if (!this.isDragging) return;
    this.isDragging = false;
    this.carousel.classList.remove('dragging');

    // Snap to the closest card after drag
    const cardWidth = this.carousel.offsetWidth;
    this.currentSlide = Math.round(this.carousel.scrollLeft / cardWidth);
    this.carousel.scrollTo({ left: this.currentSlide * cardWidth, behavior: 'smooth' });

    this.startAutoScroll();
  }

  scrollToSlide(index: number) {
    this.currentSlide = index;
    const cardWidth = this.carousel.offsetWidth;
    this.carousel.scrollTo({ left: index * cardWidth, behavior: 'smooth' });
    this.stopAutoScroll();
    this.startAutoScroll();
  }

  scrollPrev() {
    this.currentSlide = this.currentSlide > 0 ? this.currentSlide - 1 : this.totalSlides - 1;
    this.scrollToSlide(this.currentSlide);
  }

  scrollNext() {
    this.currentSlide = this.currentSlide < this.totalSlides - 1 ? this.currentSlide + 1 : 0;
    this.scrollToSlide(this.currentSlide);
  }

  private startAutoScroll() {
    this.stopAutoScroll();
    this.autoScrollInterval = setInterval(() => {
      this.scrollNext();
    }, 6000);
  }

  private stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
  }
}
