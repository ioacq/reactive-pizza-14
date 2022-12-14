import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Topping } from '../../pizza.interface';

@Component({
  selector: 'toppings-selector',
  styleUrls: ['toppings-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="vm$ | async as vm" class="toppings-selector">
      <div
        class="toppings-selector__item"
        *ngFor="let topping of vm.toppings"
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
export class ToppingsSelectorComponent implements OnInit, OnChanges {

  @Output()
  select = new EventEmitter<Topping>();

  vm$: Observable<PizzaState>;

  form: FormGroup;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
    this.form = facade.form;

    console.log('toppings-selector.component.constructor')
  }

  get control() {
    return this.form.get('toppings') as FormArray;
  }

  get invalid() {
    return (
      this.form.hasError('noToppings') &&
      this.control.touched
    );
  }

  ngOnInit() {
    console.log('toppings-selector.component.OnInit')
  }

  ngOnChanges() {
    console.log('toppings-selector.component.OnChanges')
  }

  exists(topping: Topping) {
    return !!~this.control.value.indexOf(topping);
  }

  isActive(topping: Topping) {
    return this.exists(topping);
  }

  onSelect(topping: Topping) {
    this.select.emit(topping);
  }

}