import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextContentPage } from './text-content.page';

describe('TextContentPage', () => {
  let component: TextContentPage;
  let fixture: ComponentFixture<TextContentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextContentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextContentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
