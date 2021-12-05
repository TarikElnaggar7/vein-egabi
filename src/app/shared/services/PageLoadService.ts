import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MetaData } from '../models/MetaData.model';

@Injectable()

export class PageLoadService {

    getFormLoadURL = 'http://localhost:52317/api/getformload/';
    private _pageLoadURL = 'fatca/api/auth/login/ang/load';
    private _pageLoadLOCURL = 'http://localhost:52317/api/getformloadpost';
    testFatcaGetURL = 'http://10.3.1.102:8080/fatca/api/user/test/get';
    testGLGETURL = 'http://10.3.1.102:8080/bedayte/test/getAudit';
    testGLPOSTURL = 'http://10.3.1.102:8080/bedayte/test';
    testGLPUTURL = 'http://10.3.1.102:8080/bedayte/testPut';
    testGLDeleteURL = 'bedayte/testDelete';
    // private _pageLoadURL = 'http://localhost:52317/api/GL/';//

    constructor(private http: HttpClient) { }
    getPosts(requestData: MetaData) {
        const data = 'angular';
        // let httpParams = new httpParams({})
        const body = JSON.stringify(requestData);
        return this.http.get(this.testGLGETURL);
    }
    getLoginForm(requestData: MetaData): Observable<any[]> {
        alert('service');
        // let httpParams = new HttpParams().set("data",body);
        const httpheaders = new HttpHeaders({
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Headers': 'Content-Type, Token, Accept',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Max-Age': '3600',
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            // tslint:disable-next-line:max-line-length
            // 'Token':'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJKb2UifQ.OR9nk6N4kJHslYvTlxKQ3yLx__7fOft3e3We5orpOaaUZeYl0Rm_v9nUbz4_i4brSAAfr7EolFJlH-xlEtukhQ',
            'Token': 'egabi-fatca-159753',
        });
        const httpOptions = {
            'Method': 'POST',
            headers: httpheaders
            // withCredentials:true,
            // headers: new HttpHeaders({
            //   'Accept':  'application/json',
            //   'Content-Type':  'application/json',
            //   'Token':'egabi-fatca-159753'
            //   //'Access-Control-Allow-Origin':'*'
            // })

        };

        const body = JSON.stringify(requestData);
        console.log(body);
        console.log(httpOptions);
        return this.http.post<any[]>(this._pageLoadURL, body, httpOptions);
        // return this.http.get<FormControl[]>(this._pageLoadURL);
        // subscribe(res=>console.log(res));

    }
    getLoginFormLOC(requestData: MetaData) {
        alert('LOC');
        const body = JSON.stringify(requestData);
        // const body="bbbbbbbb";
        // const httpheaders = new HttpHeaders().set('content-type', 'application/json');
        const httpheaders = new HttpHeaders({
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Token': 'egabi-fatca-159753'
            // 'Access-Control-Allow-Origin':'*',
            'Access-Control-Allow-Methods': 'POST,OPTIONS'
        });
        const httpOptions = {
            // Methods:"POST",
            headers: httpheaders
            // withCredentials:true,
            // headers: new HttpHeaders({
            //   'Accept':  'application/json',
            //   'Content-Type':  'application/json',
            //   'Token':'egabi-fatca-159753'
            //   //'Access-Control-Allow-Origin':'*'
            // })

        };


        console.log(body);
        console.log(httpOptions);
        return this.http.post(this._pageLoadLOCURL, body, httpOptions);
        // return this.http.get<FormControl[]>(this._pageLoadURL);
        // subscribe(res=>console.log(res));

    }
    testPost(): Observable<any> {
        console.log('Post Test');
        const body = JSON.stringify({
            'metadata': {
                'usrNo': '1',
                'roleId': '100',
                'langCode': 'AR',
                'pageId': 18,
                'componentId': 1,
                'ipAddress': '10.2.2.30'
            },
            'objectdata': [
                {
                    'usruNo': '2',
                    'rolekId': '200'
                },
                {
                    'usruNo': '1',
                    'rolekId': '100'
                }
            ]
        });
        // const body="bbbbbbbb";
        // const httpheaders = new HttpHeaders().set('content-type', 'application/json');
        const httpheaders = new HttpHeaders({
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': 'egabi-fatca-159753'
            // 'Access-Control-Allow-Origin':'*',
            // 'Access-Control-Allow-Methods': 'POST,OPTIONS'
        });
        const httpOptions = {
            // Methods:"POST",
            headers: httpheaders
            // withCredentials:true,
            // headers: new HttpHeaders({
            //   'Accept':  'application/json',
            //   'Content-Type':  'application/json',
            //   'Token':'egabi-fatca-159753'
            //   //'Access-Control-Allow-Origin':'*'
            // })

        };


        console.log(body);
        console.log(httpOptions);
        return this.http.post<any>(this.testGLPOSTURL, body, httpOptions);
        // return this.http.get<FormControl[]>(this._pageLoadURL);
        // subscribe(res=>console.log(res));

    }
    testPut(): Observable<any> {
        console.log('PUT Test');
        const body = JSON.stringify({
            'metadata': {
                'usrNo': '1',
                'roleId': '100',
                'langCode': 'AR',
                'pageId': 18,
                'componentId': 1,
                'ipAddress': '10.2.2.30'
            },
            'objectdata': [
                {
                    'usruNo': '2',
                    'rolekId': '200'
                },
                {
                    'usruNo': '1',
                    'rolekId': '100'
                }
            ]
        });
        // const body="bbbbbbbb";
        // const httpheaders = new HttpHeaders().set('content-type', 'application/json');
        const httpheaders = new HttpHeaders({
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': 'egabi-fatca-159753'
            // 'Access-Control-Allow-Origin':'*',
            // 'Access-Control-Allow-Methods': 'POST,OPTIONS'
        });
        const httpOptions = {
            // Methods:"POST",
            headers: httpheaders
            // withCredentials:true,
            // headers: new HttpHeaders({
            //   'Accept':  'application/json',
            //   'Content-Type':  'application/json',
            //   'Token':'egabi-fatca-159753'
            //   //'Access-Control-Allow-Origin':'*'
            // })

        };


        console.log(body);
        console.log(httpOptions);
        return this.http.put<any>(this.testGLPUTURL, body, httpOptions);
        // return this.http.get<FormControl[]>(this._pageLoadURL);
        // subscribe(res=>console.log(res));

    }
    testDelete(): Observable<any> {
        console.log('Delete Test');
        const body = JSON.stringify({
            'metadata': {
                'usrNo': '1',
                'roleId': '100',
                'langCode': 'AR',
                'pageId': 18,
                'componentId': 1,
                'ipAddress': '10.2.2.30'
            },
            'objectdata': [
                {
                    'usruNo': '2',
                    'rolekId': '200'
                },
                {
                    'usruNo': '1',
                    'rolekId': '100'
                }
            ]
        });
        // const body="bbbbbbbb";
        // const httpheaders = new HttpHeaders().set('content-type', 'application/json');
        const httpheaders = new HttpHeaders({
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': 'egabi-fatca-159753'
            // 'Access-Control-Allow-Origin':'*',
            // 'Access-Control-Allow-Methods': 'POST,OPTIONS'
        });
        const httpOptions = {
            // Methods:"POST",
            headers: httpheaders,
            body: body,
            // withCredentials:true,
            // headers: new HttpHeaders({
            //   'Accept':  'application/json',
            //   'Content-Type':  'application/json',
            //   'Token':'egabi-fatca-159753'
            //   //'Access-Control-Allow-Origin':'*'
            // })

        };


        console.log(body);
        console.log(httpOptions);
        return this.http.delete(environment.apiUrl + this.testGLDeleteURL, httpOptions);
        // return this.http.get<FormControl[]>(this._pageLoadURL);
        // subscribe(res=>console.log(res));

    }
}
