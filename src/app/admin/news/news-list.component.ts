import { Component, signal } from '@angular/core';
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

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
}

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, TextareaModule, ConfirmDialogModule, ToastModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.scss'
})
export class NewsListComponent {
  items = signal<NewsItem[]>([
    { id: 1, title: 'Sukces na Mistrzostwach Małopolski', excerpt: 'Nasi zawodnicy zdobyli 5 złotych medali...', content: '', date: '2025-04-20', category: 'Wyniki' },
    { id: 2, title: 'Letni Obóz Szkoleniowy 2025', excerpt: 'Zapisy na letni obóz szkoleniowy już otwarte!', content: '', date: '2025-04-10', category: 'Obozy' },
  ]);

  dialogVisible = false;
  editItem: Partial<NewsItem> = {};
  isNew = false;

  openNew() {
    this.editItem = { title: '', excerpt: '', content: '', category: '', date: new Date().toISOString().split('T')[0] };
    this.isNew = true;
    this.dialogVisible = true;
  }

  openEdit(item: NewsItem) {
    this.editItem = { ...item };
    this.isNew = false;
    this.dialogVisible = true;
  }

  save() {
    if (this.isNew) {
      const newItem = { ...this.editItem, id: Date.now() } as NewsItem;
      this.items.update(list => [...list, newItem]);
    } else {
      this.items.update(list => list.map(i => i.id === this.editItem.id ? { ...i, ...this.editItem } as NewsItem : i));
    }
    this.dialogVisible = false;
  }

  delete(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }
}
