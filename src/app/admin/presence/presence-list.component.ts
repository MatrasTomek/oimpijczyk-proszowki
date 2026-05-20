import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PresenceService, PresenceItem } from '../../core/services/presence.service';

@Component({
  selector: 'app-presence-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, ToggleSwitchModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="admin-section-header">
      <h1 class="admin-page-title">Sekcja obecności</h1>
      <button pButton label="Dodaj kartę" icon="pi pi-plus" class="p-button" (click)="openNew()"></button>
    </div>

    <p-table [value]="items()" styleClass="admin-table" [tableStyle]="{'min-width':'700px'}">
      <ng-template pTemplate="header">
        <tr>
          <th style="width:50px">Kol.</th>
          <th>Tytuł</th>
          <th>Metryka</th>
          <th>Ikona</th>
          <th style="width:80px">Aktywna</th>
          <th style="width:100px">Akcje</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.sort_order }}</td>
          <td>
            <strong>{{ item.title }}</strong><br />
            <small style="color:#aaa">{{ item.subtitle }}</small>
          </td>
          <td>{{ item.metric }}</td>
          <td><i [class]="'pi ' + item.icon" style="color:#F5A623"></i> {{ item.icon }}</td>
          <td><span [class]="item.active ? 'badge-on' : 'badge-off'">{{ item.active ? 'Tak' : 'Nie' }}</span></td>
          <td>
            <div style="display:flex;gap:0.5rem">
              <button pButton icon="pi pi-pencil" class="p-button-sm p-button-outlined" (click)="openEdit(item)"></button>
              <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger" (click)="delete(item.id)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr><td colspan="6" style="text-align:center;color:#aaa;padding:2rem">Brak kart</td></tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialogVisible" [header]="isNew ? 'Nowa karta' : 'Edytuj kartę'" [modal]="true" [style]="{width:'560px'}">
      <div class="dialog-form">
        <div class="field"><label>Tytuł</label><input pInputText [(ngModel)]="editItem.title" class="w-full" /></div>
        <div class="field"><label>Podtytuł</label><input pInputText [(ngModel)]="editItem.subtitle" class="w-full" /></div>
        <div class="field"><label>Opis</label><textarea pTextarea [(ngModel)]="editItem.description" rows="3" class="w-full"></textarea></div>
        <div class="field"><label>Metryka (np. 150+ zawodów)</label><input pInputText [(ngModel)]="editItem.metric" class="w-full" /></div>
        <div class="field"><label>Ikona PrimeIcons (np. pi-trophy)</label><input pInputText [(ngModel)]="editItem.icon" class="w-full" placeholder="pi-trophy" /></div>
        <div class="field">
          <label>Zdjęcie</label>
          <div class="upload-row">
            <input pInputText [(ngModel)]="editItem.image_path" class="w-full" placeholder="(opcjonalnie — lub wgraj plik)" />
            <label class="upload-mini">
              <i class="pi pi-upload"></i>
              <input type="file" accept="image/*" (change)="onImageSelect($event)" style="display:none" />
            </label>
          </div>
          @if (editItem.image_path) {
            <img [src]="presenceService.imageUrl(editItem.image_path)" alt="" class="img-preview" (error)="onImgError($event)" />
          }
        </div>
        <div class="field"><label>Kolejność</label><input pInputText type="number" [(ngModel)]="editItem.sort_order" class="w-full" /></div>
        <div class="field field-inline">
          <label>Aktywna</label>
          <p-toggleswitch [(ngModel)]="activeToggle" />
        </div>
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
    .field-inline { flex-direction: row; align-items: center; gap: 1rem; label { margin-bottom: 0; } }
    .w-full { width: 100%; }
    .upload-row { display: flex; gap: 0.5rem; align-items: center; }
    .upload-mini { display: flex; align-items: center; padding: 0.5rem 0.75rem; background: #1e1e1e; border: 1px solid #2a2a2a; border-radius: 4px; cursor: pointer; color: #F5A623; &:hover { background: #2a2a2a; } }
    .img-preview { width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 0.5rem; }
    .badge-on { padding: 0.2rem 0.6rem; border-radius: 12px; background: #1a3a1a; color: #4caf50; font-size: 0.75rem; font-weight: 600; }
    .badge-off { padding: 0.2rem 0.6rem; border-radius: 12px; background: #2a2a2a; color: #aaa; font-size: 0.75rem; font-weight: 600; }
  `]
})
export class PresenceListComponent implements OnInit {
  presenceService = inject(PresenceService);
  private messageService = inject(MessageService);

  items = signal<PresenceItem[]>([]);
  dialogVisible = false;
  editItem: Partial<PresenceItem> = {};
  activeToggle = true;
  isNew = false;

  ngOnInit() { this.load(); }

  load() {
    this.presenceService.getAll().subscribe({
      next: (data) => this.items.set(data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie można załadować kart' }),
    });
  }

  openNew() {
    this.editItem = { title: '', subtitle: '', description: '', metric: '', icon: 'pi-star', image_path: null, sort_order: this.items().length, active: 1 };
    this.activeToggle = true;
    this.isNew = true;
    this.dialogVisible = true;
  }

  openEdit(item: PresenceItem) {
    this.editItem = { ...item };
    this.activeToggle = !!item.active;
    this.isNew = false;
    this.dialogVisible = true;
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.[0]) return;
    this.presenceService.uploadImage(input.files[0]).subscribe({
      next: (res) => { this.editItem.image_path = res.path; this.messageService.add({ severity: 'success', summary: 'Wgrano', detail: 'Zdjęcie przesłane' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się wgrać zdjęcia' }),
    });
  }

  onImgError(event: Event) { (event.target as HTMLImageElement).style.display = 'none'; }

  save() {
    const payload = { ...this.editItem, active: this.activeToggle ? 1 : 0 };
    if (this.isNew) {
      this.presenceService.create(payload).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Karta dodana' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać' }),
      });
    } else {
      this.presenceService.update(payload.id!, payload).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Zapisano', detail: 'Karta zaktualizowana' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać' }),
      });
    }
  }

  delete(id: number) {
    this.presenceService.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: 'Karta usunięta' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć' }),
    });
  }
}
