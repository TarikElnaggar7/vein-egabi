import {Injectable} from '@angular/core';
import {UtilityManager} from '../utilities/UtilityManager';
import {DbTables, DescrColums, KeyValueColums, LookupFlag, URLs} from '../utilities/Constants';
import {UtilityService} from './UtilityService';
import {ReportModel} from '../models/report.model';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private converter = 'data:application/pdf;base64,';
  private reportId: any;
  private resposneType: boolean;
  public src = new Subject<string>();
  public reportTitle = new Subject<string>();

  private reportData: ReportModel = {vars: {}, reportCode: 0, designFlag: 0};

  constructor(private utilService: UtilityService, private spinner: NgxSpinnerService) {
  }

// To convert BASE64 to Pdf and preview it in pdf viewer

  converToPdf(reportBase64: string) {
    return this.converter + reportBase64;
  }

// To download the Pdf with it's name from the server

  downloadPdf(reportPdf: string, fileName: string) {
    const downloadLink = document.createElement('a');
    downloadLink.href = reportPdf;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  // Get report id

  getReportId(pageId: number) {
    const reportsIds = <any[]>[{
      name: 'page_id',
      valueKey: pageId
    }
    ];
    const reportIdLookupRequest = UtilityManager.prepareLookupRequest(DbTables.dynamic_excel_gen, LookupFlag.DbTable,
      KeyValueColums.CODE, DescrColums.ARName, reportsIds);
    this.utilService.postService(URLs.getLookup, reportIdLookupRequest)
      .subscribe(res => {
          this.reportId = res[0].valueKey;
        },
        err => {
          console.log(err);
        }
      );
    return this.reportId;
  }

// Preview report in all screens
  previewReport(reportObj: any) {

    // this.resposneType = confirm('Do you want to preview the report ?');
    this.reportData.vars = Object.assign(reportObj);
    this.reportData.designFlag = 0;
    this.reportData.reportCode = this.reportId;
    this.spinner.show();
    this.utilService.postService(URLs.createReport, this.reportData)
      .subscribe(res => {
          this.src.next(this.converToPdf(res.data));
          this.reportTitle.next(res.reportTitle);
          this.spinner.hide();
        },
        err => {
          console.log(err);
        }
      );


  }

// Preview report in Add report page ( Administrator only )
  previewReportAsAdministrator(reportObj: any) {
    this.resposneType = confirm('Do you want to preview the report ?');
    if (this.resposneType === true) {
      this.reportData = Object.assign(reportObj);
      this.reportData.designFlag = 1;
      this.reportData.reportCode = 0;

      this.utilService.postService(URLs.createReport, this.reportData)
        .subscribe(res => {
            this.src.next(this.converToPdf(res.data));
          },
          err => {
            console.log(err);
          }
        );
    } else {
    }

  }
}

// const fileName = 'downloadedPdf.pdf';
