export interface inputData {
  name: string;
  attributes?: attribute;
  children: undefined | child[];
}

export interface newObj {
  name: string
  attributes: {
    path: string,
    // data: Record<string, unknown>
    dataRenderMethod: string,
    fetchURL: string
  }
  children: undefined|object[]
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
export type attribute = {
  path: string
  dataRenderMethod: string
  props?: string
}
export type attributes = {
  [name: string]: attribute
}