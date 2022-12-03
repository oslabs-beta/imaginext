import path from 'path';
import runParser from '../../lib/parser'

// test page only - do not submit to build

type Data = {
  message: string,
  data: object,
}
export default function Hello(props: Data) {
  // const dataObj = data;
  // console.log('dataObj', dataObj)
  console.log('props:', props)
  console.log('props.message:', props.message)
  return (
    <>
      <h1>Parse!</h1>
      <p>
        {props.message}
      </p>
      <p>
        {props.data.renderMethod}
      </p>
    </>

  )
}

export async function getServerSideProps() {

  const sourcePath = path.join(process.cwd(), "/pages/api/hello.ts")
  console.log('sourcePath: ', sourcePath)

  const ast = await runParser(sourcePath)
  console.log('ast:', ast)

  return {
    props: {
      message: 'welcome to parse page!',
      data: ast,
    }
  }
}