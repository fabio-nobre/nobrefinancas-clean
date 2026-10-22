import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { MatDialogRef } from '@angular/material/dialog';

import {
  TransactionModalComponent
} from './transaction-modal.component';

describe('TransactionModalComponent', () => {

  let component: TransactionModalComponent;
  let fixture: ComponentFixture<TransactionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransactionModalComponent
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close')
          }
        }
      ]
    }).compileComponents();

    fixture =
      TestBed.createComponent(
        TransactionModalComponent
      );

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});