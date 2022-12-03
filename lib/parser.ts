import { parse } from '@typescript-eslint/typescript-estree';
import fs from 'fs';
import { walk } from 'estree-walker';


type DataObj = {
  renderMethod: string,
}

// TODO: add checks for client-side rendering and incremental static regeneration
// TODO: currently only works with pages directory. add app directory
// TODO: add checks if file is not js/jsx/ts/tsx file - if so, don't run parser. possibly add the check to data.ts instead?
export function logAst(tree: object) {
  let renderMethod = '';
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration') {
          if (node.declaration.id.name === 'getStaticProps') {
            console.log('ExportNamedDeclaration node:', node)
            console.log('render method: SSG')
            renderMethod = 'SSG';
            this.skip();
          }
          else if (node.declaration.id.name === 'getServerSideProps') {
            console.log('ExportNamedDeclaration node:', node)
            console.log('render method: SSR')
            renderMethod = 'SSR';
            this.skip();
          }
          else console.log("doesn't pass if check")
        }  
      }
    }
  })
  console.log('exiting logAst')

  // assign default method of SSG
  if (renderMethod === '') {
    console.log('assign default SSG')
    renderMethod = 'SSG'
  }

  return renderMethod
}

export function getRawTree(sourcePath: string){
  console.log('sourcePath: ', sourcePath)
  const source = fs.readFileSync(sourcePath, "utf8")
  // console.log('source: ', source)
  
  const ast = parse(source, {
    jsx: true,
  });

  // console.log('ast: ', ast)
  // console.log('ast.body[1]: ', ast.body[1])
  return ast;
}


export default function runParser(sourcePath: string){
  const dataObj: DataObj = {
    renderMethod: ''
  }
  const rawTree = getRawTree(sourcePath);

  const renderMethod = logAst(rawTree);
  console.log('renderMethod', renderMethod)
  dataObj['renderMethod'] = renderMethod
  return dataObj;
}
