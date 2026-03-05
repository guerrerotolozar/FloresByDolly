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
  editing: Category | null = null;
  uploading = false;

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
        this.categories = res.data as Category[];
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
    this.uploading = true;
    this.uploadSvc.upload(input.files[0]).subscribe({
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
}
