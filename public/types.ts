export interface inputData {
  name: string;
  attributes?: { path: string };
  children: undefined | child[];
}

export type child = {
  name: string;
  attributes: {
    path: string
  };
  children: undefined | child[];
}
export type postProject = {
    method: string
    header:{},
    body: string
}
export type header = {
    
}