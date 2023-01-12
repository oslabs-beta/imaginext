export interface node {
  name: string;
  attributes: attribute | undefined;
  children?: Array<node>;
}

export type attribute = {
  id: string;
  path: string;
  dataRenderMethod: string;
  fetchURL?: string;
  props?: string;
}

export type attributes = {
  [name: string]: attribute
}

export type prop = {
  type: string;
  value: any;
  parent: string;
}

export type props = {
  [name: string]: prop;
}





export interface Data {
  name: string;
  children: undefined | object[];
}
export interface newObj extends Data {
  attributes: attribute;
}

export interface inputData extends Data {
  attributes?: attribute;
}

export type postProject = {
  method: string;
  header: Record<string, unknown>;
  body: string;
}

<<<<<<< HEAD
export type header = Record<string, unknown>;
=======
export type header = Record<string, unknown>
>>>>>>> 67021e6937a169628ca8c2f68d8de98eb5f081a8
