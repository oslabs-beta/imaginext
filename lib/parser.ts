import { parse } from '@typescript-eslint/typescript-estree';
import fs from 'fs';
import { walk } from 'estree-walker';
import { attribute } from '../public/types';


// TODO: add checks for client-side rendering and incremental static regeneration
// TODO: currently only works with pages directory. add app directory
export function getRenderMethod(tree: object) {
  let renderMethod = '';
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration') {
          if (node.declaration.id.name === 'getStaticProps') {
            //check for incremental static regeneration
            const isUsingRevalidation = checkIfRevalidation(node);
            console.log('getRenderMethod isUsingRevalidation: ', isUsingRevalidation)
            if (isUsingRevalidation === true) {
              renderMethod = 'ISR'
            } else {
              renderMethod = 'SSG';
            }
            this.skip();
          }
          else if (node.declaration.id.name === 'getServerSideProps') {
            renderMethod = 'SSR';
            this.skip();
          }
        }  
      }
    }
  })

  // assign default method of SSG
  if (renderMethod === '') {
    renderMethod = 'SSG';
  }

  return renderMethod;
}


export function checkReturn(tree: object) {
  let propsParsedObj: Record<string, unknown> = {};
  
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ExportNamedDeclaration') {
        if (node.declaration.type === 'FunctionDeclaration') {
          if (node.declaration.id.name === 'getStaticProps' || node.declaration.id.name === 'getServerSideProps') {
            
            const results =  checkProps(node);
            propsParsedObj = results;
            this.skip();
          }

          else {
            console.log("checkReturn: doesn't pass if check")
          }
        }  
      }
    }
  })

  return propsParsedObj;
}


export function checkProps(tree: object) {
  const propsParsed: Record<string, unknown> = {};

  walk(tree, {
    enter: function (node) {
      if (node.type === 'ReturnStatement') {
        // check for a 'props' object and parse it
        walk(tree, {
          enter: function (node) {
            if (node.type === 'Property' && node.key) {
              if (node.key.type === 'Identifier' && node.key.name === 'props') {
                if (node.value.type === 'ObjectExpression') {
                  for (let i = 0; i < node.value.properties.length; i++) {
                    const currentProp = node.value.properties;
                    propsParsed[currentProp[i].key.name] = node.value.properties[i].value.value;
                    //convert undefined/undeclared values to null to preserve property name when converting to json
                    if (node.value.properties[i].value.value === undefined) {
                      propsParsed[currentProp[i].key.name] = null;
                    }
                  }
                }
              }
            }
          }
        })
      }
    }
  })

  return propsParsed;
}


export function checkIfRevalidation(tree: object): boolean {
  let result = false;
  
  walk(tree, {
    enter: function (node) {
      if (node.type === 'ReturnStatement') {

        // check for a 'props' object and parse it
        walk(tree, {
          enter: function (node) {
            if (node.type === 'Property' && node.key) {
              if (node.key.type === 'Identifier' && node.key.name === 'revalidate') {
                console.log('revalidate', node.value.type)
                result = true;
                this.skip()
              }
            }
          }
        })
      }
      else {
        return false;
      }
    }
  })

  return result;
}

// check if importing SWR react hook library for fetch calls
// TODO possibly refactor to grab all imports first as array/object and then check imports for swr, to allow checking for other types of imports later
export function checkImportSwr(tree: object):boolean {
  let result = false;

  walk(tree, {
    enter: function(node) {
      if (node.type === 'ImportDeclaration' && node.source.value === 'swr') {
        result = true;
        this.skip();
      }
    }
  })
  return result;
}


// if using SWR react hook library, parse for fetch function
export function getSwrFetchData(tree: object) {
  let fetchURL = '';
  walk(tree, {
    enter: function(node) {
      if (node.type === 'CallExpression') {
        // using SWR react hook library for fetch calls
        if (node.callee.type === 'Identifier' && node.callee.name === 'useSwr') {
          fetchURL = node.arguments[0].value;
          // console.log('fetchURL:', fetchURL);
        }
        // TODO: handle if fetch is wrapped in a fetcher function
        // else if (node.callee.type == 'Identifier' && node.callee.name === 'fetch') {

          // if (node.callee.arguments[0] === 'Identifier') {
            // fetch is being wrapped in a fetcher function - insert logic
        // }
      }
    }
  })
  return fetchURL;
}


// main fetchData function which checks for fetch method use based on swr library use or not
export function getFetchData(tree: object) {
  let fetchURL = '';
  const usesSwr: boolean = checkImportSwr(tree);

  // if true, then using swr hooks library for fetching
  if (usesSwr === true) {
    fetchURL = getSwrFetchData(tree);

  // else normal fetch
  } else {
    walk(tree, {
      enter: function(node) {
        if (node.type === 'CallExpression') {
  
          // uses fetch()
          if (node.callee.type === 'Identifier' && node.callee.name === 'fetch') {
            // invokes simple fetch() call with a literal argument
            if (node.arguments[0].type === 'Literal') {
              fetchURL = node.arguments[0].value;
            }
          } 
        }
      }
    })
  }

  return fetchURL;
}


export function getRawTree(sourcePath: string) {
  const source = fs.readFileSync(sourcePath, "utf8");
  
  const ast = parse(source, {
    jsx: true,
  });

  return ast;
}

// main parser function that creates AST and returns node properties such as renderMethods
export default function runParser(sourcePath: string) {
  const attributeObj: attribute = {
    id: '',
    path: sourcePath,
    dataRenderMethod: '',
    fetchURL: '',
    props: {}
  };
  const rawTree = getRawTree(sourcePath);

  const renderMethod = getRenderMethod(rawTree);
  attributeObj['dataRenderMethod'] = renderMethod;

  const fetchData = getFetchData(rawTree);
  attributeObj['fetchURL'] = fetchData;

  const propsObj = checkReturn(rawTree);
  attributeObj.props = propsObj;

  return attributeObj;
}
