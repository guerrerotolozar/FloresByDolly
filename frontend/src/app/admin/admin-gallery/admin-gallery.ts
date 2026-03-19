import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryItem } from '../../services/gallery.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-gallery.html',
  styleUrl: './admin-gallery.css',
})
export class AdminGallery implements OnInit {
  items: GalleryItem[] = [];
  loading = true;
  showForm = false;
  saving = false;
  error = '';
  editingId = '';

  // Categorías disponibles para la galería
  categories = [
    { value: 'local', label: 'Nuestro Local', icon: 'fas fa-store' },
    { value: 'productos', label: 'Productos', icon: 'fas fa-seedling' },
    { value: 'arreglos', label: 'Arreglos Especiales', icon: 'fas fa-gift' },
    { value: 'bodas', label: 'Bodas', icon: 'fas fa-heart' },
  ];

  formData: Partial<GalleryItem> = {
    title: '',
    description: '',
    image: '',
    category: 'productos',
    tags: [],
    isActive: true,
    order: 0,
  };
  tagsText = '';
  imagePreview = '';

  constructor(
    private gallerySvc: GalleryService,
    private uploadSvc: UploadService,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.loading = true;
    this.gallerySvc.getAll(true).subscribe({
      next: (res) => {
        this.items = res.data as GalleryItem[];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openNewForm(): void {
    this.editingId = '';
    this.formData = {
      title: '',
      description: '',
      image: '',
      category: 'productos',
      tags: [],
      isActive: true,
      order: 0,
    };
    this.tagsText = '';
    this.imagePreview = '';
    this.error = '';
    this.showForm = true;
  }

  editItem(item: GalleryItem): void {
    this.editingId = item._id;
    this.formData = { ...item };
    this.tagsText = (item.tags || []).join(', ');
    this.imagePreview = this.getImageUrl(item.image);
    this.error = '';
    this.showForm = true;
  }

  cancelForm(): void {
    this.showForm = false;
    this.error = '';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    this.uploadSvc.upload(file).subscribe({
      next: (res) => {
        this.formData.image = res.data.url;
        this.imagePreview = res.data.url;
      },
      error: () => {
        this.error = 'Error al subir la imagen';
      },
    });
  }

  saveItem(): void {
    if (!this.formData.title || !this.formData.image) {
      this.error = 'El título y la imagen son obligatorios';
      return;
    }

    this.saving = true;
    this.error = '';
    this.formData.tags = this.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const operation = this.editingId
      ? this.gallerySvc.update(this.editingId, this.formData)
      : this.gallerySvc.create(this.formData);

    operation.subscribe({
      next: () => {
        this.showForm = false;
        this.saving = false;
        this.loadItems();
      },
      error: (err) => {
        this.saving = false;
        this.error = err.error?.message || 'Error al guardar';
      },
    });
  }

  toggleActive(item: GalleryItem): void {
    this.gallerySvc.update(item._id, { isActive: !item.isActive } as any).subscribe({
      next: () => (item.isActive = !item.isActive),
    });
  }

  deleteItem(item: GalleryItem): void {
    if (!confirm(`¿Eliminar "${item.title}"? Esta acción no se puede deshacer.`)) return;
    this.gallerySvc.delete(item._id).subscribe({
      next: () => {
        this.items = this.items.filter((i) => i._id !== item._id);
      },
    });
  }

  getImageUrl(image: string): string {
    if (!image) return '';
    if (image.startsWith('http')) return image;
    // Use the environment API base URL (without /api) for relative image paths
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${image}`;
  }

  getCategoryLabel(category: string): string {
    const cat = this.categories.find((c) => c.value === category);
    return cat ? cat.label : category;
  }
}
