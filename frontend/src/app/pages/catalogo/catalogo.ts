  import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {
  activeFilter = 'all';
  lightboxItem: Product | null = null;
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  // Extras — productos de la categoría "El Toque Perfecto"
  extras: Product[] = [];
  selectedExtras: Product[] = [];

  // Referencia al contenedor del carrusel para scroll programático
  @ViewChild('extrasTrack') extrasTrack!: ElementRef<HTMLDivElement>;

  // Número de WhatsApp del negocio
  private readonly whatsapp = '573114582898';

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // Leer query param ?category=slug para auto-filtrar
    this.route.queryParams.subscribe((params) => {
      if (params['category']) {
        this.activeFilter = params['category'];
      }
    });

    // Cargar productos activos desde la API
    this.productSvc.getAll().subscribe({
      next: (res) => {
        this.products = res.data as Product[];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    // Cargar categorías para los filtros
    this.categorySvc.getAll().subscribe({
      next: (res) => {
        this.categories = res.data as Category[];
      },
    });

    // Cargar extras de "El Toque Perfecto"
    this.productSvc.getByCategorySlug('el-toque-perfecto').subscribe({
      next: (res) => {
        this.extras = res.data as Product[];
      },
    });
  }

  get filteredItems(): Product[] {
    if (this.activeFilter === 'all') return this.products;
    return this.products.filter((p) => {
      const cat = p.category;
      if (typeof cat === 'object') return cat.slug === this.activeFilter;
      return cat === this.activeFilter;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  // ═══ Lightbox ═══

  openLightbox(item: Product) {
    this.lightboxItem = item;
    this.selectedExtras = []; // Limpiar extras al abrir un nuevo producto
  }

  closeLightbox() {
    this.lightboxItem = null;
    this.selectedExtras = [];
  }

  // ═══ Extras ═══

  toggleExtra(extra: Product) {
    const idx = this.selectedExtras.findIndex((e) => e._id === extra._id);
    if (idx >= 0) {
      this.selectedExtras.splice(idx, 1);
    } else {
      this.selectedExtras.push(extra);
    }
  }

  isExtraSelected(extra: Product): boolean {
    return this.selectedExtras.some((e) => e._id === extra._id);
  }

  scrollExtras(direction: 'left' | 'right') {
    if (!this.extrasTrack) return;
    const container = this.extrasTrack.nativeElement;
    const scrollAmount = 200;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }

  // ═══ Imágenes ═══

  getImageUrl(product: Product): string {
    if (!product.image) return 'assets/img/placeholder.jpg';
    if (product.image.startsWith('http')) return product.image;
    return `https://floresbydolly.onrender.com${product.image}`;
  }

  // ═══ WhatsApp URLs ═══

  getCategoryName(product: Product): string {
    if (typeof product.category === 'object') return product.category.name;
    return '';
  }

  getWhatsappUrl(product: Product): string {
    const msg =
      product.whatsappMsg || `Hola! Me interesa ${product.name}. ¿Qué disponibilidad tienen?`;
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  // Genera URL de WhatsApp con producto principal + extras seleccionados
  getOrderUrl(product: Product): string {
    let msg = `Hola! Quiero hacer un pedido de *${product.name}*.`;

    if (this.selectedExtras.length > 0) {
      const extraNames = this.selectedExtras.map((e) => `• ${e.name}`).join('\n');
      msg += `\n\nCon los siguientes extras:\n${extraNames}`;
    }

    msg += '\n\n¿Cuál es el precio y disponibilidad?';
    return `https://wa.me/${this.whatsapp}?text=${encodeURIComponent(msg)}`;
  }
}
