import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true, // ✅ Cambiar a true
  imports: [IonicModule, CommonModule] // ✅ Agregar imports necesarios
})
export class TabsPage {
  constructor() {}
}