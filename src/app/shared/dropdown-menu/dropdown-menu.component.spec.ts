import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuComponent } from './dropdown-menu.component';
import { By } from '@angular/platform-browser';

describe('DropdownMenuComponent', () => {
  let component: DropdownMenuComponent;
  let fixture: ComponentFixture<DropdownMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropdownMenuComponent);
    component = fixture.componentInstance;
    component.id = 'test-dropdown';
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit edit when edit button is clicked', () => {
    jest.spyOn(component.edit, 'emit');
    component.show = true;
    fixture.detectChanges();

    const editBtn = fixture.debugElement.query(By.css('.menu button:first-child'));
    editBtn.nativeElement.click();

    expect(component.edit.emit).toHaveBeenCalledWith('test-dropdown');
  });

  it('should emit delete when delete button is clicked', () => {
    jest.spyOn(component.delete, 'emit');
    component.show = true;
    fixture.detectChanges();

    const deleteBtn = fixture.debugElement.query(By.css('.menu button:last-child'));
    deleteBtn.nativeElement.click();

    expect(component.delete.emit).toHaveBeenCalledWith('test-dropdown');
  });
});
