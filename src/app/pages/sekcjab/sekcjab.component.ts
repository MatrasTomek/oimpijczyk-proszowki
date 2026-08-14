import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { SekcjaBService } from '../../core/services/sekcjab.service';

function nonEmptyArrayValidator(control: AbstractControl): ValidationErrors | null {
  return Array.isArray(control.value) && control.value.length > 0 ? null : { required: true };
}

@Component({
  selector: 'app-sekcjab',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    CheckboxModule,
    TextareaModule,
    ButtonModule,
    MessageModule,
  ],
  templateUrl: './sekcjab.component.html',
  styleUrl: './sekcjab.component.scss',
})
export class SekcjaBComponent {
  private fb = inject(FormBuilder);
  private sekcjaBService = inject(SekcjaBService);

  submitting = signal(false);
  submitted = signal(false);
  errorMsg = signal<string | null>(null);

  styleOptions = [
    { label: 'Klasyczny', value: 'klasyczny' },
    { label: 'Motylkowy', value: 'motylkowy' },
    { label: 'Grzbietowy', value: 'grzbietowy' },
    { label: 'Kraul', value: 'kraul' },
  ];

  form = this.fb.group({
    imieDziecka: ['', [Validators.required, Validators.minLength(3)]],
    nazwiskoDziecka: ['', [Validators.required, Validators.minLength(3)]],
    wiekDziecka: this.fb.control<number | null>(null, [Validators.required, Validators.min(1)]),
    stylePlywackie: this.fb.control<string[]>([], [nonEmptyArrayValidator]),
    imieOpiekuna: ['', [Validators.required, Validators.minLength(3)]],
    nazwiskoOpiekuna: ['', [Validators.required, Validators.minLength(3)]],
    telefon: ['', [Validators.required, Validators.minLength(9)]],
    email: ['', [Validators.required, Validators.email]],
    uwagi: [''],
    rodo: [false, [Validators.requiredTrue]],
  });

  onSubmit(): void {
    if (this.form.invalid || this.submitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    const raw = this.form.getRawValue();
    this.sekcjaBService
      .send({
        imieDziecka: raw.imieDziecka ?? '',
        nazwiskoDziecka: raw.nazwiskoDziecka ?? '',
        wiekDziecka: raw.wiekDziecka ?? 0,
        stylePlywackie: raw.stylePlywackie ?? [],
        imieOpiekuna: raw.imieOpiekuna ?? '',
        nazwiskoOpiekuna: raw.nazwiskoOpiekuna ?? '',
        telefon: raw.telefon ?? '',
        email: raw.email ?? '',
        uwagi: raw.uwagi ?? '',
        rodo: raw.rodo ?? false,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMsg.set(
            'Nie udało się wysłać zgłoszenia. Spróbuj ponownie później lub skontaktuj się z nami telefonicznie.'
          );
        },
      });
  }
}
