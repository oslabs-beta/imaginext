import { parse } from '@typescript-eslint/typescript-estree';
import fs from 'fs';
import { walk } from 'estree-walker';


type DataObj = {
  renderMethod?: string,
}

export function logAst(tree: object) {
  let renderMethod = '';
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration' && node.declaration.id.name === 'getStaticProps') {
          console.log('this is ExportNamedDeclaration node:', node)
          renderMethod = 'ssg';
          this.skip();
        }
        else console.log('not pass')
      }
    }
  })
  console.log('exit logAst')
  return renderMethod
}

export function parseTree(sourcePath: string){
  console.log('sourcePath: ', sourcePath)
  const source = fs.readFileSync(sourcePath, "utf8")
  
  const ast = parse(source, {
    jsx: true,
  });

  return ast;
}


export default function TestParse(sourcePath: string){
  const dataObj: DataObj = {}
  const rawTree = parseTree(sourcePath);

  const renderMethod = logAst(rawTree);
  console.log('renderMethod', renderMethod)
  dataObj['renderMethod'] = renderMethod
  return dataObj;
}
