import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { TagModule } from 'primeng/tag';
import { GalleryService, GalleryImage } from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleriaModule, TagModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  galleryService = inject(GalleryService);

  categories = ['Wszystkie', 'Zawody', 'Treningi', 'Obozy'];
  selectedCategory = 'Wszystkie';

  items: GalleryImage[] = [];

  ngOnInit() {
    this.galleryService.getAll().subscribe({
      next: (data) => { this.items = data; },
      error: () => {},
    });
  }

  get filteredItems(): GalleryImage[] {
    if (this.selectedCategory === 'Wszystkie') return this.items;
    return this.items.filter(i => i.category === this.selectedCategory);
  }

  lightboxVisible = false;
  lightboxIndex = 0;

  get lightboxImages() {
    return this.filteredItems.map(i => ({
      itemImageSrc: this.galleryService.imageUrl(i.filename),
      thumbnailImageSrc: this.galleryService.imageUrl(i.filename),
      alt: i.title ?? i.filename,
      title: i.title ?? '',
    }));
  }

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxVisible = true;
  }
}
