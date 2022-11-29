import { parse } from '@typescript-eslint/typescript-estree';
import fs from 'fs';
import { walk } from 'estree-walker';


type DataObj = {
  renderMethod: string,
}

// TODO: add checks for client-side rendering and incremental static regeneration
// TODO: currently only works with pages directory. add app directory
export function logAst(tree: object) {
  let renderMethod = '';
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration') {
          if (node.declaration.id.name === 'getStaticProps') {
            console.log('this is ExportNamedDeclaration node:', node)
            renderMethod = 'SSG';
            this.skip();
          }
          else if (node.declaration.id.name === 'getServerSideProps') {
            console.log('this is ExportNamedDeclaration node:', node)
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
    renderMethod = 'SSG'
  }

  return renderMethod
}

export function getRawTree(sourcePath: string){
  console.log('sourcePath: ', sourcePath)
  const source = fs.readFileSync(sourcePath, "utf8")
  
  const ast = parse(source, {
    jsx: true,
  });

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
