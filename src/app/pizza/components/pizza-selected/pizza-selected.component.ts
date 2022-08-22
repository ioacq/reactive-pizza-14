import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Topping } from '../../pizza.interface';

@Component({
  selector: 'pizza-selected',
  styleUrls: ['pizza-selected.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-selected" [formGroup]="form">
      <div class="pizza-selected__empty" *ngIf="!control.value.length">
        Select toppings to create pizza
      </div>
      <div
        class="pizza-selected__list"
        *ngIf="control.value.length"
        formArrayName="toppings">
        <div
          class="pizza-selected__item"
          *ngFor="let topping of control.value; index as i;">
          <div [formGroupName]="i">
            <img src="assets/check.svg">
            {{ topping }}
            <button
              type="button"
              (click)="onRemove(i)">
              <img src="assets/cross.svg">
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PizzaSelectedComponent implements OnInit, OnChanges {

  @Output()
  remove = new EventEmitter<number>();

  vm$: Observable<PizzaState>;

  form: FormGroup;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
    this.form = facade.form;

    console.log('pizza-selected.component.constructor')
  }

  get control() {
    return this.form.get('toppings') as FormArray;
  }

  ngOnInit() {
    console.log('pizza-selected.component.OnInit')
  }

  ngOnChanges() {
    console.log('pizza-selected.component.OnChanges')
  }

  onRemove(index: number) {
    this.remove.emit(index);
  }

}