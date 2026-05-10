import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

interface GalleryPhoto {
  id: number;
  title: string;
  category: string;
  filename: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [CommonModule, ButtonModule, TagModule],
  template: `
    <div class="admin-section-header">
      <h1 class="admin-page-title">Galeria</h1>
      <label class="upload-btn">
        <i class="pi pi-upload"></i> Upload zdjęć
        <input type="file" multiple accept="image/*" (change)="onFileSelect($event)" style="display:none" />
      </label>
    </div>

    <div class="photo-grid">
      <div class="photo-card" *ngFor="let photo of photos()">
        <div class="photo-thumb">
          <i class="pi pi-image" style="font-size:2rem;color:#F5A623"></i>
        </div>
        <div class="photo-info">
          <span class="photo-title">{{ photo.title }}</span>
          <p-tag [value]="photo.category" severity="warn" />
        </div>
        <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger delete-btn" (click)="delete(photo.id)"></button>
      </div>
    </div>

    <div class="empty-state" *ngIf="photos().length === 0">
      <i class="pi pi-images"></i>
      <p>Brak zdjęć. Kliknij "Upload zdjęć" aby dodać pierwsze.</p>
    </div>
  `,
  styles: [`
    .admin-page-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #F5A623; text-transform: uppercase; margin-bottom: 0; }
    .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .upload-btn {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem;
      background: #F5A623; color: #000; font-weight: 700; border-radius: 6px; cursor: pointer;
      font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 0.9rem;
      transition: background 0.2s;
      &:hover { background: #C8891A; }
    }
    .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .photo-card {
      background: #111; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden;
      position: relative; transition: border-color 0.2s;
      &:hover { border-color: #F5A623; }
    }
    .photo-thumb { height: 140px; display: flex; align-items: center; justify-content: center; background: #1e1e1e; }
    .photo-info { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .photo-title { color: #fff; font-size: 0.85rem; }
    .delete-btn { position: absolute; top: 0.5rem; right: 0.5rem; opacity: 0; transition: opacity 0.2s; }
    .photo-card:hover .delete-btn { opacity: 1; }
    .empty-state { text-align: center; padding: 4rem; color: #aaa; i { font-size: 3rem; color: #2a2a2a; display: block; margin-bottom: 1rem; } }
  `]
})
export class GalleryListComponent {
  photos = signal<GalleryPhoto[]>([
    { id: 1, title: 'Zawody 2025', category: 'Zawody', filename: 'zawody1.jpg', uploadedAt: '2025-04-15' },
    { id: 2, title: 'Trening poranny', category: 'Treningi', filename: 'trening1.jpg', uploadedAt: '2025-03-20' },
  ]);

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    Array.from(input.files).forEach((file, i) => {
      this.photos.update(list => [...list, {
        id: Date.now() + i,
        title: file.name.replace(/\.[^.]+$/, ''),
        category: 'Nowe',
        filename: file.name,
        uploadedAt: new Date().toISOString().split('T')[0]
      }]);
    });
  }

  delete(id: number) {
    this.photos.update(list => list.filter(p => p.id !== id));
  }
}
