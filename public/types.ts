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
  method: string
  header: Record<string, unknown>,
  body: string
}

export type header = Record<string, unknown>

export type attribute = {
  path: string
  dataRenderMethod: string
  fetchURL?: string
  props?: string
}

export type attributes = {
  [name: string]: attribute
}