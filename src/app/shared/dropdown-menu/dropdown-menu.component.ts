import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown-menu',
  imports: [CommonModule],
  templateUrl: './dropdown-menu.component.html',
  styleUrl: './dropdown-menu.component.scss',
  standalone: true,
})
export class DropdownMenuComponent {
  @Input() id!: string;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  show = false;
  showConfirmModal = false;

  constructor(private elementRef: ElementRef) {}

  toggle(): void {
    this.show = !this.show;
  }

  onEdit(): void {
    this.edit.emit(this.id);
    this.show = false;
  }

  onDelete(): void {
    this.delete.emit(this.id);
    this.show = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.show = false;
    }
  }
}
