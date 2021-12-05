import {Injectable} from '@angular/core';
import {Lookup} from '../models/Lookup.model';

@Injectable()
export class SessionManager {
  //#region Constants
  private static tokenKey = 'Token';
  private static defaultTokenValue = 'egabi-bankplus-159753';
  private static langKey = 'Language';
  private static userNoKey = 'UserNo';
  private static userNameKey = 'UserName';
  private static roleIdKey = 'RoleId';
  private static rolesKey = 'UserRoles';
  private static custInfoPload = 'CustInfoLoad';
  //#endregion
  //#region Token
  public static setToken(tokenValue: string): void {
    sessionStorage.setItem(this.tokenKey, tokenValue);
  }

  public static getToken(): string {
    if (sessionStorage.getItem(this.tokenKey) == null) {
      return this.defaultTokenValue;
    }
    return sessionStorage.getItem(this.tokenKey);
  }

  public static clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
  }

  //#endregion
  //#region Language
  public static setLanguage(langValue: string): void {

    sessionStorage.setItem(this.langKey, langValue);
  }

  public static getLanguage(): string {
    if (sessionStorage.getItem(this.langKey) == null) {
      return 'AR';
    }
    return sessionStorage.getItem(this.langKey);
  }

  public static clearLanguage(): void {
    sessionStorage.removeItem(this.langKey);
  }

  public static changeAppLanguage() {
    if (SessionManager.getLanguage() === 'AR' || SessionManager.getLanguage() === undefined) {
      SessionManager.setLanguage('AR');
      // @ts-ignore
      document.querySelector('#rtl').disabled = false;
      // @ts-ignore
      document.querySelector('#rtlBootstrap').disabled = false;
    } else {
      SessionManager.setLanguage('EN');
      // @ts-ignore
      document.querySelector('#rtl').disabled = true;
      // @ts-ignore
      document.querySelector('#rtlBootstrap').disabled = true;
    }
  }

  //#endregion
  //#region UserNo
  public static setUserNo(userNoValue: string): void {
    sessionStorage.setItem(this.userNoKey, userNoValue);
  }

  public static getUserNo(): string {
    return sessionStorage.getItem(this.userNoKey);
  }

  public static clearUserNo(): void {
    sessionStorage.removeItem(this.userNoKey);
  }

  //#endregion
  //#region UserName
  public static setUserName(userNameValue: string): void {
    sessionStorage.setItem(this.userNameKey, userNameValue);
  }

  public static getUserName(): string {
    return sessionStorage.getItem(this.userNameKey);
  }

  public static clearUserName(): void {
    sessionStorage.removeItem(this.userNameKey);
  }

  //#endregion
  //#region RoleId
  public static setRoleId(roleIdValue: string): void {
    sessionStorage.setItem(this.roleIdKey, roleIdValue);
  }

  public static getRoleId(): string {
    return sessionStorage.getItem(this.roleIdKey);
  }

  public static clearRoleId(): void {
    sessionStorage.removeItem(this.roleIdKey);
  }

  //#endregion
  //#region RoleId
  public static setUserRoles(roles: any[]): void {
    sessionStorage.setItem(this.rolesKey, JSON.stringify(roles));
  }

  public static getUserRoles(): string {
    return sessionStorage.getItem(this.rolesKey);
  }

  public static clearUserRoles(): void {
    sessionStorage.removeItem(this.rolesKey);
  }

  //#endregion
  //#region Cust Info Page Load
  public static setCustInfoPLoad(pageLoad: any): void {
    sessionStorage.setItem(this.custInfoPload, JSON.stringify(pageLoad));
  }

  public static getCustInfoPLoad(): string {
    return sessionStorage.getItem(this.custInfoPload);
  }

  public static clearCustInfoPLoad(): void {
    sessionStorage.removeItem(this.custInfoPload);
  }

  //#endregion
}
