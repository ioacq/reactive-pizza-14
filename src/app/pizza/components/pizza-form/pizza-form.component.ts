import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Pizza, Topping } from '../../pizza.interface';
import { ToppingsValidator } from '../../toppings.validator';

@Component({
  selector: 'pizza-form',

  styleUrls: ['pizza-form.component.scss'],
  template: `
    <form *ngIf="vm$ | async as vm" [formGroup]="form" (ngSubmit)="onSubmit()">

      <toppings-selector
        [selected]="control.value"
        (select)="selectTopping($event)">
      </toppings-selector>

      <div class="pizza-name">
        <input
          type="text"
          placeholder="Pizza name, e.g. Blazin' hot"
          formControlName="name">
        <div
          class="error"
          *ngIf="invalid">
          Pizza name is required
        </div>
      </div>

      <pizza-selected
        [selected]="control.value"
        (remove)="removeTopping($event)">
      </pizza-selected>

      <div class="pizza-button">
        <button
          type="submit"
          [disabled]="form.invalid">
          <img src="assets/add.svg">
          Add pizza
        </button>
      </div>

    </form>
  `
})
export class PizzaFormComponent {

  @Input()
  toppings: Topping[];

  @Output()
  add = new EventEmitter<FormGroup>();

  vm$: Observable<PizzaState>;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facade: PizzaFacade,
  ) {
    this.vm$ = facade.vm$;
    this.form = facade.buildForm();
  }

  get control() {
    return this.form.get('toppings') as FormArray;
  }

  get invalid() {
    return (
      this.form.get('name').hasError('required') &&
      this.form.get('name').touched
    );
  }

  addTopping(topping: Topping) {
    this.control.push(new FormControl(topping));
    this.control.markAsTouched();
  }

  removeTopping(index: number) {
    this.control.removeAt(index);

    // this.facade.detectChange();
  }

  selectTopping(topping: Topping) {
    const index = this.control.value.indexOf(topping);
    if (!!~index) {
      this.removeTopping(index);
    } else {
      this.addTopping(topping);
    }

    // this.facade.detectChange();
  }

  resetForm(): void {
    this.control.clear();
    this.control.reset();
    this.form.reset();
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.facade.addPizza(this.form.value);
    this.resetForm();
  }

}