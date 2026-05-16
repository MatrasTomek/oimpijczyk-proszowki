import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
  coaches = [
    {
      name: 'Trener 1',
      role: 'Trener główny',
      license: 'Licencja PZP II klasy',
    },
    {
      name: 'Trener 2',
      role: 'Trener grup młodszych',
      license: 'Licencja PZP II klasy',
    },
  ];
}
