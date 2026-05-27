import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CampsService, Camp } from '../../core/services/camps.service';

@Component({
  selector: 'app-camps-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, TagModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="admin-section-header">
      <h1 class="admin-page-title">Obozy szkoleniowe</h1>
      <button pButton label="Dodaj obóz" icon="pi pi-plus" class="p-button" (click)="openNew()"></button>
    </div>

    <p-table [value]="items()" styleClass="admin-table" [tableStyle]="{'min-width':'700px'}">
      <ng-template pTemplate="header">
        <tr>
          <th>Nazwa</th>
          <th>Lokalizacja</th>
          <th>Termin</th>
          <th>Miejsca</th>
          <th>Status</th>
          <th style="width:120px">Akcje</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.date_from | date:'d MMM':'':'pl' }} – {{ item.date_to | date:'d MMM yyyy':'':'pl' }}</td>
          <td>{{ item.spots_left }} / {{ item.spots_total }}</td>
          <td><span [class]="'status-badge status-' + item.status">{{ statusLabel(item.status) }}</span></td>
          <td>
            <div style="display:flex;gap:0.5rem">
              <button pButton icon="pi pi-pencil" class="p-button-sm p-button-outlined" (click)="openEdit(item)"></button>
              <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger" (click)="delete(item.id)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr><td colspan="6" style="text-align:center;color:#aaa;padding:2rem">Brak obozów</td></tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialogVisible" [header]="isNew ? 'Nowy obóz' : 'Edytuj obóz'" [modal]="true" [style]="{width:'560px'}">
      <div class="dialog-form">
        <div class="field"><label>Nazwa</label><input pInputText [(ngModel)]="editItem.name" class="w-full" /></div>
        <div class="field"><label>Lokalizacja</label><input pInputText [(ngModel)]="editItem.location" class="w-full" /></div>
        <div class="field"><label>Data od</label><input pInputText type="date" [(ngModel)]="editItem.date_from" class="w-full" /></div>
        <div class="field"><label>Data do</label><input pInputText type="date" [(ngModel)]="editItem.date_to" class="w-full" /></div>
        <div class="field">
          <label>Status</label>
          <select [(ngModel)]="editItem.status" class="w-full p-inputtext">
            <option value="upcoming">Nadchodzący</option>
            <option value="open">Zapisy otwarte</option>
            <option value="past">Archiwum</option>
          </select>
        </div>
        <div class="field"><label>Opis</label><textarea pTextarea [(ngModel)]="editItem.description" rows="4" class="w-full"></textarea></div>
        <div class="field"><label>Liczba miejsc ogółem</label><input pInputText type="number" [(ngModel)]="editItem.spots_total" class="w-full" /></div>
        <div class="field"><label>Wolnych miejsc</label><input pInputText type="number" [(ngModel)]="editItem.spots_left" class="w-full" /></div>
        <div class="field">
          <label>Zdjęcie <span style="color:#aaa;font-weight:400">(opcjonalne)</span></label>
          @if (imagePreview) {
            <div class="image-preview">
              <img [src]="imagePreview" alt="Podgląd" />
              <button pButton icon="pi pi-times" class="p-button-sm p-button-outlined p-button-danger remove-img-btn" title="Usuń zdjęcie" (click)="removeImage()"></button>
            </div>
          } @else {
            <label class="upload-area">
              <i class="pi pi-image"></i>
              <span>Kliknij, aby wybrać zdjęcie</span>
              <input type="file" accept="image/*" (change)="onFileSelect($event)" style="display:none" />
            </label>
          }
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Anuluj" class="p-button-outlined" (click)="dialogVisible = false"></button>
        <button pButton [label]="isUploading ? 'Przesyłanie...' : 'Zapisz'" class="p-button" [disabled]="isUploading" (click)="save()"></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
    .admin-page-title { font-family: 'Oswald', sans-serif; font-size: 2rem; color: #F5A623; text-transform: uppercase; margin-bottom: 0; }
    .admin-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    :host ::ng-deep .admin-table {
      .p-datatable-thead th { background: #111 !important; color: #F5A623 !important; font-family: 'Oswald', sans-serif !important; text-transform: uppercase; border-color: #2a2a2a !important; }
      .p-datatable-tbody td { background: #111 !important; color: #fff !important; border-color: #2a2a2a !important; }
      .p-datatable-tbody tr:hover td { background: #1e1e1e !important; }
    }
    .dialog-form { display: flex; flex-direction: column; }
    .field { margin-bottom: 1rem; label { display: block; color: #ccc; font-size: 0.875rem; margin-bottom: 0.4rem; } }
    .w-full { width: 100%; }
    .status-badge { padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.75rem; font-weight: 600; }
    .status-upcoming { background: #1a3a1a; color: #4caf50; }
    .status-open { background: #1a2a3a; color: #2196f3; }
    .status-past { background: #2a2a2a; color: #aaa; }
    .upload-area {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
      border: 2px dashed #2a2a2a; border-radius: 8px; padding: 1.5rem; cursor: pointer; color: #aaa;
      transition: border-color 0.2s;
      &:hover { border-color: #F5A623; color: #F5A623; }
      i { font-size: 2rem; }
    }
    .image-preview {
      position: relative; display: inline-block;
      img { width: 100%; max-height: 180px; object-fit: cover; border-radius: 6px; display: block; }
      .remove-img-btn { position: absolute; top: 0.4rem; right: 0.4rem; }
    }
  `]
})
export class CampsListComponent implements OnInit {
  private campsService = inject(CampsService);
  private messageService = inject(MessageService);

  items = signal<Camp[]>([]);
  isLoading = signal(false);
  dialogVisible = false;
  editItem: Partial<Camp> = {};
  isNew = false;

  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isUploading = false;

  ngOnInit() { this.load(); }

  load() {
    this.isLoading.set(true);
    this.campsService.getAll().subscribe({
      next: (data) => { this.items.set(data); this.isLoading.set(false); },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie można załadować obozów' }); this.isLoading.set(false); },
    });
  }

  statusLabel(status: string): string {
    return { upcoming: 'Nadchodzący', open: 'Zapisy otwarte', past: 'Archiwum' }[status] ?? status;
  }

  openNew() {
    this.editItem = { name: '', location: '', date_from: '', date_to: '', description: '', status: 'upcoming', spots_total: 20, spots_left: 20 };
    this.isNew = true;
    this.selectedFile = null;
    this.imagePreview = null;
    this.dialogVisible = true;
  }

  openEdit(item: Camp) {
    this.editItem = { ...item };
    this.isNew = false;
    this.selectedFile = null;
    this.imagePreview = item.image_path ? this.campsService.imageUrl(item.image_path) : null;
    this.dialogVisible = true;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = (e) => { this.imagePreview = e.target?.result as string; };
    reader.readAsDataURL(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.editItem = { ...this.editItem, image_path: '' };
  }

  save() {
    if (this.selectedFile) {
      this.isUploading = true;
      this.campsService.uploadImage(this.selectedFile).subscribe({
        next: (res) => {
          this.isUploading = false;
          this.editItem = { ...this.editItem, image_path: res.path };
          this.persist();
        },
        error: () => {
          this.isUploading = false;
          this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się przesłać zdjęcia' });
        },
      });
    } else {
      this.persist();
    }
  }

  private persist() {
    if (this.isNew) {
      this.campsService.create(this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Obóz dodany' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać' }),
      });
    } else {
      this.campsService.update(this.editItem.id!, this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Zapisano', detail: 'Obóz zaktualizowany' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać' }),
      });
    }
  }

  delete(id: number) {
    this.campsService.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: 'Obóz usunięty' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć' }),
    });
  }
}
