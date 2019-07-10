import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEventPage } from './select-event.page';

describe('SelectEventPage', () => {
  let component: SelectEventPage;
  let fixture: ComponentFixture<SelectEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectEventPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
