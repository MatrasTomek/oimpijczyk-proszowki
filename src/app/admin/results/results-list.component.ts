import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ResultsService, Result } from '../../core/services/results.service';

@Component({
  selector: 'app-results-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="admin-section-header">
      <h1 class="admin-page-title">Wyniki zawodów</h1>
      <button pButton label="Dodaj wynik" icon="pi pi-plus" class="p-button" (click)="openNew()"></button>
    </div>

    <p-table [value]="items()" styleClass="admin-table" [tableStyle]="{'min-width':'900px'}" [paginator]="true" [rows]="20">
      <ng-template pTemplate="header">
        <tr>
          <th>Zawodnik</th>
          <th>Zawody</th>
          <th>Dyscyplina</th>
          <th>Wynik</th>
          <th>Miejsce</th>
          <th>Data</th>
          <th style="width:100px">Akcje</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-item>
        <tr>
          <td>{{ item.athlete }}</td>
          <td>{{ item.competition }}</td>
          <td>{{ item.discipline }}</td>
          <td>{{ item.result_time }}</td>
          <td>{{ item.place }}</td>
          <td>{{ item.competition_date | date:'d MMM yyyy':'':'pl' }}</td>
          <td>
            <div style="display:flex;gap:0.5rem">
              <button pButton icon="pi pi-pencil" class="p-button-sm p-button-outlined" (click)="openEdit(item)"></button>
              <button pButton icon="pi pi-trash" class="p-button-sm p-button-outlined p-button-danger" (click)="delete(item.id)"></button>
            </div>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr><td colspan="7" style="text-align:center;color:#aaa;padding:2rem">Brak wyników</td></tr>
      </ng-template>
    </p-table>

    <p-dialog [(visible)]="dialogVisible" [header]="isNew ? 'Nowy wynik' : 'Edytuj wynik'" [modal]="true" [style]="{width:'520px'}">
      <div class="dialog-form">
        <div class="field"><label>Zawodnik</label><input pInputText [(ngModel)]="editItem.athlete" class="w-full" /></div>
        <div class="field"><label>Zawody</label><input pInputText [(ngModel)]="editItem.competition" class="w-full" /></div>
        <div class="field"><label>Dyscyplina</label><input pInputText [(ngModel)]="editItem.discipline" class="w-full" placeholder="np. 100m dowolny" /></div>
        <div class="field"><label>Wynik (czas)</label><input pInputText [(ngModel)]="editItem.result_time" class="w-full" placeholder="np. 1:02.34" /></div>
        <div class="field"><label>Miejsce</label><input pInputText type="number" [(ngModel)]="editItem.place" class="w-full" /></div>
        <div class="field"><label>Data zawodów</label><input pInputText type="date" [(ngModel)]="editItem.competition_date" class="w-full" /></div>
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
export class ResultsListComponent implements OnInit {
  private resultsService = inject(ResultsService);
  private messageService = inject(MessageService);

  items = signal<Result[]>([]);
  dialogVisible = false;
  editItem: Partial<Result> = {};
  isNew = false;

  ngOnInit() { this.load(); }

  load() {
    this.resultsService.getAll().subscribe({
      next: (data) => this.items.set(data),
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie można załadować wyników' }),
    });
  }

  openNew() {
    this.editItem = { athlete: '', competition: '', discipline: '', result_time: '', place: 1, competition_date: new Date().toISOString().split('T')[0] };
    this.isNew = true;
    this.dialogVisible = true;
  }

  openEdit(item: Result) {
    this.editItem = { ...item };
    this.isNew = false;
    this.dialogVisible = true;
  }

  save() {
    if (this.isNew) {
      this.resultsService.create(this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Wynik dodany' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać' }),
      });
    } else {
      this.resultsService.update(this.editItem.id!, this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Zapisano', detail: 'Wynik zaktualizowany' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać' }),
      });
    }
  }

  delete(id: number) {
    this.resultsService.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: 'Wynik usunięty' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć' }),
    });
  }
}
