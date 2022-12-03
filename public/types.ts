export interface inputData {
  name: string;
  attributes: attribute | undefined;
  children?: child[];
}

export type child = {
  name: string;
  attributes: attribute;
  children?: child[];
}

export type attribute = {
  path: string
  dataRenderMethod: string
  props?: string
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
  [name: string]: prop
}