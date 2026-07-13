import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GalleryService, GalleryImage } from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="admin-section-header">
      <h1 class="admin-page-title">Galeria</h1>
      <label class="upload-btn">
        <i class="pi pi-upload"></i> Upload zdjęć
        <input type="file" multiple accept="image/*" (change)="onFileSelect($event)" style="display:none" />
      </label>
    </div>

    <div class="category-bar">
      <label>Kategoria dla uploadu:</label>
      <select [(ngModel)]="uploadCategory" class="p-inputtext cat-select">
        <option>Zawody</option>
        <option>Treningi</option>
        <option>Obozy</option>
        <option>Inne</option>
      </select>
    </div>

    @if (uploadProgress().length > 0) {
      <div class="upload-progress">
        @for (item of uploadProgress(); track item.name) {
          <div class="upload-item" [class.done]="item.done" [class.error]="item.error">
            <i class="pi" [class.pi-check-circle]="item.done" [class.pi-times-circle]="item.error" [class.pi-spin]="!item.done && !item.error" [class.pi-spinner]="!item.done && !item.error"></i>
            {{ item.name }}
          </div>
        }
      </div>
    }

    @if (isLoading()) {
      <div class="loading-state"><i class="pi pi-spin pi-spinner"></i> Ładowanie...</div>
    }

    <div class="photo-grid">
      @for (photo of photos(); track photo.id) {
        <div class="photo-card" #photoCard>
          <div class="photo-thumb">
            <div class="thumb-spinner"><i class="pi pi-spin pi-spinner"></i></div>
            <img [src]="galleryService.thumbnailUrl(photo.filename)" [alt]="photo.title ?? ''" loading="lazy"
               (load)="photoCard.classList.add('thumb-loaded')"
               (error)="photoCard.classList.add('thumb-loaded'); $any($event.target).src = galleryService.imageUrl(photo.filename)" />
          </div>
          <div class="photo-info">
            <span class="photo-title">{{ photo.title ?? photo.filename }}</span>
            <p-tag [value]="photo.category" severity="warn" />
          </div>
          <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger delete-btn" (click)="delete(photo.id)"></button>
        </div>
      }
    </div>

    @if (photos().length === 0 && !isLoading()) {
      <div class="empty-state">
        <i class="pi pi-images"></i>
        <p>Brak zdjęć. Kliknij "Upload zdjęć" aby dodać pierwsze.</p>
      </div>
    }
  `,
  styles: [`
    .admin-page-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #F5A623; text-transform: uppercase; margin-bottom: 0; }
    .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .upload-btn {
      display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.25rem;
      background: #F5A623; color: #000; font-weight: 700; border-radius: 6px; cursor: pointer;
      font-family: 'Oswald', sans-serif; text-transform: uppercase; font-size: 0.9rem;
      transition: background 0.2s;
      &:hover { background: #C8891A; }
    }
    .category-bar { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; color: #ccc; font-size: 0.875rem; }
    .cat-select { background: #111; color: #fff; border: 1px solid #2a2a2a; padding: 0.4rem 0.75rem; border-radius: 4px; }
    .photo-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
    .photo-card {
      background: #111; border: 1px solid #2a2a2a; border-radius: 8px; overflow: hidden;
      position: relative; transition: border-color 0.2s;
      &:hover { border-color: #F5A623; }
    }
    .photo-thumb { height: 140px; position: relative; background: #1e1e1e; overflow: hidden;
      img { width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 0.3s ease; display: block; }
    }
    .thumb-spinner { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none;
      i { font-size: 1.4rem; color: #F5A623; opacity: 0.7; } }
    .photo-card.thumb-loaded .thumb-spinner { display: none; }
    .photo-card.thumb-loaded .photo-thumb img { opacity: 1; }
    .photo-info { padding: 0.75rem; display: flex; flex-direction: column; gap: 0.4rem; }
    .photo-title { color: #fff; font-size: 0.85rem; }
    .delete-btn { position: absolute; top: 0.5rem; right: 0.5rem; opacity: 0; transition: opacity 0.2s; }
    .photo-card:hover .delete-btn { opacity: 1; }
    .empty-state { text-align: center; padding: 4rem; color: #aaa; i { font-size: 3rem; color: #2a2a2a; display: block; margin-bottom: 1rem; } }
    .loading-state { text-align: center; padding: 2rem; color: #aaa; }
    .upload-progress { background: #111; border: 1px solid #2a2a2a; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .upload-item { display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; color: #aaa; padding: 0.25rem 0.6rem; border-radius: 4px; background: #1a1a1a;
      &.done { color: #4caf50; } &.error { color: #f44336; } }
  `]
})
export class GalleryListComponent implements OnInit {
  galleryService = inject(GalleryService);
  private messageService = inject(MessageService);

  photos = signal<GalleryImage[]>([]);
  isLoading = signal(false);
  uploadCategory = 'Inne';
  uploadProgress = signal<{ name: string; done: boolean; error: boolean }[]>([]);

  private readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.galleryService.getAll().subscribe({
      next: (data) => { this.photos.set(data); this.isLoading.set(false); },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie można załadować galerii' }); this.isLoading.set(false); },
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    const files = Array.from(input.files);

    const queue = files.map(f => ({ name: f.name.replace(/\.[^.]+$/, ''), done: false, error: false }));
    this.uploadProgress.set(queue);

    files.forEach((file, i) => {
      const title = file.name.replace(/\.[^.]+$/, '');

      if (file.size > this.MAX_FILE_SIZE) {
        this.updateQueue(i, false, true);
        this.messageService.add({ severity: 'warn', summary: 'Za duży plik', detail: `${title} przekracza 20 MB` });
        return;
      }

      this.galleryService.upload(file, title, this.uploadCategory).subscribe({
        next: () => {
          this.updateQueue(i, true, false);
          this.load();
          this.messageService.add({ severity: 'success', summary: 'Dodano', detail: `${title} — przesłano` });
        },
        error: () => {
          this.updateQueue(i, false, true);
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: `Nie udało się przesłać ${title}` });
        },
      });
    });
    input.value = '';
  }

  private updateQueue(index: number, done: boolean, error: boolean) {
    const q = [...this.uploadProgress()];
    q[index] = { ...q[index], done, error };
    this.uploadProgress.set(q);
    if (q.every(item => item.done || item.error)) {
      setTimeout(() => this.uploadProgress.set([]), 3000);
    }
  }

  delete(id: number) {
    this.galleryService.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: 'Zdjęcie usunięte' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć' }),
    });
  }
}
