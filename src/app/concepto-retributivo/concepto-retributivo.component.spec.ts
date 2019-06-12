import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoRetributivoComponent } from './concepto-retributivo.component';

describe('ConceptoRetributivoComponent', () => {
  let component: ConceptoRetributivoComponent;
  let fixture: ComponentFixture<ConceptoRetributivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoRetributivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoRetributivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
