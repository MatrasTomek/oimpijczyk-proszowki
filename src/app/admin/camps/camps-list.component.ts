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
      </div>
      <ng-template pTemplate="footer">
        <button pButton label="Anuluj" class="p-button-outlined" (click)="dialogVisible = false"></button>
        <button pButton label="Zapisz" class="p-button" (click)="save()"></button>
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
    this.dialogVisible = true;
  }

  openEdit(item: Camp) {
    this.editItem = { ...item };
    this.isNew = false;
    this.dialogVisible = true;
  }

  save() {
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
