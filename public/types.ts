export interface node {
  name: string;
  attributes: attribute;
  children?: node[];
}

export type attribute = {
  id: string
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