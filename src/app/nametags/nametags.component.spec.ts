/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NametagsComponent } from './nametags.component';

describe('NametagsComponent', () => {
  let component: NametagsComponent;
  let fixture: ComponentFixture<NametagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NametagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NametagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
