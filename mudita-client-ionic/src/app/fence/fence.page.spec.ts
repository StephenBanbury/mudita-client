import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FencePage } from './fence.page';

describe('Fence', () => {
  let component: FencePage;
  let fixture: ComponentFixture<FencePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FencePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FencePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
