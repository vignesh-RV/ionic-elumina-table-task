import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DynamicTable } from './dynamic-table';


describe('DynamicTable', () => {
  let component: DynamicTable;
  let fixture: ComponentFixture<DynamicTable>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicTable ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
