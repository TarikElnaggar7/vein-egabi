export class UploadDocumentModel {
  debtRecordCode: number;
  docExt: string;
  docTypeId: number;
  id: number;
  wfDocId: string;
  uploadDate: string;
  layerCode: number;
  loanType: number;
  prodCode: number;
  docId: number;
  importFlag: string;
  importFlagOld: string;
  newrenewflag: string;
  usrno: number;
  extparam: string;
  aname: string;
  rejected: string;
  deletedFalg: number;
  type: string;
  moduleNo: number;
  fileContent: string;
  rejectedReasonsVOS: Array<rejectedReasons> = [];
}

export class rejectedReasons {
  debtRecord: number = null;
  idno: number = null;
  jobCode: string = 'CR';
  pageID: number = 607;
  itemCode: number = null;
  seq: number = null;
  oprno: number = null;
  usrno: any = null;
  pageName: string = null;
  fieldName: string = null;
  rejectionReason: string = null;
  rejectCode: number = null;
  notes: string = null;
  phase: string = null;
  rejectionCommentsReview = null;
}

