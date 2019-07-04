import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Fence } from './fence.page';

describe('Fence', () => {
  let component: Fence;
  let fixture: ComponentFixture<Fence>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Fence ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Fence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
