import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';
import { ProductService, Product } from '../../../services/product.service';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';

// Categoría extendida con la imagen de producto al azar
interface CategoryWithProductImage extends Category {
  productImage?: string; // imagen tomada de un producto random de esta categoría
}

@Component({
  selector: 'app-flower-types',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flower-types.html',
  styleUrl: './flower-types.css',
})
export class FlowerTypes implements OnInit {
  categories: CategoryWithProductImage[] = [];
  loading = true;

  constructor(
    private categorySvc: CategoryService,
    private productSvc: ProductService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // Traemos categorías y productos en paralelo
    forkJoin({
      categories: this.categorySvc.getAll(),
      products: this.productSvc.getAll(),
    }).subscribe({
      next: ({ categories, products }) => {
        // Solo categorías con showOnHome activado
        const homeCats = (categories.data as Category[]).filter((c) => c.showOnHome);
        const allProducts = products.data as Product[];

        // Para cada categoría, buscar productos que pertenezcan a ella y elegir uno al azar
        this.categories = homeCats.map((cat) => {
          // Filtrar productos activos de esta categoría (category puede ser objeto o string)
          const catProducts = allProducts.filter((p) => {
            if (!p.image) return false; // solo productos con imagen
            const prodCatId = typeof p.category === 'object' ? p.category._id : p.category;
            return prodCatId === cat._id;
          });

          // Elegir un producto al azar de los que tienen imagen
          let productImage: string | undefined;
          if (catProducts.length > 0) {
            const randomProduct = catProducts[Math.floor(Math.random() * catProducts.length)];
            productImage = randomProduct.image;
          }

          return { ...cat, productImage };
        });

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  goToCatalog(slug: string): void {
    this.router.navigate(['/catalogo'], { queryParams: { category: slug } });
  }

  /** Retorna la URL completa de la imagen del producto al azar o la imagen de la categoría como fallback */
  getImageUrl(cat: CategoryWithProductImage): string {
    // Prioridad: imagen de producto al azar > imagen propia de la categoría
    const img = cat.productImage || cat.image;
    if (!img) return '';
    if (img.startsWith('http')) return img;
    return `${environment.apiUrl.replace('/api', '')}${img}`;
  }
}
