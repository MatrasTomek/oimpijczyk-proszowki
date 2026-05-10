import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TagModule } from 'primeng/tag';

interface Camp {
  id: number;
  name: string;
  location: string;
  dateFrom: string;
  dateTo: string;
  description: string;
  spotsTotal: number;
  spotsLeft: number;
}

@Component({
  selector: 'app-camps-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, TagModule],
  template: `
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
          <th style="width:120px">Akcje</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.location }}</td>
          <td>{{ item.dateFrom | date:'d MMM':'':'pl' }} – {{ item.dateTo | date:'d MMM yyyy':'':'pl' }}</td>
          <td>{{ item.spotsLeft }} / {{ item.spotsTotal }}</td>
          <td>
            <div style="display:flex;gap:0.5rem">
              <button pButton icon="pi pi-pencil" class="p-button-sm p-button-outlined" (click)="openEdit(item)"></button>
              <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger" (click)="delete(item.id)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialogVisible" [header]="isNew ? 'Nowy obóz' : 'Edytuj obóz'" [modal]="true" [style]="{width:'560px'}">
      <div class="dialog-form">
        <div class="field"><label>Nazwa</label><input pInputText [(ngModel)]="editItem.name" class="w-full" /></div>
        <div class="field"><label>Lokalizacja</label><input pInputText [(ngModel)]="editItem.location" class="w-full" /></div>
        <div class="field"><label>Data od</label><input pInputText type="date" [(ngModel)]="editItem.dateFrom" class="w-full" /></div>
        <div class="field"><label>Data do</label><input pInputText type="date" [(ngModel)]="editItem.dateTo" class="w-full" /></div>
        <div class="field"><label>Opis</label><textarea pTextarea [(ngModel)]="editItem.description" rows="4" class="w-full"></textarea></div>
        <div class="field"><label>Liczba miejsc ogółem</label><input pInputText type="number" [(ngModel)]="editItem.spotsTotal" class="w-full" /></div>
        <div class="field"><label>Wolnych miejsc</label><input pInputText type="number" [(ngModel)]="editItem.spotsLeft" class="w-full" /></div>
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
  `]
})
export class CampsListComponent {
  items = signal<Camp[]>([
    { id: 1, name: 'Letni Obóz 2025', location: 'Krynica-Zdrój', dateFrom: '2025-07-07', dateTo: '2025-07-21', description: '', spotsTotal: 30, spotsLeft: 8 }
  ]);

  dialogVisible = false;
  editItem: Partial<Camp> = {};
  isNew = false;

  openNew() {
    this.editItem = { name: '', location: '', dateFrom: '', dateTo: '', description: '', spotsTotal: 30, spotsLeft: 30 };
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
      this.items.update(list => [...list, { ...this.editItem, id: Date.now() } as Camp]);
    } else {
      this.items.update(list => list.map(i => i.id === this.editItem.id ? { ...i, ...this.editItem } as Camp : i));
    }
    this.dialogVisible = false;
  }

  delete(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }
}
