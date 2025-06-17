import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-modal.component.html',
  styleUrl: './alert-modal.component.scss'
})
export class AlertModalComponent {
  @Input() visible = false;
  @Input() message = '¡Operación realizada con éxito!';
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
