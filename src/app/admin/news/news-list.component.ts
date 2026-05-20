import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NewsService, NewsItem } from '../../core/services/news.service';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss',
})
export class NewsListComponent implements OnInit {
  private newsService = inject(NewsService);
  private messageService = inject(MessageService);

  items = signal<NewsItem[]>([]);
  isLoading = signal(false);

  dialogVisible = false;
  editItem: Partial<NewsItem> = {};
  isNew = false;

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.newsService.getAll().subscribe({
      next: (data) => { this.items.set(data); this.isLoading.set(false); },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie można załadować aktualności' });
        this.isLoading.set(false);
      },
    });
  }

  openNew() {
    this.editItem = { title: '', excerpt: '', content: '', category: 'Ogólne', published_at: new Date().toISOString().split('T')[0] };
    this.isNew = true;
    this.dialogVisible = true;
  }

  openEdit(item: NewsItem) {
    this.editItem = { ...item, published_at: item.published_at?.split('T')[0] ?? '' };
    this.isNew = false;
    this.dialogVisible = true;
  }

  save() {
    if (this.isNew) {
      this.newsService.create(this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Dodano', detail: 'Aktualność została dodana' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się dodać' }),
      });
    } else {
      this.newsService.update(this.editItem.id!, this.editItem).subscribe({
        next: () => { this.dialogVisible = false; this.load(); this.messageService.add({ severity: 'success', summary: 'Zapisano', detail: 'Aktualność zaktualizowana' }); },
        error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się zapisać' }),
      });
    }
  }

  delete(id: number) {
    this.newsService.delete(id).subscribe({
      next: () => { this.load(); this.messageService.add({ severity: 'success', summary: 'Usunięto', detail: 'Aktualność usunięta' }); },
      error: () => this.messageService.add({ severity: 'error', summary: 'Błąd', detail: 'Nie udało się usunąć' }),
    });
  }
}
