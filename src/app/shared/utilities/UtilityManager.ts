import { Injectable } from "@angular/core";
import { SessionManager } from "./SessionManager";
import { MetaData } from "../models/MetaData.model";
// import * as XLSX from "ts-xlsx";
import { FormAttribute } from "../models/FormAttribute.model";
import { FormMessage } from "../models/FormMessage.model";
import { Buffer } from "buffer/";
import * as CryptoJS from "crypto-js";
import { ComponentsIDs, FormsIDs, URLs } from "./Constants";
import { UtilityService } from "../services/UtilityService";
import { forkJoin } from "rxjs";

// import * as RSA from 'crypto-browserify';

@Injectable()
export class UtilityManager {
  // encrypted: string;
  // constructor(private _utilService: UtilService) {}
  private static formLoadRequest: MetaData;
  // sessionManager: SessionManager;
  private privateKey: string;
  private publicKey: string;
  private enabled: boolean;
  operationNumber: number;
  private result: any;

  constructor(private utilService: UtilityService) {
    this.privateKey = "1111";
    this.publicKey = "3333";
    this.enabled = true;
  }

  public static prepareFormLoadRequest(
    pageId: number,
    componentId: number,
    isLogin: boolean
  ): MetaData {
    this.formLoadRequest = <MetaData>{
      pageId: pageId,
      componentId: componentId,
      langCode: SessionManager.getLanguage(), // 'AR',
      ipAddress: window.location.hostname,
      roleId: Number(SessionManager.getRoleId),
    };
    return this.formLoadRequest;
  }

  public static prepareFormLoadRequestParams(
    pId: number,
    cId: number = null,
    formType: string,
    rId: number = null
  ): any {
    // formType   1==>login    2==>roleLogin   3==>other Pages
    const lCode = SessionManager.getLanguage();
    const iAddress = "10.3.1.102"; // window.location.hostname;
    let userNo: number;
    let roleId: number;
    let httpParams: any;
    if (formType === "1") {
      if (cId !== null) {
        httpParams = {
          langCode: lCode,
          pageId: pId,
          componentId: cId,
          ipAddress: iAddress,
        };
      } else {
        httpParams = { langCode: lCode, pageId: pId, ipAddress: iAddress };
      }
    }
    if (formType === "2") {
      userNo = Number(SessionManager.getUserNo());
      if (cId !== null) {
        httpParams = {
          pageId: pId,
          componentId: cId,
          langCode: lCode,
          usrNo: userNo,
          ipAddress: iAddress,
        };
      } else {
        httpParams = {
          pageId: pId,
          langCode: lCode,
          usrNo: userNo,
          ipAddress: iAddress,
        };
      }
    }
    if (formType === "3") {
      // alert(rId === null);
      userNo = Number(SessionManager.getUserNo());
      roleId = rId === null ? Number(SessionManager.getRoleId()) : rId;
      if (cId !== null) {
        httpParams = {
          pageId: pId,
          componentId: cId,
          langCode: lCode,
          usrNo: userNo,
          roleId: roleId,
        };
      } else {
        httpParams = {
          pageId: pId,
          langCode: lCode,
          usrNo: userNo,
          roleId: roleId,
        };
      }
    }
    return httpParams;
  }

  // tslint:disable-next-line:max-line-length
  public static prepareFormLoadRequestParamV2(
    pId: number,
    funcMode: string = null
  ): any {
    // formType   1==>login    2==>roleLogin   3==>other Pages
    const lCode = SessionManager.getLanguage();
    // const iAddress = '10.3.1.102'; // window.location.hostname;
    let userNo: number;
    let roleId: number;
    let httpParams: any;
    // alert(rId === null);
    userNo = Number(SessionManager.getUserNo());
    roleId = Number(SessionManager.getRoleId());
    if (funcMode !== null) {
      httpParams = {
        pageId: pId,
        funcMode: funcMode,
        langCode: lCode,
        usrNo: userNo,
        roleId: roleId,
      };
    } else {
      httpParams = {
        pageId: pId,
        langCode: lCode,
        usrNo: userNo,
        roleId: roleId,
      };
    }
    return httpParams;
  }

  public static prepareLookupRequest(
    listName: string,
    domainFlag: number,
    keyValueColumn: string,
    descrColumn: string,
    lookupIds: any[] = null
  ): any {
    const lookupRequest = {
      usrNo: SessionManager.getUserNo(),
      langCode: SessionManager.getLanguage(),
      listName: listName,
      domainFlag: domainFlag,
      keyValueColumn: keyValueColumn,
      desrcColumn: descrColumn,
      lookUpIds: lookupIds,
    };
    // console.log(lookupRequest);
    return lookupRequest;
  }

  public static prepareMetaData(
    pageId: number,
    componentId: number,
    oprNo: number,
    funcMode: string
  ): MetaData {
    const metaData = <MetaData>{
      pageId: pageId,
      componentId: componentId,
      oprNo: oprNo,
      funcMode: funcMode,
      usrNo: Number(SessionManager.getUserNo()),
      roleId: Number(SessionManager.getRoleId()),
      langCode: SessionManager.getLanguage(),
    };
    return metaData;
  }


  public static validateScreen(
    attributeList: FormAttribute[],
    model: any = null
  ): Array<FormMessage> {
    const errorMessages: Array<FormMessage> = [];
    for (const attKey of Object.keys(attributeList)) {
      if (attributeList[attKey].mandatory === true) {

        // console.log('attr', attKey);
        if (
          model[attKey] === null ||
          model[attKey] === undefined ||
          model[attKey] === "null" ||
          model[attKey] === ""
        ) {
          const errObj = <FormMessage>{};
          errObj.messageDescr = `${SessionManager.getLanguage() == "AR" ? "خطأ فى تغذية الحقل" : "Field feed error"}` + "  " + "( " + attributeList[attKey].labelDescr + " )";
          errorMessages.push(errObj);
        }
      }

    }
    return errorMessages;
  }


  public static validateScreenList(
    attributeList: FormAttribute[],
    modelList: any[] = []
  ): Array<FormMessage> {
    const errorMessages: Array<FormMessage> = [];


    modelList.forEach(x => {
      for (const attKey of Object.keys(attributeList)) {
        if (attributeList[attKey].mandatory === true) {
          // console.log('attr', attKey);
          if (x[attKey] === null || x[attKey] === undefined || x[attKey] === "null" || x[attKey] === "") {
            const errObj = <FormMessage>{};
            errObj.messageDescr = `${SessionManager.getLanguage() == "AR" ? "خطأ فى تغذية الحقل" : "Field feed error"}` + "  " + "( " + attributeList[attKey].labelDescr + " )";
            errorMessages.push(errObj);
          }
        }
      }

    })

    return errorMessages;
  }

  public static validatePKs(
    attributeList: FormAttribute[],
    model: any = null
  ): boolean {
    // console.log('attrs', Object.keys(attributeList));
    // console.log('model', model);
    for (const attKey of Object.keys(attributeList)) {
      if (attributeList[attKey].controlPk === true) {
        // console.log('attr', attKey);
        if (
          model[attKey] === null ||
          model[attKey] === undefined ||
          (model[attKey] || {}).toString() === "" ||
          (model[attKey] || {}).toString() === "null"
        ) {
          return false;
        }
      }
    }

    return true;
  }

  public static getPKsData(
    attributeList: FormAttribute[],
    model: any = null
  ): any[] {
    const pksData: Array<any> = [];
    const obj = <any>{};
    for (const attKey of Object.keys(attributeList)) {
      if (attributeList[attKey].controlPk === true) {
        obj[attKey] = model[attKey];
      }
    }
    pksData.push(obj);
    return pksData;
  }

  public static decryptAES(txt: string): string {
    const key = CryptoJS.enc.Utf8.parse("1211194241019958");
    const iv = CryptoJS.enc.Utf8.parse("1211194241019958");
    const decrypted = CryptoJS.AES.decrypt(txt, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    // console.log('Encrypted :' + encrypted);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }


  public static encryptAES(txt: string): string {
    const key = CryptoJS.enc.Utf8.parse("7061737323313233");
    const iv = CryptoJS.enc.Utf8.parse("7061737323313233");
    const encrypted = CryptoJS.AES.encrypt(txt, key, {
      keySize: 16,
      iv: iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    // console.log('Encrypted :' + encrypted);
    return encrypted.toString();
  }

  // public static encryptRSA(txt: string) {
  //     const buffer = new Buffer(txt);
  // const encrypted = RSA.privateEncrypt('12345', buffer);

  // console.log('RSA: ' + encrypted.toString('base64'));
  //     // return encrypted;
  // }

  // public async getCurrentOpearationNumberByPageId(PageId: number) {
  //   // let operationNumber: number;
  //   const pageLoadRequestStart = UtilityManager.prepareFormLoadRequestParamV2(PageId, null);
  //   this.utilService.getService(URLs.pageLoadV2, pageLoadRequestStart)
  //     .subscribe(res => {
  //         this.operationNumber = res.body.oprNo;
  //       },
  //       err => {
  //         console.log(err);
  //       });
  //   return this.operationNumber;
  // }

  public async getCurrentOpearationNumberByPageId(
    PageId: number
  ): Promise<any> {
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

  //Getting max operation number based on user no
  async getOperationNumber(): Promise<any> {
    let result: any;
    const metaData = <MetaData>{
      pageId: FormsIDs.LoanRequest,
      componentId: ComponentsIDs.Default,
      oprNo: 1,
      funcMode: "I",
      usrNo: Number(SessionManager.getUserNo()),
      roleId: Number(SessionManager.getRoleId()),
      langCode: SessionManager.getLanguage(),
      calcObject: ["oprNo"],
    };
    const jsonDataRequest = {
      metadata: metaData,
      objectdata: [{}],
    };
    if (typeof result === "undefined") {
      // save result
      result = await this.utilService
        .postService(URLs.postData, jsonDataRequest)
        .toPromise()
        .then((resp) => resp as any);
      this.operationNumber = result["objectdata"][0]["oprNo"];
      return this.operationNumber;
    }
  }
}
