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
  movingIds: { [id: string]: 'up' | 'down' } = {};

  constructor(private productSvc: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.productSvc.getAll(true).subscribe({
      next: (res) => {
        this.products = (res.data as Product[]).sort((a, b) => (a.order || 0) - (b.order || 0));
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

  moveProduct(index: number, direction: number): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.products.length) return;

    if (Object.keys(this.movingIds).length > 0) return; // Prevent spam clicking

    const currentProd = this.products[index];
    const targetProd = this.products[targetIndex];

    // Safe zero fallback if order doesn't exist
    const currentOrder = currentProd.order || 0;
    const targetOrder = targetProd.order || 0;

    // 1. Activar las clases CSS de movimiento
    this.movingIds[currentProd._id!] = direction === -1 ? 'up' : 'down';
    this.movingIds[targetProd._id!] = direction === -1 ? 'down' : 'up';

    // 2. Esperar a que la transición CSS termine (300ms)
    setTimeout(() => {
      // Intercambiar valores de orden
      currentProd.order = targetOrder;
      targetProd.order = currentOrder;

      // Intercambiar posiciones en el array local
      this.products[index] = targetProd;
      this.products[targetIndex] = currentProd;

      // Limpiar animación
      this.movingIds = {};

      // Guardar en backend silenciosamente
      this.productSvc.update(currentProd._id!, { order: currentProd.order } as any).subscribe();
      this.productSvc.update(targetProd._id!, { order: targetProd.order } as any).subscribe();
    }, 300);
  }
}
