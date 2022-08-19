import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Topping } from '../../pizza.interface';

@Component({
  selector: 'pizza-selected',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['pizza-selected.component.scss'],
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-selected" [formGroup]="form">
      <div class="pizza-selected__empty" *ngIf="!selected.length">
        Select toppings to create pizza
      </div>
      <div
        class="pizza-selected__list"
        *ngIf="selected.length"
        formArrayName="toppings">
        <div
          class="pizza-selected__item"
          *ngFor="let topping of selected; index as i;">
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
export class PizzaSelectedComponent {

  @Input() selected: Topping[];

  @Output()
  remove = new EventEmitter<number>();

  vm$: Observable<PizzaState>;

  form: FormGroup;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
    this.form = facade.form;
  }

  get toppingsForm() {
    return this.form.get('toppings') as FormArray;
  }

  onRemove(index: number) {
    this.remove.emit(index);
  }

}