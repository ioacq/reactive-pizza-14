import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

import { Topping } from '../../pizza.interface';

@Component({
  selector: 'toppings-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['toppings-selector.component.scss'],
  template: `
    <div class="toppings-selector" [formGroup]="parent">
      <div
        class="toppings-selector__item"
        *ngFor="let topping of toppings"
        [class.active]="isActive(topping)"
        (click)="onSelect(topping)">
        {{ topping }}
      </div>
      <div 
        class="error"
        *ngIf="invalid">
        Select at least 1 topping
      </div>
    </div>
  `
})
export class ToppingsSelectorComponent {

  @Input()
  parent: FormGroup;

  @Input()
  selected: Topping[];

  @Input()
  toppings: Topping[];

  @Output()
  select = new EventEmitter<Topping>();

  get control() {
    return this.parent.get('toppings') as FormArray;
  }

  get invalid() {
    console.log('control.touched: ', this.control.touched);
    console.log('control.pristine: ', this.control.pristine);
    return (
      this.parent.hasError('noToppings') &&
      this.control.touched
    );
  }

  exists(topping: Topping) {
    return !!~this.selected.indexOf(topping);
  }

  isActive(topping: Topping) {
    return this.exists(topping);
  }

  onSelect(topping: Topping) {
    this.select.emit(topping);
  }

}