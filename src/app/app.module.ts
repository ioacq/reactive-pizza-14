import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { PizzaModule } from './pizza/pizza.module';

import { AppComponent } from './app.component';

@NgModule({
  imports:      [ BrowserModule, HttpClientModule, FormsModule, PizzaModule ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
