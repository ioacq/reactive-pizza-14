import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Pizza, Topping } from './pizza.interface';

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

@Injectable({
  providedIn: 'root'
})
export class PizzaService {

  getPizzas(): Observable<Pizza[]> {
    return of(PIZZAS);
  }

  getToppings(): Observable<Topping[]> {
    return of(TOPPINGS);
  }

}