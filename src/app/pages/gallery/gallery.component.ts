import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleriaModule } from 'primeng/galleria';
import { TagModule } from 'primeng/tag';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  thumbnailSrc: string;
  imageSrc: string;
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, GalleriaModule, TagModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  categories = ['Wszystkie', 'Zawody', 'Treningi', 'Obozy'];
  selectedCategory = 'Wszystkie';

  items: GalleryItem[] = [
    { id: 1, title: 'Mistrzostwa Małopolski 2025', category: 'Zawody', thumbnailSrc: '', imageSrc: '' },
    { id: 2, title: 'Trening poranny', category: 'Treningi', thumbnailSrc: '', imageSrc: '' },
    { id: 3, title: 'Obóz w Krynicy 2024', category: 'Obozy', thumbnailSrc: '', imageSrc: '' },
    { id: 4, title: 'Puchar Polski 2025', category: 'Zawody', thumbnailSrc: '', imageSrc: '' },
    { id: 5, title: 'Zajęcia z wychowania fizycznego', category: 'Treningi', thumbnailSrc: '', imageSrc: '' },
    { id: 6, title: 'Obóz letni 2024', category: 'Obozy', thumbnailSrc: '', imageSrc: '' },
  ];

  get filteredItems() {
    if (this.selectedCategory === 'Wszystkie') return this.items;
    return this.items.filter(i => i.category === this.selectedCategory);
  }

  lightboxVisible = false;
  lightboxIndex = 0;

  openLightbox(index: number) {
    this.lightboxIndex = index;
    this.lightboxVisible = true;
  }
}
