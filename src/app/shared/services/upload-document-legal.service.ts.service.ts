

import { Injectable, OnInit, OnDestroy } from "@angular/core";
import {
  BehaviorSubject,
  EMPTY,
  from,
  ReplaySubject,
  Subject,
  forkJoin,
  of,
} from "rxjs";
import { map, groupBy, mergeMap, toArray, take } from "rxjs/operators";
import { UtilityManager } from "../utilities/UtilityManager";
import {
  ComponentsIDs,
  DbTables,
  DescrColums,
  FormsIDs,
  KeyValueColums,
  LookupFlag,
  URLs,
} from "../utilities/Constants";
import { UtilityService } from "./UtilityService";
import { NgxSpinnerService } from "ngx-spinner";
import { FormLoadResponse } from "../models/FormLoadResponse.model";
import { UploadDocumentModel } from "../models/uploadDocument.model";
import { SessionManager } from "../utilities/SessionManager";
import { MetaData } from "../models/MetaData.model";
import { HttpParams, HttpClient } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})

export class UploadDocumentLegal implements OnInit, OnDestroy {
  private result: any;
  private operationNumber: number;
  private converter = "data:application/pdf;base64,";
  //#region "Upload document"
  selectedFile: any;
  fileToLoad: any;
  convertedBase64: string;
  //#endregion "Upload document"
  //#region "Load table form  and data"
  uploadObj: Subject<any> = new BehaviorSubject<any>(null);
  uploadForm = new Subject<FormLoadResponse>();
  tableData: any[] = [];
  //#endregion "Load table form  and data"
  //#region "Meatadata"
  objectData: {};
  actionMode: string;
  metadata: any;
  oppNumber: number;
  reqOprNo: any;
  //#endregion "Meatadata"
  //#region "Gathering calc object list"
  calcArray: any[] = [];

  pageId: number = FormsIDs.UploadDocument;

  //#endregion "Gathering calc object list"

  /**
   * Gets or sets document requests.
   */
  response = [];
  public isLegal: boolean = false;
  public isLawyerResendDocsLegInbox: boolean = false;
  constructor(
    public toastr: ToastrService,
    private utilService: UtilityService,
    private spinner: NgxSpinnerService,
    private utilityManager: UtilityManager,
    private http: HttpClient
  ) {
    //this.getCurrentOpearationNumberByPageId(FormsIDs.UploadDocument);
  }
  ngOnInit() {
    // this.loadDocumentColumns();

  }

  // Loading table columns
  loadDocumentColumns(): void {
    const pageLoadRequestStart = UtilityManager.prepareFormLoadRequestParamV2(
      FormsIDs.UploadDocument,
      "I"
    );
    this.utilService
      .getService(URLs.pageLoadV2, pageLoadRequestStart)
      .subscribe(
        (res) => {
          // Sending Upload form columns to required screen
          this.uploadForm.next(res.body);
          // Setting operation number for the calc request
          this.oppNumber = res.body.oprNo;
          // Getting array elements based on user role and page id
          this.calcObjLookup(); // send objectt data
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // Loading table data based on calc objects
  getRequiredTables() {
    if (this.reqOprNo) {
      this.objectData['debtRecordCode'] = this.reqOprNo
    }
    this.tableData = [];
    //#region "Metadata"
    //#region "Metadata"
    const jsonDataRequest = {
      metadata: {
        pageId: FormsIDs.UploadDocument,
        componentId: ComponentsIDs.Default,
        oprNo: this.oppNumber,
        funcMode: "I",
        usrNo: SessionManager.getUserNo(),
        roleId: SessionManager.getRoleId(),
        langCode: SessionManager.getLanguage(),
        // 'calcObject': ["expDocs"]
        calcObject: this.calcArray,
      },
      //#endregion "Metadata"
      objectdata: [this.getObjectData()],
    };
    this.spinner.show();
    this.utilService.postService(URLs.postData, jsonDataRequest).subscribe(
      (res) => {
        // console.log('tableData before groupby :', res.objectdata);
        // // Group documents by type
        // const source = from(res.objectdata[0]);
        // const result = source.pipe(
        //   groupBy(doc => doc['docWFVO'][0]['type']),
        //   // return each item in group as array
        //   mergeMap(group => group.pipe(toArray()))
        // );
        // // subscribing table data
        // const subscribe = result.subscribe(val => this.tableData.push(val));
        // // Sending documents data to the required screen
        this.uploadObj.next(res.objectdata);
        console.log("tableData after groupby :", res.objectdata);
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getPageid() {
    let page_id = FormsIDs.UploadDocument;
    if (this.isLegal) {
      page_id = FormsIDs.BranchManagerLegMainInbox
    }
    else if (this.isLawyerResendDocsLegInbox) {
      page_id = FormsIDs.LawyerResendDocsLegInbox
    }
    else {
      page_id = FormsIDs.UploadDocument;
    }
    return page_id;
  }
  // Getting required screen documents based on user role and page id
  calcObjLookup() {
    const calcObjIds = <any[]>[
      {
        name: "ROLE_ID",
        valueKey: SessionManager.getRoleId(),
      },
      {
        name: "PAGE_ID ",
        valueKey: this.getPageid(),
      },
    ];
    //#region calcObjLookup
    const calcObjLookup = UtilityManager.prepareLookupRequest(
      DbTables.BP_ROLES_CALCOBJECTS,
      LookupFlag.DbTable,
      KeyValueColums.CALC_OBJECT_ID,
      DescrColums.CALC_OBJECT,
      calcObjIds
    );
    this.utilService.postService(URLs.getLookup, calcObjLookup).subscribe(
      (res) => {
        // Mapping calc objects to get required tables
        const calObj = from(res).pipe(map((val) => val["descr"]));
        calObj.subscribe((value) => {
          this.calcArray.push(value);
        });
        // Sending calc objects to get required tables
        this.getRequiredTables();
        // Setting calc arrary as empty to prevent data duplication
        this.calcArray = [];
      },
      (err) => {
        console.log(err);
      }
    );
  }

  /**
   // Temporary function to determine the parameters of required tables
   // The data will be assigned from any screen as object data in get required table function
   **/
  getObjectData() {
    return this.objectData;
    // return {
    //   'debtRecordCode': 98,
    //   'loanType': 6,
    //   'prodCode': 7
    // };

    // if (calcObject === 'debtDocs') {
    //   this.objectData = {
    //     'debtRecordCode': 98,
    //     'loanType': 6,
    //     'prodCode': 7
    //   };
    //   return this.objectData;
    // } else if (calcObject === 'custDocs' || calcObject === 'guarDocs') {
    //   this.objectData = {
    //     'debtRecordCode': 98,
    //     'loanType': 0,
    //     'prodCode': 7
    //   };
    //   return this.objectData;
    // } else if (calcObject === 'orgDocs') {
    //   this.objectData = {
    //     'debtRecordCode': 98,
    //     'loanType': 1,
    //     'prodCode': 7
    //   };
    //   return this.objectData;
    // }
  }

  //
  uploadPdf(
    event,
    objectdata: UploadDocumentModel,
    documentType: string,
    moduleNumber: number,
    deptRecordCode: any,
    docTypeId: any
  ) {

    // Read File
    this.selectedFile = event.currentTarget["files"];
    // console.log("file : ", this.selectedFile)
    // console.log(event.currentTarget['files'][0]['name']);
    console.log(event.currentTarget['files'][0]['name'].split('.')[1]);
    const fileExt = event.currentTarget['files'][0]['name'].split('.')[1];
    // Check File is not Empty
    if (this.selectedFile.length > 0) {
      var file = event.target.files[0];
      console.log("file : ", file)
      if (!file.type.match('application/pdf.*')) {

        var typeErrMsg = SessionManager.getLanguage() == 'AR' ?
          "الملفات بصيغة pdf فقط" : "only pdf files"
        this.toastr.error(typeErrMsg, "error", { positionClass: 'toast-top-center', timeOut: 10000 });
      }
      else {
        // Select the very first file from list
        this.fileToLoad = this.selectedFile[0];

        // FileReader function for read the file.
        const fileReader: any = new FileReader();

        // Convert data to base64
        fileReader.readAsDataURL(this.fileToLoad);

        // Onload of file read the file content
        fileReader.onload = (fileLoadedEvent) => {
          if (fileLoadedEvent.currentTarget.readyState === 1) {
            this.convertedBase64 = null;
          } else if (fileLoadedEvent.currentTarget.readyState === 2) {
            this.convertedBase64 = fileLoadedEvent.target.result;
            // console.log(event.currentTarget['files'][0]['name']);
            const jsonDataRequest = {
              metadata: {
                pageId: FormsIDs.UploadDocument,
                componentId: ComponentsIDs.Default,
                // oprNo: this.operationNumber + 1,
                funcMode: "I",
                usrNo: SessionManager.getUserNo(),
                roleId: SessionManager.getRoleId(),
                langCode: SessionManager.getLanguage(),
              },
              objectdata: [objectdata],
            };
            objectdata["fileContent"] = this.convertedBase64.slice(28);
            objectdata["docExt"] = fileExt;
            objectdata["type"] = documentType;
            objectdata["moduleNo"] = moduleNumber;
            objectdata["debtRecordCode"] = deptRecordCode;
            objectdata["docTypeId"] = docTypeId;
            objectdata["extparam"] = fileExt;
            // this.spinner.show();
            console.log("upload req : ", JSON.stringify(jsonDataRequest));
            this.utilService
              .postService(URLs.postData, jsonDataRequest)
              .subscribe(
                (res) => {
                  // Getting required tables calcs and tables data after uploading a file
                  // this.loadDocumentColumns();
                  // this.loadDocumentColumns(); //sends a wrong objData
                  // this.spinner.hide();
                },
                (err) => {
                  console.log(err);
                }
              );
          }
        };
      }
    }
  }
  downloadPdf(pageId: number, documentId: string) {
    // http://localhost:8282/aur/api/page/newLoad/?pageId=537&langCode=AR&usrNo=22&roleId=200
    // documentId=9b5108ca-748b-4140-9911-c1320ba60b6d&usrNo=22&pageId=2
    this.utilService
      .getService(
        URLs.downloadDocument +
        `?documentId=${documentId}&usrNo=${SessionManager.getUserNo()}&pageId=${pageId}`
      )
      .subscribe(
        (res) => {
          const downloadLink = document.createElement("a");
          downloadLink.href = this.converter + res["body"]["objectdata"];
          downloadLink.download = "Pdf";
          downloadLink.click();
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  downloadSignPdf(pageId: number, debtRecordCode: string) {
    console.log(
      "download url : ",
      URLs.downloadDocument +
      `?debtRecordCode=${debtRecordCode}&usrNo=${SessionManager.getUserNo()}&pageId=${pageId}`
    );
    //aur/api/doDocDownload/?debtRecordCode=1305&usrNo=5000&pageId=533
    this.utilService
      .getService(
        URLs.downloadDocument +
        `?debtRecordCode=${debtRecordCode}&usrNo=${SessionManager.getUserNo()}&pageId=${pageId}`
      )
      .subscribe(
        (res) => {
          const downloadLink = document.createElement("a");
          downloadLink.href = this.converter + res["body"]["objectdata"];
          downloadLink.download = "Pdf";
          downloadLink.click();
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    // // ,SessionManager.getLanguage(),SessionManager.getUserNo(),SessionManager.getRoleId()
    // if (this.convertedBase64) {
    //   const downloadLink = document.createElement('a');
    //   downloadLink.href = this.convertedBase64;
    //   downloadLink.download = 'Pdf';
    //   downloadLink.click();
    //   return true;
    // } else {
    //   return false;
    // }
  }

  deletePdf(document: number | string) {
    const jsonDataRequest = {
      metadata: {
        pageId: FormsIDs.UploadDocument,
        componentId: ComponentsIDs.Default,
        // oprNo: this.oppNumber,
        //  oprNo: this.operationNumber,
        funcMode: "D",
        usrNo: SessionManager.getUserNo(),
        roleId: SessionManager.getRoleId(),
        langCode: SessionManager.getLanguage(),
      },
      objectdata: [document],
    };
    this.spinner.show();
    this.utilService.deleteService(URLs.deleteData, jsonDataRequest).subscribe(
      (res) => {
        // Getting required tables calcs and tables data after uploading a file
        // this.loadDocumentColumns();
        // this.loadDocumentColumns();
        this.spinner.hide();
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getMetaData(): MetaData {
    const metaData = UtilityManager.prepareMetaData(
      FormsIDs.UploadDocument,
      ComponentsIDs.Default,
      this.oppNumber,
      this.actionMode
    );
    return metaData;
  }

  ngOnDestroy(): void {
    // this.uploadObj.next();
    // this.uploadObj.unsubscribe();
  }

  async getCurrentOpearationNumberByPageId(PageId: number): Promise<any> {
    const pageLoadRequestStart = UtilityManager.prepareFormLoadRequestParamV2(
      PageId,
      null
    );
    if (typeof this.result === "undefined") {
      // save result
      this.result = await this.utilService
        .getService(URLs.pageLoadV2, pageLoadRequestStart)
        .toPromise()
        .then((resp) => resp as any);
    }
    this.operationNumber = this.result["body"]["oprNo"];
    return this.operationNumber;
  }

  async buildDocumentsStructure(
    debtRecordCode: number,
    loanType: number,
    prodCode: number
  ) {
    const document: any[] = [];
    /**
     * Getting documents container headers.
     */
    const pageLoadRequestStart = UtilityManager.prepareFormLoadRequestParamV2(
      FormsIDs.UploadDocument,
      "I"
    );

    /**
     * Getting documents types based on the role id from server side.
     */
    const documentIDS = <any[]>[
      {
        name: "ROLE_ID",
        valueKey: SessionManager.getRoleId(),
      },
      {
        name: "PAGE_ID ",
        valueKey: FormsIDs.UploadDocument,
      },
    ];
    const documentLookup = UtilityManager.prepareLookupRequest(
      DbTables.BP_ROLES_CALCOBJECTS,
      LookupFlag.DbTable,
      KeyValueColums.CALC_OBJECT_ID,
      DescrColums.CALC_OBJECT,
      documentIDS
    );
    await this.utilService.postService(URLs.getLookup, documentLookup).pipe(
      map((types) => {
        const type = types;
        return type;
      }),
      mergeMap((type) => {
        const jsonDataRequest = {
          metadata: {
            pageId: FormsIDs.UploadDocument,
            componentId: ComponentsIDs.Default,
            // oprNo: this.operationNumber,
            funcMode: "I",
            usrNo: SessionManager.getUserNo(),
            roleId: SessionManager.getRoleId(),
            langCode: SessionManager.getLanguage(),
            calcObject: type.map((t) => t["descr"]),
          },
          objectdata: [
            {
              debtRecordCode: debtRecordCode,
              loanType: loanType,
              prodCode: prodCode,
            },
          ],
        };
        const headers = this.utilService.getService(
          URLs.pageLoadV2,
          pageLoadRequestStart
        );
        const allDocs = this.utilService.postService(
          URLs.postData,
          jsonDataRequest
        );
        return forkJoin([headers, allDocs]);
      }),
      take(1)
    ).subscribe((result) => {
      // document.push(of({ headers: result[0]["body"]["attributes"] }));
      // document.push(of(result[1]["objectdata"]));
      return result;
    });
  }
}
