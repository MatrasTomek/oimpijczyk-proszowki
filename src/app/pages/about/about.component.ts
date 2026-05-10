import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  coaches = [
    { name: 'Jan Kowalski', role: 'Trener główny', license: 'Licencja PZP I klasy' },
    { name: 'Anna Nowak', role: 'Trener grup młodszych', license: 'Licencja PZP II klasy' },
    { name: 'Piotr Wiśniewski', role: 'Trener grup starszych', license: 'Licencja PZP I klasy' },
  ];
}
