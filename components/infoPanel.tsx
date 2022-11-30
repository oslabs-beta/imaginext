import {attribute} from '../public/types'

export default function InfoPanel (att: attribute){
    const path: string = att.path;
    const dataRenderMethod: string = att.dataRenderMethod;

  return (
    <div>Hello I'm {path}</div>
  )
}