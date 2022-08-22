import { Component, Input, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

@Component({
  selector: 'pizza-name',
  styleUrls: ['pizza-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-name" [formGroup]="form">
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
  `
})
export class PizzaNameComponent implements OnInit, OnChanges {

  vm$: Observable<PizzaState>;

  form: FormGroup;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
    this.form = facade.form;
  }

  get invalid() {
    return (
      this.form.get('name').hasError('required') &&
      this.form.get('name').touched
    );
  }

  ngOnInit() {
    console.log('pizza-name.component.OnInit')
  }

  ngOnChanges() {
    console.log('pizza-name.component.OnChanges')
  }

}