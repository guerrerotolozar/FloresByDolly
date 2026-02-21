import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin-product-form.html',
  styleUrl: './admin-product-form.css',
})
export class AdminProductForm implements OnInit {
  isEdit = false;
  productId = '';
  saving = false;
  error = '';
  categories: Category[] = [];

  product: Partial<Product> = {
    name: '',
    description: '',
    price: 'Variable por Temporada',
    category: '',
    image: '',
    badgeLabel: '',
    badgeClass: 'bg-success',
    features: [],
    tags: [],
    whatsappMsg: '',
    isActive: true,
    order: 0,
  };

  featuresText = '';
  tagsText = '';
  imagePreview = '';

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private uploadSvc: UploadService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Cargar categorías
    this.categorySvc.getAll(true).subscribe((res) => {
      this.categories = res.data as Category[];
    });

    // Si hay :id en la ruta, es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.productId = id;
      this.productSvc.getById(id).subscribe({
        next: (res) => {
          const p = res.data as Product;
          this.product = { ...p };
          // Para el select de categoría
          if (typeof p.category === 'object') {
            this.product.category = p.category._id;
          }
          this.featuresText = (p.features || []).join('\n');
          this.tagsText = (p.tags || []).join(', ');
          if (p.image) {
            // Cloudinary devuelve URLs completas, imágenes viejas tienen ruta relativa
            this.imagePreview = p.image.startsWith('http')
              ? p.image
              : `https://floresbydolly.onrender.com${p.image}`;
          }
        },
        error: () => {
          this.error = 'Producto no encontrado';
        },
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadSvc.upload(file).subscribe({
      next: (res) => {
        this.product.image = res.data.url;
        // Cloudinary devuelve URL completa (https://res.cloudinary.com/...)
        this.imagePreview = res.data.url;
      },
      error: () => {
        this.error = 'Error al subir la imagen';
      },
    });
  }

  onSubmit(): void {
    if (!this.product.name || !this.product.description || !this.product.category) {
      this.error = 'Nombre, descripción y categoría son obligatorios';
      return;
    }

    this.saving = true;
    this.error = '';

    // Convertir features y tags de texto a arrays
    this.product.features = this.featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f);
    this.product.tags = this.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const operation = this.isEdit
      ? this.productSvc.update(this.productId, this.product)
      : this.productSvc.create(this.product);

    operation.subscribe({
      next: () => {
        this.router.navigate(['/admin/productos']);
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Error al guardar';
      },
    });
  }
}
