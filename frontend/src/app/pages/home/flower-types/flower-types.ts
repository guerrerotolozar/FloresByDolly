import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';

@Component({
  selector: 'app-flower-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flower-types.html',
  styleUrl: './flower-types.css',
})
export class FlowerTypes implements OnInit {
  categories: Category[] = [];
  loading = true;

  constructor(
    private categorySvc: CategoryService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.categorySvc.getAll().subscribe({
      next: (res) => {
        // Solo categorías con showOnHome activado
        this.categories = (res.data as Category[]).filter((c) => c.showOnHome);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goToCatalog(slug: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { category: slug } });
  }

  getImageUrl(cat: Category): string {
    if (!cat.image) return '';
    if (cat.image.startsWith('http')) return cat.image;
    return `https://floresbydolly.onrender.com${cat.image}`;
  }
}
