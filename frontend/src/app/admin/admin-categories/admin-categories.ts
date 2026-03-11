import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService, Category } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-categories.html',
  styleUrl: './admin-categories.css',
})
export class AdminCategories implements OnInit {
  categories: Category[] = [];
  loading = true;
  showForm = false;
  showIconPicker = false;
  editing: Category | null = null;
  uploading = false;
  localPreview: string | null = null;
  movingIds: { [id: string]: 'up' | 'down' } = {};

  availableIcons = [
    { class: 'fas fa-leaf', name: 'Hoja' },
    { class: 'fas fa-seedling', name: 'Brote' },
    { class: 'fas fa-tree', name: 'Árbol' },
    { class: 'fas fa-gift', name: 'Regalo' },
    { class: 'fas fa-heart', name: 'Corazón' },
    { class: 'fas fa-star', name: 'Estrella' },
    { class: 'fas fa-crown', name: 'Corona' },
    { class: 'fas fa-gem', name: 'Diamante' },
    { class: 'fas fa-spa', name: 'Spa / Loto' },
    { class: 'fas fa-sun', name: 'Sol' },
    { class: 'fas fa-ribbon', name: 'Cinta' },
    { class: 'fas fa-shopping-bag', name: 'Bolsa de compras' },
  ];

  form = {
    name: '',
    slug: '',
    icon: 'fas fa-leaf',
    order: 0,
    isActive: true,
    showOnHome: false,
    description: '',
    image: '',
    color: '#13592a',
  };

  constructor(
    private categorySvc: CategoryService,
    private uploadSvc: UploadService,
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categorySvc.getAll(true).subscribe({
      next: (res) => {
        this.categories = (res.data as Category[]).sort((a, b) => a.order - b.order);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openNew(): void {
    this.form = {
      name: '',
      slug: '',
      icon: 'fas fa-leaf',
      order: this.categories.length + 1,
      isActive: true,
      showOnHome: false,
      description: '',
      image: '',
      color: '#13592a',
    };
    this.editing = null;
    this.localPreview = null;
    this.showForm = true;
  }

  openEdit(cat: Category): void {
    this.form = {
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      order: cat.order,
      isActive: cat.isActive,
      showOnHome: cat.showOnHome || false,
      description: cat.description || '',
      image: cat.image || '',
      color: cat.color || '#13592a',
    };
    this.editing = cat;
    this.localPreview = null;
    this.showForm = true;
  }

  autoSlug(): void {
    if (!this.editing) {
      this.form.slug = this.form.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Vista previa local inmediata
    const reader = new FileReader();
    reader.onload = (e) => {
      this.localPreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    this.uploading = true;
    this.uploadSvc.upload(file).subscribe({
      next: (res) => {
        this.form.image = res.data.url;
        this.uploading = false;
      },
      error: () => (this.uploading = false),
    });
  }

  save(): void {
    if (!this.form.name || !this.form.slug) return;

    if (this.editing) {
      this.categorySvc.update(this.editing._id, this.form as any).subscribe({
        next: (res) => {
          const idx = this.categories.findIndex((c) => c._id === this.editing!._id);
          if (idx >= 0) this.categories[idx] = res.data as Category;
          this.showForm = false;
        },
      });
    } else {
      this.categorySvc.create(this.form as any).subscribe({
        next: (res) => {
          this.categories.push(res.data as Category);
          this.showForm = false;
        },
      });
    }
  }

  toggleActive(cat: Category): void {
    this.categorySvc.update(cat._id, { isActive: !cat.isActive } as any).subscribe({
      next: () => (cat.isActive = !cat.isActive),
    });
  }

  toggleHome(cat: Category): void {
    this.categorySvc.update(cat._id, { showOnHome: !cat.showOnHome } as any).subscribe({
      next: () => (cat.showOnHome = !cat.showOnHome),
    });
  }

  deleteCategory(cat: Category): void {
    if (!confirm(`¿Eliminar categoría "${cat.name}"?`)) return;
    this.categorySvc.delete(cat._id).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c._id !== cat._id);
      },
    });
  }

  getIconName(iconClass: string): string {
    return this.availableIcons.find((i) => i.class === iconClass)?.name || 'Elegir Icono';
  }

  moveCategory(index: number, direction: number): void {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.categories.length) return;

    if (Object.keys(this.movingIds).length > 0) return; // Prevent spam clicking

    const currentCat = this.categories[index];
    const targetCat = this.categories[targetIndex];

    // 1. Activar las clases CSS de movimiento
    this.movingIds[currentCat._id] = direction === -1 ? 'up' : 'down';
    this.movingIds[targetCat._id] = direction === -1 ? 'down' : 'up';

    // 2. Esperar a que la transición CSS termine (300ms)
    setTimeout(() => {
      // Intercambiar valores de orden
      const tempOrder = currentCat.order;
      currentCat.order = targetCat.order;
      targetCat.order = tempOrder;

      // Intercambiar posiciones en el array local
      this.categories[index] = targetCat;
      this.categories[targetIndex] = currentCat;

      // Limpiar animación
      this.movingIds = {};

      // Guardar en backend silenciosamente
      this.categorySvc.update(currentCat._id, { order: currentCat.order } as any).subscribe();
      this.categorySvc.update(targetCat._id, { order: targetCat.order } as any).subscribe();
    }, 300);
  }
}
