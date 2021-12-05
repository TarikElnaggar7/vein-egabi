import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanDataShareService {

  private dataSource = new BehaviorSubject(undefined);
  private debtRecordCode = new BehaviorSubject(undefined);
  public viewLoansList: boolean;
  currentData = this.dataSource.asObservable();
  currentDebtRecordCode = this.debtRecordCode.asObservable();

  constructor() { }

  changeData(data: string) {
    this.dataSource.next(data);
  }

  changeDebtRecordCode(debtCode: string) {
    this.debtRecordCode.next(debtCode);
  }

  clearSharedLoan() {
    this.dataSource.next(undefined);
  }

  clearSharedDebtCode() {
    this.debtRecordCode.next(undefined);
  }

}

