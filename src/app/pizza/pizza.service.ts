import { Injectable } from '@angular/core';

import { Pizza, Topping } from './pizza.interface';

import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export const PIZZAS: Pizza[] = [
  { name: 'New Yorker', toppings: ['Bacon', 'Pepperoni', 'Ham', 'Mushrooms'] },
  { name: 'Hot & Spicy', toppings: ['Jalapenos', 'Herbs', 'Pepperoni', 'Chicken'] },
  { name: 'Hawaiian', toppings: ['Ham', 'Pineapple', 'Sweetcorn'] },
  { name: 'Pepperoni', toppings: ['Pepperoni'] }
];

export const TOPPINGS: Topping[] = [
  'Bacon', 'Pepperoni', 'Mushrooms', 'Herbs',
  'Chicken', 'Pineapple', 'Ham', 'Jalapenos'
];

export interface State {
  pizzas: Pizza[],
  toppings: Topping[]
}

const state: State = {
  pizzas: PIZZAS,
  toppings: TOPPINGS
};

@Injectable()
export class PizzaService {

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