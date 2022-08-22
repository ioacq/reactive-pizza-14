import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'pizza-button',
  styleUrls: ['pizza-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="pizza-button" [formGroup]="parent">
      <button 
        type="button"
        (click)="onClick()"
        [disabled]="parent.invalid">
        <img src="assets/add.svg">
        <ng-content></ng-content>
      </button>
    </div>
  `
})
export class PizzaButtonComponent implements OnInit, OnChanges {

  @Input()
  parent: FormGroup;

  @Output()
  add = new EventEmitter<any>();

  ngOnInit() {
    console.log('pizza-button.component.OnInit')
  }

  ngOnChanges() {
    console.log('pizza-button.component.OnChanges')
  }

  onClick() {
    this.add.emit();
  }

}