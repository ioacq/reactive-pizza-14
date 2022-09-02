import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PizzaCreatorComponent } from './containers/pizza-creator/pizza-creator.component';

const routes: Routes = [
  {
    path: '',
    component: PizzaCreatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PizzaRoutingModule { }