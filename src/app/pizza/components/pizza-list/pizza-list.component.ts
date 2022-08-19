import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Pizza } from '../../pizza.interface';

@Component({
  selector: 'pizza-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['pizza-list.component.scss'],
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-list">
      <h2>Store inventory</h2>
      <div *ngFor="let pizza of vm.pizzas">
        <p>{{ pizza.name }}</p>
        <span>{{ pizza.toppings | join }}</span>
      </div>
    </div>
  `
})
export class PizzaListComponent {

  @Input()
  pizzas: Pizza[];

  vm$: Observable<PizzaState>;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
  }

}