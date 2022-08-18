import { Component } from '@angular/core';

import { PizzaService } from '../../pizza.service';

import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Pizza, Topping } from '../../pizza.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'pizza-creator',
  styleUrls: ['pizza-creator.component.scss'],
  providers: [PizzaFacade],
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-creator">
      <div class="pizza-creator__title">
        <h1>
          <img src="assets/logo.svg">
          Pizza Creator
        </h1>
      </div>
      <div class="pizza-creator__panes" [ngClass]="{loading: vm.loading}">
        <pizza-form
          [toppings]="vm.toppings"
          (add)="addPizza($event)">
        </pizza-form>
        <pizza-list
          [pizzas]="vm.pizzas">
        </pizza-list>
      </div>
    </div>
  `
})
export class PizzaCreatorComponent {

  vm$: Observable<PizzaState>;

  constructor(
    private pizzaService: PizzaService,
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
  }

  addPizza(event: any) {
    this.facade.addPizza(event);
  }

}