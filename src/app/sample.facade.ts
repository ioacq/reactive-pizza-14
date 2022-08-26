import { State } from './interfaces/state';
import { Facade } from './facade';
import { Pizza, Topping } from './pizza/pizza.interface';
import { Injectable } from '@angular/core';

import { map, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { PizzaService } from './pizza/pizza.service';

export interface SampleState extends State<Pizza> {
  pizzaSearch: string;
  toppings: Topping[];
  toppingSearch: string;
}

let _state: SampleState = {
  records: [],
  pizzaSearch: '',
  toppings: [],
  toppingSearch: '',
  pagination: {
    currentPage: 0,
    pageSizes: [5, 10, 20, 50],
    selectedSize: 50,
  },
  operation: {
    type: null,
    model: null,
  },
  loading: false,
  counter: 0,
};

@Injectable()
export class SampleFacade extends Facade<SampleState> {

  pizzas$ = this.state$.pipe(
    map((state) => state.records),
    distinctUntilChanged()
  );
  toppings$ = this.state$.pipe(
    map((state) => state.toppings),
    distinctUntilChanged()
  );
  pizzaSearch$ = this.state$.pipe(
    map((state) => state.pizzaSearch),
    distinctUntilChanged()
  );
  toppingSearch$ = this.state$.pipe(
    map((state) => state.toppingSearch),
    distinctUntilChanged()
  );
  pagination$ = this.state$.pipe(
    map((state) => state.pagination),
    distinctUntilChanged()
  );
  operation$ = this.state$.pipe(
    map((state) => state.operation),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map((state) => state.loading));
  counter$ = this.state$.pipe(
    map((state) => state.counter),
    distinctUntilChanged()
  );

  /**
   * Viewmodel that resolves once all the data is ready (or updated)...
   */
  vm$: Observable<SampleState> = combineLatest(
    this.pizzas$,
    this.toppings$,
    this.pizzaSearch$,
    this.toppingSearch$,
    this.pagination$,
    this.operation$,
    this.loading$,
    this.counter$,
  ).pipe(
    map(([ pizzas, toppings, pizzaSearch, toppingSearch, pagination, operation, loading, counter ]) => {
      return {
        records: pizzas,
        pizzaSearch,
        toppings,
        toppingSearch,
        pagination,
        operation,
        loading,
        counter,
      };
    })
  );

  constructor(private service: PizzaService) {
    super(_state);

    combineLatest(this.pizzaSearch$, this.pagination$)
      .pipe(
        switchMap(([pizzaSearch, pagination]) => {
          console.log('switchMap pizzaSearch', pizzaSearch)
          // TODO: pass the parameters pizzaSearch and pagination
          return service.getPizzas();
        })
      )
      .subscribe((pizzas) => {
        console.log('subscribe pizzas', pizzas)
        this.updateState({ ...this._state, records: pizzas, loading: false });
      });

    combineLatest(this.toppingSearch$)
      .pipe(
        switchMap(([toppingSearch]) => {
          console.log('switchMap toppingSearch', toppingSearch)
          // TODO: pass the parameter toppingSearch
          return service.getToppings();
        })
      )
      .subscribe((toppings) => {
        console.log('subscribe toppings', toppings)
        this.updateState({ ...this._state, toppings, loading: false });
      });
  }

}