import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  products: Product[] = [];
  loading = true;

  constructor(private productSvc: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getAll(true).subscribe({
      next: (res) => {
        this.products = res.data as Product[];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  toggleActive(product: Product): void {
    this.productSvc.update(product._id, { isActive: !product.isActive } as any).subscribe({
      next: () => (product.isActive = !product.isActive),
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    this.productSvc.delete(product._id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p._id !== product._id);
      },
    });
  }

  getCategoryName(product: Product): string {
    if (typeof product.category === 'object' && product.category) {
      return product.category.name;
    }
    return '';
  }
}
