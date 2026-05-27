import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import {
  TrainingsService,
  TrainingGroup,
  TrainingSession,
} from '../../core/services/trainings.service';

@Component({
  selector: 'app-trainings-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PanelModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="admin-section-header">
      <h1 class="admin-page-title">Harmonogram treningów</h1>
      <button
        pButton
        label="Dodaj grupę"
        icon="pi pi-plus"
        class="p-button"
        (click)="openNewGroup()"
      ></button>
    </div>

    @for (group of groups(); track group.id) {
      <p-panel [toggleable]="true" styleClass="group-panel">
        <ng-template pTemplate="header">
          <div class="group-header">
            <span class="group-name">{{ group.name }}</span>
            <span class="group-meta">{{ group.age_range }}</span>
            @if (group.level) {
              <span class="group-level">{{ group.level }}</span>
            }
          </div>
        </ng-template>
        <ng-template pTemplate="icons">
          <div class="panel-actions">
            <button
              pButton
              icon="pi pi-pencil"
              class="p-button-sm p-button-text"
              (click)="openEditGroup(group); $event.stopPropagation()"
            ></button>
            <button
              pButton
              icon="pi pi-trash"
              class="p-button-sm p-button-text p-button-danger"
              (click)="deleteGroup(group.id); $event.stopPropagation()"
            ></button>
            <button
              pButton
              icon="pi pi-plus"
              label="Sesja"
              class="p-button-sm p-button-text"
              style="color:#F5A623"
              (click)="openNewSession(group.id); $event.stopPropagation()"
            ></button>
          </div>
        </ng-template>

        <div class="sessions-table">
          <table>
            <thead>
              <tr>
                <th>Dzień</th>
                <th>Czas</th>
                <th>Rano</th>
                <th>Basen</th>
                <th>Lokalizacja</th>
                <th>Basen (lato)</th>
                <th style="width:80px"></th>
              </tr>
            </thead>
            <tbody>
              @for (s of group.sessions; track s.id) {
                <tr>
                  <td>{{ s.day_of_week }}</td>
                  <td>{{ s.time_start }}</td>
                  <td>{{ s.time_morning ?? '—' }}</td>
                  <td>{{ s.pool ?? '—' }}</td>
                  <td>{{ s.location ?? '—' }}</td>
                  <td>{{ s.pool_summer ?? '—' }}</td>
                  <td>
                    <div class="row-actions">
                      <button
                        pButton
                        icon="pi pi-pencil"
                        class="p-button-sm p-button-text"
                        (click)="openEditSession(s)"
                      ></button>
                      <button
                        pButton
                        icon="pi pi-trash"
                        class="p-button-sm p-button-text p-button-danger"
                        (click)="deleteSession(s.id)"
                      ></button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="empty-row">
                    Brak sesji — kliknij "+ Sesja"
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </p-panel>
    }

    @if (groups().length === 0) {
      <div class="empty-state">
        <i class="pi pi-clock"></i>
        <p>Brak grup treningowych.</p>
      </div>
    }

    <!-- Formularz grupy -->
    <p-dialog
      [(visible)]="groupDialog"
      [header]="isNewGroup ? 'Nowa grupa' : 'Edytuj grupę'"
      [modal]="true"
      [style]="{ width: '420px' }"
    >
      <div class="dialog-form">
        <div class="field">
          <label>Nazwa grupy</label
          ><input pInputText [(ngModel)]="editGroup.name" class="w-full" />
        </div>
        <div class="field">
          <label>Przedział wiekowy</label
          ><input
            pInputText
            [(ngModel)]="editGroup.age_range"
            class="w-full"
            placeholder="np. 10–11 lat"
          />
        </div>
        <div class="field">
          <label>Poziom</label
          ><input
            pInputText
            [(ngModel)]="editGroup.level"
            class="w-full"
            placeholder="opcjonalnie"
          />
        </div>
        <div class="field">
          <label>Kolejność</label
          ><input
            pInputText
            type="number"
            [(ngModel)]="editGroup.sort_order"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button
          pButton
          label="Anuluj"
          class="p-button-outlined"
          (click)="groupDialog = false"
        ></button>
        <button
          pButton
          label="Zapisz"
          class="p-button"
          (click)="saveGroup()"
        ></button>
      </ng-template>
    </p-dialog>

    <!-- Formularz sesji -->
    <p-dialog
      [(visible)]="sessionDialog"
      [header]="isNewSession ? 'Nowa sesja' : 'Edytuj sesję'"
      [modal]="true"
      [style]="{ width: '560px' }"
    >
      <div class="dialog-form">
        <div class="field">
          <label>Dzień tygodnia</label
          ><input
            pInputText
            [(ngModel)]="editSession.day_of_week"
            class="w-full"
            placeholder="np. Wtorek"
          />
        </div>
        <div class="field">
          <label>Godzina (główna)</label
          ><input
            pInputText
            [(ngModel)]="editSession.time_start"
            class="w-full"
            placeholder="np. 17:00"
          />
        </div>
        <div class="field">
          <label>Godzina (poranna)</label
          ><input
            pInputText
            [(ngModel)]="editSession.time_morning"
            class="w-full"
            placeholder="opcjonalnie"
          />
        </div>
        <div class="field">
          <label>Typ treningu porannego</label
          ><input
            pInputText
            [(ngModel)]="editSession.workout_type"
            class="w-full"
            placeholder="np. Siłownia"
          />
        </div>
        <div class="field">
          <label>Basen (zima)</label
          ><input
            pInputText
            [(ngModel)]="editSession.pool"
            class="w-full"
            placeholder="np. Proszówki 25m"
          />
        </div>
        <div class="field">
          <label>Lokalizacja (zima)</label
          ><input
            pInputText
            [(ngModel)]="editSession.location"
            class="w-full"
          />
        </div>
        <div class="field">
          <label>Basen (lato)</label
          ><input
            pInputText
            [(ngModel)]="editSession.pool_summer"
            class="w-full"
          />
        </div>
        <div class="field">
          <label>Lokalizacja (lato)</label
          ><input
            pInputText
            [(ngModel)]="editSession.location_summer"
            class="w-full"
          />
        </div>
        <div class="field">
          <label>Kolejność</label
          ><input
            pInputText
            type="number"
            [(ngModel)]="editSession.sort_order"
            class="w-full"
          />
        </div>
      </div>
      <ng-template pTemplate="footer">
        <button
          pButton
          label="Anuluj"
          class="p-button-outlined"
          (click)="sessionDialog = false"
        ></button>
        <button
          pButton
          label="Zapisz"
          class="p-button"
          (click)="saveSession()"
        ></button>
      </ng-template>
    </p-dialog>
  `,
  styles: [
    `
      .admin-page-title {
        font-family: 'Oswald', sans-serif;
        font-size: 2rem;
        color: #f5a623;
        text-transform: uppercase;
        margin-bottom: 0;
      }
      .admin-section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
      }
      :host ::ng-deep .group-panel {
        margin-bottom: 1rem;
        background: #111;
        border: 1px solid #2a2a2a;
        border-radius: 8px;
      }
      :host ::ng-deep .group-panel .p-panel-header {
        background: #1e1e1e !important;
        border-color: #2a2a2a !important;
      }
      .group-header {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .group-name {
        font-family: 'Oswald', sans-serif;
        font-size: 1.1rem;
        color: #f5a623;
        text-transform: uppercase;
      }
      .group-meta {
        color: #aaa;
        font-size: 0.875rem;
      }
      .group-level {
        color: #888;
        font-size: 0.8rem;
        background: #2a2a2a;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
      }
      .sessions-table {
        overflow-x: auto;
      }
      .sessions-table table {
        width: 100%;
        border-collapse: collapse;
        font-size: 0.875rem;
      }
      .sessions-table th {
        color: #f5a623;
        text-align: left;
        padding: 0.5rem 0.75rem;
        border-bottom: 1px solid #2a2a2a;
        font-family: 'Oswald', sans-serif;
        text-transform: uppercase;
        font-size: 0.8rem;
      }
      .sessions-table td {
        padding: 0.5rem 0.75rem;
        color: #ccc;
        border-bottom: 1px solid #1e1e1e;
      }
      .sessions-table tr:last-child td {
        border-bottom: none;
      }
      .empty-row {
        color: #555;
        text-align: center;
        font-style: italic;
      }
      :host ::ng-deep .p-panel-icons-end {
        display: flex;
        align-items: center;
        gap: 7px;
      }
      :host ::ng-deep .panel-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      :host ::ng-deep .panel-actions .p-button {
        height: 2rem;
      }
      .row-actions {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
      .empty-state {
        text-align: center;
        padding: 4rem;
        color: #aaa;
        i {
          font-size: 3rem;
          color: #2a2a2a;
          display: block;
          margin-bottom: 1rem;
        }
      }
      .dialog-form {
        display: flex;
        flex-direction: column;
      }
      .field {
        margin-bottom: 1rem;
        label {
          display: block;
          color: #ccc;
          font-size: 0.875rem;
          margin-bottom: 0.4rem;
        }
      }
      .w-full {
        width: 100%;
      }
    `,
  ],
})
export class TrainingsListComponent implements OnInit {
  private trainingsService = inject(TrainingsService);
  private messageService = inject(MessageService);

  groups = signal<TrainingGroup[]>([]);

  groupDialog = false;
  editGroup: Partial<TrainingGroup> = {};
  isNewGroup = false;

  sessionDialog = false;
  editSession: Partial<TrainingSession> = {};
  isNewSession = false;

  ngOnInit() {
    this.load();
  }

  load() {
    this.trainingsService.getGroups().subscribe({
      next: (data) => this.groups.set(data),
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie można załadować grup',
        }),
    });
  }

  // --- GRUPY ---
  openNewGroup() {
    this.editGroup = {
      name: '',
      age_range: '',
      level: '',
      sort_order: this.groups().length,
    };
    this.isNewGroup = true;
    this.groupDialog = true;
  }

  openEditGroup(group: TrainingGroup) {
    this.editGroup = { ...group };
    this.isNewGroup = false;
    this.groupDialog = true;
  }

  saveGroup() {
    if (this.isNewGroup) {
      this.trainingsService.createGroup(this.editGroup).subscribe({
        next: () => {
          this.groupDialog = false;
          this.load();
          this.messageService.add({
            severity: 'success',
            summary: 'Dodano',
            detail: 'Grupa dodana',
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się dodać grupy',
          }),
      });
    } else {
      this.trainingsService
        .updateGroup(this.editGroup.id!, this.editGroup)
        .subscribe({
          next: () => {
            this.groupDialog = false;
            this.load();
            this.messageService.add({
              severity: 'success',
              summary: 'Zapisano',
              detail: 'Grupa zaktualizowana',
            });
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zapisać',
            }),
        });
    }
  }

  deleteGroup(id: number) {
    this.trainingsService.deleteGroup(id).subscribe({
      next: () => {
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: 'Usunięto',
          detail: 'Grupa usunięta',
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się usunąć',
        }),
    });
  }

  // --- SESJE ---
  openNewSession(groupId: number) {
    this.editSession = {
      group_id: groupId,
      day_of_week: '',
      time_start: '',
      sort_order: 0,
    };
    this.isNewSession = true;
    this.sessionDialog = true;
  }

  openEditSession(session: TrainingSession) {
    this.editSession = { ...session };
    this.isNewSession = false;
    this.sessionDialog = true;
  }

  saveSession() {
    if (this.isNewSession) {
      this.trainingsService.createSession(this.editSession).subscribe({
        next: () => {
          this.sessionDialog = false;
          this.load();
          this.messageService.add({
            severity: 'success',
            summary: 'Dodano',
            detail: 'Sesja dodana',
          });
        },
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Błąd',
            detail: 'Nie udało się dodać sesji',
          }),
      });
    } else {
      this.trainingsService
        .updateSession(this.editSession.id!, this.editSession)
        .subscribe({
          next: () => {
            this.sessionDialog = false;
            this.load();
            this.messageService.add({
              severity: 'success',
              summary: 'Zapisano',
              detail: 'Sesja zaktualizowana',
            });
          },
          error: () =>
            this.messageService.add({
              severity: 'error',
              summary: 'Błąd',
              detail: 'Nie udało się zapisać',
            }),
        });
    }
  }

  deleteSession(id: number) {
    this.trainingsService.deleteSession(id).subscribe({
      next: () => {
        this.load();
        this.messageService.add({
          severity: 'success',
          summary: 'Usunięto',
          detail: 'Sesja usunięta',
        });
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Błąd',
          detail: 'Nie udało się usunąć',
        }),
    });
  }
}
