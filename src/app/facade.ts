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

import { Operation, OperationType } from './interfaces/operation';
import { Pagination } from './interfaces/pagination';
import { State } from './interfaces/state';

let _state: State<any> = {
  records: [],
  pagination: {
    currentPage: 0,
    pageSizes: [5, 10, 20, 50],
    selectedSize: 5
  },
  loading: false,
  counter: 0,
};

export class Facade<T extends State<any>> {

  protected _state: T;

  protected store: BehaviorSubject<T>;
  protected state$: Observable<T>;

  /**
   * Viewmodel that resolves once all the data is ready (or updated)...
   */
  vm$: Observable<T>;

  /**
   * Watch 2 streams to trigger user loads and state updates
   */
  constructor(state: T) {
    if (!state) throw "state parameter undefined";
    
    this._state = { ..._state, ...state };
    
    this.store = new BehaviorSubject<T>(this._state);
    this.state$ = this.store.asObservable();
  }

  /** Update internal state cache and emit from store... */
  protected updateState(state: T): void {
    this.store.next((this._state = state));
  }

  // ------- Public Methods ------------------------

  // Allows quick snapshot access to data for ngOnInit() purposes
  getStateSnapshot(): T {
    return { ...this._state, pagination: { ...this._state.pagination } };
  }

  emitLatest() {
    const state = { ...this._state, counter: this._state.counter + 1 };
    this.updateState(state);
  }

}
