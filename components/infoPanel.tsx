import {attribute, attributes} from '../public/types'

export default function InfoPanel (props: {att:attribute}) {
    const path: string = props.att.path;
    const dataRenderMethod: string = props.att.dataRenderMethod;

  return (
    <>
      <div>Path: {path}</div>
      <div>Data Render Method: {dataRenderMethod}</div>
    </>
  )
}