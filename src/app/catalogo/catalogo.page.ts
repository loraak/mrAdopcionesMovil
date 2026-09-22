import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonBreadcrumbs,
  IonBreadcrumb,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonChip,
  IonButton
} from '@ionic/angular';

interface Pet {
  id: number;
  name: string;
  age: number;
  type: 'perros' | 'gatos' | 'otros';
  description: string;
  imageUrl: string;
  tags: string[];
}

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonBreadcrumbs,
    IonBreadcrumb,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonBadge,
    IonChip,
    IonButton
  ]
})
export class CatalogoPage implements OnInit {
  selectedCategory = 'todos';

  // Datos simulados (mientras conectas tu Backend)
  pets: Pet[] = [
    {
      id: 1,
      name: 'Firulais',
      age: 2,
      type: 'perros',
      description: 'Un perro muy alegre y sociable con otros animales.',
      imageUrl: 'assets/img/quemiedo.jpg',
      tags: ['Vacunado', 'Esterilizado', 'Juguetón']
    },
    {
      id: 2,
      name: 'Michi',
      age: 1,
      type: 'gatos',
      description: 'Tranquilo y le encanta dormir bajo el sol.',
      imageUrl: 'assets/img/floppa.jpg',
      tags: ['Tranquilo', 'Hogar sin niños']
    },
    {
      id: 3,
      name: 'Ramon',
      age: 3,
      type: 'otros',
      description: 'Un conejito rescatado muy curioso.',
      imageUrl: 'assets/img/rata.jpg',
      tags: ['Esterilizado', 'Poco espacio']
    }
  ];

  filteredPets: Pet[] = [];

  ngOnInit() {
    this.filterPets();
  }

  filterPets() {
    if (this.selectedCategory === 'todos') {
      this.filteredPets = this.pets;
    } else {
      this.filteredPets = this.pets.filter(p => p.type === this.selectedCategory);
    }
  }
}
