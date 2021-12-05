export interface MenuItem {
  lvl: number;
  advFlag: number;
  limitFlag: number;
  nodeLeaf: number;
  nodeSer: number;
  pageDescription: string;
  pageId: number;
  pageName: string;
  pageSer: number;
  pageType: number;
  pageUrl: string;
  parentId: number;
  tranFlag: number;
  vhrFlag: number;
  subItems: MenuItem[];
  subSubItems: MenuItem[];
}
