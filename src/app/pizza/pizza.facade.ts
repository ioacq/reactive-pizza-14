import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  delay,
  debounceTime,
  filter,
} from 'rxjs/operators';

import { Pizza, Topping } from './pizza.interface';
import { PizzaService } from './pizza.service';
import { ToppingsValidator } from './toppings.validator'

export interface Pagination {
  selectedSize: number;
  currentPage: number;
  pageSizes: number[];
}

export enum OperationType {
  Create,
  Read,
  Update,
  Delete
}

export interface Operation {
  type: OperationType;
  model: Pizza
}

export interface PizzaState {
  pizzas: Pizza[];
  toppings: Topping[];
  pagination: Pagination;
  pizzaSearch: string;
  toppingSearch: string;
  operation: Operation;
  loading: boolean;
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
    this.loading$
  ).pipe(
    map(([ pizzas, toppings, pizzaSearch, toppingSearch, pagination, operation, loading ]) => {
      return {
        pizzas,
        toppings,
        pizzaSearch,
        toppingSearch,
        pagination,
        operation,
        loading
      };
    })
  );

  form: FormGroup;

  /**
   * Watch 2 streams to trigger user loads and state updates
   */
  constructor(
    private http: HttpClient,
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

    combineLatest(this.operation$)
      .pipe(
        filter(([operation]) => operation.type != null),
        switchMap(([operation]) => {
          console.log('OperationType:', operation.type)
          switch (operation.type) {
            case OperationType.Create:
              return this.createPizza(operation);
            default:
              return of(operation);
          }
        })
      )
      .subscribe((operation) => {
        console.log('Operation: ', operation);
        const pizzas = [ ..._state.pizzas, operation.model ];
        const newOperation = { ..._state.operation, type: null, model: null };
        this.updateState({ ..._state, pizzas, operation: newOperation, loading: false });
      });
  }

  // ------- Public Methods ------------------------

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): PizzaState {
    return { ..._state, pagination: { ..._state.pagination } };
  }

  buildSearchTermControl(): FormControl {
    const searchTerm = new FormControl();
    searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.updatePizzaSearchCriteria(value));

    return searchTerm;
  }

  buildForm(): FormGroup {
    const formGroup = new FormGroup<{
      name: FormControl<string|null>,
      toppings: FormArray<FormControl<string>>,
    }>({
      name: new FormControl(null, Validators.required),
      toppings: new FormArray([])
    }, {
      validators: ToppingsValidator
    });

    return this.form = formGroup;
  }

  updatePizzaSearchCriteria(pizzaSearch: string) {
    this.updateState({ ..._state, pizzaSearch, loading: true });
  }

  updatePagination(selectedSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.updateState({ ..._state, pagination, loading: true });
  }

  addPizza(pizza: Pizza): void {
    const operation = { ..._state.operation, type: OperationType.Create, model: pizza };
    this.updateState({ ..._state, operation, loading: true });
  }

  updatePizza(pizza: Pizza): void {
    const operation = { ..._state.operation, type: OperationType.Update, model: pizza };
    this.updateState({ ..._state, operation, loading: true });
  }

  deletePizza(pizza: Pizza): void {
    const operation = { ..._state.operation, type: OperationType.Delete, model: pizza };
    this.updateState({ ..._state, operation, loading: true });
  }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: PizzaState) {
    this.store.next((_state = state));
  }

  private findAllPizzas(): Observable<Pizza[]> {
    return of(this.pizzaServer.getPizzas());
  }

  private createPizza(operation: Operation): Observable<Operation> {
    // TODO: add call to http endpoint
    return of(operation)
      .pipe(delay(3000));
  }

  private findAllToppings(): Observable<Topping[]> {
    return of(this.pizzaServer.getToppings());
  }
}
