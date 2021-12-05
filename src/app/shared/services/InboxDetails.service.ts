import { Injectable } from "@angular/core";
import {
  HttpClient, HttpHeaders, HttpClientModule, HttpResponse, HttpParams, HttpRequest,
} from "@angular/common/http";
import { BehaviorSubject, forkJoin, from } from "rxjs";
import { MetaData } from "../models/MetaData.model";
import { UtilityManager } from "../utilities/UtilityManager";
import {
  ComponentsIDs, DescrColums, Domains, FormsIDs, KeyValueColums, LookupFlag, URLs,
} from "../utilities/Constants";
import { UtilityService } from "./UtilityService";
import { FormLoadResponse } from "../models/FormLoadResponse.model";
import { map } from "rxjs/operators";
import { rejectedReasons } from "../models/uploadDocument.model";

@Injectable({
  providedIn: "root",
})
export class InboxDetailsService {

  public isCustPos: boolean = false;
  public orgId: string;

  oppNumber: number;
  formModel: FormLoadResponse;
  actionMode: string = "I";
  loanInfoCalc: string[] = ["LoanInfoVO"];
  calcObjectsArray = [
    "LoanInfoVO",
    "custData",
    "orgInfo",
    "partnersTable",
    "guarData",
    "DebtSummary",
  ];
  // ['orgInfo', 'partnersTable']
  private currentRequest: any = null;
  rejectedReasons = new Array<rejectedReasons>();
  // Role tabs
  tabs: any;

  constructor(private http: HttpClient, private utilService: UtilityService) {
    // this.getCalcObjects(98);
  }

  private messageSource = new BehaviorSubject("default message");
  currentMessage = this.messageSource.asObservable();

  private record = new BehaviorSubject({
    debtRecordCode: "500",
    prodName: "",
    idno: "",
    fullAname: "ahmed",
    dactionDate: "",
    subject: "",
    debtType: 0,
  });
  current_record = this.record.asObservable();

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeObjectData(essam: any) {
    this.record.next(essam);
  }

  getCalcObjects(deptRecordCode) {
    const requestArray = [];
    const metaData = this.getMetaData();
    const calObj = from(this.calcObjectsArray).pipe(map((calc) => calc));
    calObj.subscribe((calc) => {
      metaData.calcObject = [calc];
      const jsonDataRequest = {
        metadata: metaData,
        objectdata: [{ debtRecordCode: deptRecordCode }],
      };
      requestArray.push(
        this.utilService.postService(URLs.postData, jsonDataRequest)
      );
    });
    forkJoin(requestArray).subscribe((results) => {
      console.log(results);
    });
  }

  getMetaData(): MetaData {
    //#region branchesLookup
    const Request = UtilityManager.prepareLookupRequest(
      Domains.Calssification,
      LookupFlag.Domain,
      "BP_AUDIT",
      DescrColums.Descr
    );
    this.utilService.postService(URLs.getLookup, Request).subscribe(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.log(err);
      }
    );

    const metaData = UtilityManager.prepareMetaData(
      FormsIDs.LoanInfo,
      ComponentsIDs.LoanInfo,
      this.oppNumber,
      this.actionMode
    );
    return metaData;
  }

  // region "Main Inbox"
  // To use the pending request throw all page in inbox details
  setCurrentPendingRequest(currentRequest: any) {
    this.currentRequest = currentRequest;
    return this.currentRequest;
  }

  getCurrentPendingRequest() {
    return this.currentRequest;
  }

  // endregion "Main Inbox"

  // region "Main inbox / Loan request part"
  // Setting dept record code (From main inbox page)

  // Getting dept record code

  // endregion "Main inbox / Loan request part"
  getCurrentTabIndex(index: number) {
    return index;
  }
}
