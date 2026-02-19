import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  totalProducts = 0;
  activeProducts = 0;
  totalCategories = 0;
  recentProducts: Product[] = [];

  constructor(
    private productSvc: ProductService,
    private categorySvc: CategoryService,
  ) {}

  ngOnInit(): void {
    this.productSvc.getAll(true).subscribe((res) => {
      const products = res.data as Product[];
      this.totalProducts = products.length;
      this.activeProducts = products.filter((p) => p.isActive).length;
      this.recentProducts = products.slice(0, 5);
    });

    this.categorySvc.getAll(true).subscribe((res) => {
      this.totalCategories = (res.data as Category[]).length;
    });
  }
}
