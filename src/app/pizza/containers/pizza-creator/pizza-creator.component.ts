import { ChangeDetectionStrategy, Component } from '@angular/core';

import { PizzaFacade, PizzaState } from '../../pizza.facade';

import { Observable } from 'rxjs';

@Component({
  selector: 'pizza-creator',
  styleUrls: ['pizza-creator.component.scss'],
  providers: [PizzaFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div *ngIf="vm$ | async as vm" class="pizza-creator">
      <div class="pizza-creator__title">
        <h1>
          <img src="assets/logo.svg">
          Pizza Creator
        </h1>
      </div>
      <div class="pizza-creator__panes" [ngClass]="{loading: vm.loading}">
        <pizza-form></pizza-form>
        <pizza-list></pizza-list>
      </div>
    </div>
  `
})
export class PizzaCreatorComponent {

  vm$: Observable<PizzaState>;

  constructor(
    private facade: PizzaFacade
  ) {
    this.vm$ = facade.vm$;
  }

  ngOnInit() {
    console.log('toppings-creator.component.OnInit')
  }

  ngOnChanges() {
    console.log('toppings-creator.component.OnChanges')
  }

}