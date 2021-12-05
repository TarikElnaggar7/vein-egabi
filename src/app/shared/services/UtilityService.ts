import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
  HttpResponse,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { SessionManager } from "../utilities/SessionManager";

@Injectable()
export class UtilityService {
  sessionManager: SessionManager;
  constructor(private http: HttpClient) { }

  ///////////////////////////////////////////////
  private messageSource = new BehaviorSubject("default message");
  currentMessage = this.messageSource.asObservable();

  getClientIpAddr() {
    // return this.http.get("http://api.ipify.org/?format=json");   //public ip
    return this.http.get("http://10.3.1.102:8181/bedayte/testController/getClientIPAddress/", { responseType: 'text' }); //private ip

  }
  /////////////////////////////////////////////
  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  //////////////////////////////////////////////////////////

  getService(svcUrl: string, httpParams: any = null) {

    const httpheaders = new HttpHeaders({
      "Content-Type": "application/json",
      Token: SessionManager.getToken()
    });

    return this.http.get<any>(environment.apiUrl + svcUrl, {
      params: httpParams,
      headers: httpheaders,
      observe: "response",
    });

  }

  paramPutService(svcUrl: string, httpParams: any = null) {
    // alert('Get');
    // const httpParameters = httpParams;
    const httpheaders = new HttpHeaders({
      // 'Access-Control-Allow-Headers': '*',
      "Content-Type": "application/json",
      Token: SessionManager.getToken(),
    });
    const body = JSON.stringify({});

    return this.http.put<any>(environment.apiUrl + svcUrl, body, {
      params: httpParams,
      headers: httpheaders,
      observe: "response",
    });
    // .subscribe(resp => {
    //     console.log('response', resp);
    //   });
  }
  postService(
    svcUrl: string,
    httpBody: any,
    jsonConvert: boolean = true
  ) {
    // alert('post');
    // console.log(JSON.stringify(httpBody));
    // console.log("token", SessionManager.getToken());
    const body = jsonConvert ? JSON.stringify(httpBody) : httpBody;
    const httpheaders = new HttpHeaders({
      "Content-Type": "application/json",
      Token: SessionManager.getToken(),
    });
    const httpOptions = {
      headers: httpheaders,
    };
    // console.log('post body', body);
    // console.log(httpheaders);
    // console.log(SessionManager.getToken());
    // console.log(environment.apiUrl + svcUrl);
    return this.http.post<any>(environment.apiUrl + svcUrl, body, httpOptions);
  }

  uploadFile(svcUrl: string, file: any, httpBody: any) {
    console.log("doc body: ", httpBody);
    // let fileList: FileList = event.target.files;
    // if(fileList.length > 0) {
    // let file: File = fileList[0];
    // let body = jsonConvert ? JSON.stringify(httpBody) : httpBody;

    let formData: FormData = new FormData();

    formData.append('file', file);
    for (const property in httpBody) {
      console.log(`${property}: ${httpBody[property]}`);

      formData.append(`${property}`, httpBody[property]);
    }
    const httpheaders = new HttpHeaders({
      // "Content-Type": "multipart/form-data",
      // "Accept": "application/json",
      Token: SessionManager.getToken(),
    });
    // let headers = new Headers();
    /** In Angular 5, including the header Content-Type can invalidate your request */
    // httpheaders.append('Content-Type', 'multipart/form-data');
    // httpheaders.append('Accept', 'application/json');
    // body. formData };

    const httpOptions = {
      headers: httpheaders,
    };

    // let options = new RequestOptions({ headers: httpheaders });
    return this.http.post<any>(environment.apiUrl + svcUrl, formData, httpOptions);

    // this.http.post(`${this.apiEndPoint}`, formData, httpOptions)
    //     .map(res => res.json())
    //     .catch(error => Observable.throw(error))
    //     .subscribe(
    //         data => console.log('success'),
    //         error => console.log(error)
    //     )
    // }
  }
  putService(
    svcUrl: string,
    httpBody: any,
    jsonConvert: boolean = true
  ): Observable<any> {
    const body = jsonConvert ? JSON.stringify(httpBody) : httpBody;
    const httpheaders = new HttpHeaders({
      "Content-Type": "application/json",
      Token: SessionManager.getToken(),
    });
    const httpOptions = {
      headers: httpheaders,
    };
    // console.log('put body', body);
    return this.http.put<any>(environment.apiUrl + svcUrl, body, httpOptions);
  }
  deleteService(
    svcUrl: string,
    httpBody: any,
    jsonConvert: boolean = true
  ): Observable<any> {
    const body = jsonConvert ? JSON.stringify(httpBody) : httpBody;
    // console.log('delete body', body);
    const httpheaders = new HttpHeaders({
      "Content-Type": "application/json",
      Token: SessionManager.getToken(),
    });
    const httpOptions = {
      headers: httpheaders,
      body: body,
    };
    return this.http.delete<any>(environment.apiUrl + svcUrl, httpOptions);
  }
}
