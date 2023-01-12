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

export type header = Record<string, unknown>
