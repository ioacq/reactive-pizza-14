import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { BehaviorSubject, Observable, combineLatest, of, Subject } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  debounceTime,
  delay,
  filter,
  tap,
} from 'rxjs/operators';

import { Operation, OperationType } from '../interfaces/operation';
import { Pagination } from '../interfaces/pagination';
import { Pizza, Topping } from './pizza.interface';
import { PizzaService } from './pizza.service';
import { ToppingsValidator } from './toppings.validator'

export interface PizzaForm {
  name: FormControl<string|null>,
  toppings: FormArray<FormControl<string>>,
}

export interface PizzaState {
  pizzas: Pizza[];
  toppings: Topping[];
  pizzaSearch: string;
  toppingSearch: string;
  pagination: Pagination;
  operation?: Operation<Pizza>;
  loading: boolean;
  counter: number; // To trigger view render
}

let _state: PizzaState = {
  pizzas: [],
  toppings: [],
  pizzaSearch: '',
  toppingSearch: '',
  pagination: {
    currentPage: 0,
    selectedSize: 5,
    pageSizes: [5, 10, 20, 50],
  },
  operation: {
    type: null,
    model: null,
  },
  loading: false,
  counter: 0,
};

@Injectable()
export class PizzaFacade {
  private store = new BehaviorSubject<PizzaState>(_state);
  private state$ = this.store.asObservable();

  pizzas$ = this.state$.pipe(
    map((state) => state.pizzas),
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
  vm$: Observable<PizzaState> = combineLatest(
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
        pizzas,
        toppings,
        pizzaSearch,
        toppingSearch,
        pagination,
        operation,
        loading,
        counter,
      };
    })
  );

  form: FormGroup;

  /**
   * Watch 2 streams to trigger user loads and state updates
   */
  constructor(
    private pizzaServer: PizzaService
  ) {
    combineLatest(this.pizzaSearch$, this.pagination$)
      .pipe(
        switchMap(([pizzaSearch, pagination]) => {
          console.log('switchMap pizzaSearch', pizzaSearch)
          // TODO: pass the parameters pizzaSearch and pagination
          return this.findAllPizzas();
        })
      )
      .subscribe((pizzas) => {
        console.log('subscribe pizzas', pizzas)
        this.updateState({ ..._state, pizzas, loading: false });
      });

    combineLatest(this.toppingSearch$)
      .pipe(
        switchMap(([toppingSearch]) => {
          console.log('switchMap toppingSearch', toppingSearch)
          // TODO: pass the parameter toppingSearch
          return this.findAllToppings();
        })
      )
      .subscribe((toppings) => {
        console.log('subscribe toppings', toppings)
        this.updateState({ ..._state, toppings, loading: false });
      });

    // combineLatest(this.operation$)
    //   .pipe(
    //     tap(([operation]) => {
    //       console.log('tap', operation);
    //     }),
    //     filter(([operation]) => operation && operation.type !== null),
    //     switchMap(([operation]) => {
    //       console.log('OperationType:', operation.type)

    //       switch (operation.type) {
    //         case OperationType.Create:
    //           return this.createPizza(operation);
    //         default:
    //           return of(operation);
    //       }
    //     })
    //   )
    //   .subscribe((operation) => {
    //     console.log('Operation: ', operation);
        
    //     if (operation.type === OperationType.Create) {
    //       const pizzas = [ ..._state.pizzas, operation.model ];
    //       this.updateState({ ..._state, pizzas, loading: false });
    //     }
    //   });
  }

  // ------- Public Methods ------------------------

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): PizzaState {
    return { ..._state, pagination: { ..._state.pagination } };
  }

  emitLatest() {
    const state = { ..._state, counter: _state.counter + 1 };
    this.updateState(state);
  }

  buildSearchTermControl(): FormControl {
    const searchTerm = new FormControl();
    searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.updatePizzaSearchCriteria(value));

    return searchTerm;
  }

  buildForm(): FormGroup {
    const formGroup = new FormGroup<PizzaForm>({
      name: new FormControl(null, Validators.required),
      toppings: this.buildToppingsControl(),
    }, {
      validators: ToppingsValidator
    });

    return this.form = formGroup;
  }

  buildToppingsControl(): FormArray {
    const toppings = new FormArray([]);
    toppings.valueChanges
      .subscribe(() => this.emitLatest());

    return toppings;
  }

  updatePizzaSearchCriteria(pizzaSearch: string) {
    this.updateState({ ..._state, pizzaSearch, loading: true });
  }

  updatePagination(selectedSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.updateState({ ..._state, pagination, loading: true });
  }

  doOperation(type: OperationType, model: Pizza) {
    console.log('doOperation:', type);

    this.updateState({ ..._state, loading: true });

    const operation = { type: type, model: model };
    // this.operation.next(operation);
  }

  addPizza(pizza: Pizza) {
    // const operation = { type: OperationType.Create, model: pizza };
    this.updateState({ ..._state, loading: true });

    // TODO: call http endpoint
    new Observable<Pizza>(observer => {
      observer.next();
      observer.complete();
    });
    of(pizza)
      .pipe(delay(3000))
      .subscribe((value) => {
        const pizzas = [ ..._state.pizzas, value ];
        this.updateState({ ..._state, pizzas, loading: false });
      });
  }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: PizzaState) {
    this.store.next((_state = state));
  }

  private findAllPizzas(): Observable<Pizza[]> {
    return this.pizzaServer.getPizzas();
  }

  private createPizza(operation: Operation<Pizza>): Observable<Operation<Pizza>> {
    // TODO: add call to http endpoint
    return of(operation);
  }

  private findAllToppings(): Observable<Topping[]> {
    return this.pizzaServer.getToppings();
  }
}
