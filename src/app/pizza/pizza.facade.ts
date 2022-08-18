import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, FormArray, Validators } from '@angular/forms';

import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  switchMap,
  startWith,
  tap,
  delay,
  debounceTime,
  merge,
} from 'rxjs/operators';

import { Pizza, Topping } from './pizza.interface';
import { PizzaService } from './pizza.service';
import { ToppingsValidator } from './toppings.validator'

export interface User {
  gender: string;
  name: {
    first: string;
    last: string;
  };
}

export interface Pagination {
  selectedSize: number;
  currentPage: number;
  pageSizes: number[];
}

export interface RandomUserResponse {
  results: User[];
}

export interface PizzaState {
  pizzas: Pizza[];
  toppings: Topping[];
  pagination: Pagination;
  criteria: string;
  loading: boolean;
}

let _state: PizzaState = {
  pizzas: [],
  toppings: [],
  criteria: '',
  pagination: {
    currentPage: 0,
    selectedSize: 5,
    pageSizes: [5, 10, 20, 50],
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
  criteria$ = this.state$.pipe(
    map((state) => state.criteria),
    distinctUntilChanged()
  );
  pagination$ = this.state$.pipe(
    map((state) => state.pagination),
    distinctUntilChanged()
  );
  loading$ = this.state$.pipe(map((state) => state.loading));

  /**
   * Viewmodel that resolves once all the data is ready (or updated)...
   */
  vm$: Observable<PizzaState> = combineLatest(
    this.pagination$,
    this.criteria$,
    this.pizzas$,
    this.toppings$,
    this.loading$
  ).pipe(
    map(([pagination, criteria, pizzas, toppings, loading]) => {
      return { pagination, criteria, pizzas, toppings, loading };
    })
  );

  /**
   * Watch 2 streams to trigger user loads and state updates
   */
  constructor(
    private http: HttpClient,
    private pizzaServer: PizzaService
  ) {
    combineLatest(this.pizzas$, this.toppings$)
      .pipe(
        switchMap(([pizzas, toppings]) => {
          console.log('switchMap pizzas', pizzas)
          console.log('switchMap toppings', toppings)
          return combineLatest(
            this.findAllPizzas(),
            this.findAllToppings()
          )
        })
      )
      .subscribe(([pizzas, toppings]) => {
        console.log('subscribe pizzas', pizzas)
        console.log('subscribe toppings', toppings)
        this.updateState({ ..._state, pizzas, toppings, loading: false });
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
      .subscribe((value) => this.updateSearchCriteria(value));

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

    return formGroup;
  }

  updateSearchCriteria(criteria: string) {
    this.updateState({ ..._state, criteria, loading: true });
  }

  updatePagination(selectedSize: number, currentPage: number = 0) {
    const pagination = { ..._state.pagination, currentPage, selectedSize };
    this.updateState({ ..._state, pagination, loading: true });
  }

  addPizza(pizza: Pizza): void {
    const pizzas = [ ..._state.pizzas, pizza ];
    this.updateState({ ..._state, pizzas, loading: true });
  }

  // ------- Private Methods ------------------------

  /** Update internal state cache and emit from store... */
  private updateState(state: PizzaState) {
    this.store.next((_state = state));
  }

  /** RandomUser REST call */
  private findAllUsers(
    criteria: string,
    pagination: Pagination
  ): Observable<User[]> {
    const url = buildUserUrl(criteria, pagination);
    return this.http.get<RandomUserResponse>(url).pipe(
      map((response) => response.results),
      map(filterWithCriteria(criteria))
    );
  }

  private findAllPizzas(): Observable<Pizza[]> {
    return of(this.pizzaServer.getPizzas())
      .pipe(debounceTime(5000));
  }

  private findAllToppings(): Observable<Topping[]> {
    return of(this.pizzaServer.getToppings())
      .pipe(debounceTime(5000));
  }
}

function buildUserUrl(criteria: string, pagination: Pagination): string {
  const URL = 'https://randomuser.me/api/';
  const currentPage = `page=${pagination.currentPage}`;
  const pageSize = `results=${pagination.selectedSize}&`;
  const searchFor = `seed=mindspaceDemo&inc=gender,name,nat`;

  return `${URL}?${searchFor}&${pageSize}&${currentPage}`;
}

// ******************************************
// Filter Utilities
// ******************************************

function contains(src, part) {
  return (src || '').toLowerCase().indexOf(part.toLowerCase()) > -1;
}
function matchUser(who, criteria) {
  const inFirst = contains(who.first, criteria);
  const inLast = contains(who.last, criteria);

  return !!criteria ? inFirst || inLast : true;
}

function filterWithCriteria(criteria) {
  return (list) => {
    return list.filter((it) => {
      return matchUser(it.name, criteria);
    });
  };
}
