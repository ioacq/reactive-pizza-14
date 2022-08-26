import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '../../../interfaces/operation';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Pizza, Topping } from '../../pizza.interface';
import { ToppingsValidator } from '../../toppings.validator';

@Component({
  selector: 'pizza-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['pizza-form.component.scss'],
  template: `
    <p>Render count: {{ renderCounter() }}</p>

    <form *ngIf="vm$ | async as vm" [formGroup]="form" (ngSubmit)="onSubmit()">

      <toppings-selector
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
export class PizzaFormComponent implements OnInit, OnChanges {

  @Output()
  add = new EventEmitter<FormGroup>();

  vm$: Observable<PizzaState>;

  form: FormGroup;

  private _counter = 0;

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

  ngOnInit() {
    console.log('pizza-form.component.OnInit')
  }

  ngOnChanges() {
    console.log('pizza-form.component.OnChanges')
  }

  addTopping(topping: Topping) {
    this.control.push(new FormControl(topping));
    this.control.markAsTouched();
  }

  removeTopping(index: number) {
    this.control.removeAt(index);
  }

  selectTopping(topping: Topping) {
    const index = this.control.value.indexOf(topping);
    if (!!~index) {
      this.removeTopping(index);
    } else {
      this.addTopping(topping);
    }
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

    // this.facade.doOperation(OperationType.Create, this.form.value);
    this.facade.addPizza(this.form.value);
    this.resetForm();
  }

  public renderCounter(): number {
    return ++this._counter;
  }

}