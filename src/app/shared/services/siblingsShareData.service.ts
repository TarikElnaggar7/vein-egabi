import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SiblingsShareDataService {
  private data:any = undefined;
  private redirectPage:any = undefined;

  setData(data:any){
      this.data = data;
  }

  getData():any{
      return this.data;
  }

  getRedirectPage(){
    return this.redirectPage;

  }
constructor() {this.data=null; }

}
