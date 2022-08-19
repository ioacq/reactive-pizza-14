import { Injectable } from '@angular/core';

import { User } from './user.interface';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

@Injectable()
export class UserService {

  private subject = new BehaviorSubject<State>(state);
  store = this.subject.asObservable()
    .pipe(distinctUntilChanged());

  select<T>(name: string): Observable<T> {
    return this.store.pipe(map<State, T>(x => x[name]));
  }

  getPizzas(): Pizza[] {
    return PIZZAS;
  }

  getToppings(): Topping[] {
    return TOPPINGS;
  }

  addPizza(pizza: Pizza) {
    const value = this.subject.value;
    this.subject.next({ ...value, pizzas: [...value.pizzas, pizza] });
  }

}

function buildUserUrl(criteria: string, pagination: Pagination): string {
  const URL = 'https://randomuser.me/api/';
  const currentPage = `page=${pagination.currentPage}`;
  const pageSize = `results=${pagination.selectedSize}&`;
  const searchFor = `seed=mindspaceDemo&inc=gender,name,nat`;

  return `${URL}?${searchFor}&${pageSize}&${currentPage}`;
}