import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Tree from 'react-d3-tree'
import { useState, useRef, useEffect } from 'react'
import { inputData, child } from '../public/types'

/**
 * react-3d-tree is looking for the data entry in the following format: 
 * 
 * 
 interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}
 */


export default function Home() {
  const test : inputData = {
    name: 'Pages',
    attributes: {
      path: "pages",
    },
    children: [
      {
        name: "_app.tsx",
        attributes: {
          path: "pages/_app.tsx",
        },
        children: undefined
      },
       {
        name: "index.tsx",
        attributes: {
            path: "pages/index.tsx",
        },
        children: undefined
      },
           {
        name: "api",
        attributes: {
            path: "pages/api",
        },
        children: [
          {
            name: "hello.ts",
            attributes: {
              path:"pages/api/hello.ts"
            },
            children: undefined
          }
        ]
      },
    ]
  }
  
  const separateData = (obj: inputData) => {
    setAttribute({obj.name: obj.attributes})
    obj.attributes = undefined;
    
    if(obj.children === undefined) return

    obj.children.forEach((v) => {separateData(v)});



    // obj.children = obj.children.map((val, index) => {
    //   return {
    //     ...val,
    //     attributes: undefined
    //   }
    // })
  }


  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  const [treeData, setTreeData] = useState(<h6>Please Upload A Project</h6>)
  const [attribute, setAttribute] = useState({'pages': attribute:{path:"pages"}})

  useEffect(() => {
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 2,
      });
    }
  });

  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };
   
  const handleSubmit = () => {
    const input = document.getElementById("submitInput");
    let value: string = input.value;
    if(value === null) value = "";
    console.log(value);

    // fetch('/data', {
    //   method: 'POST',
    //   header: {
    //     "Content-Type": "application/json"
    //   },
    //   body:JSON.stringify(value),
    // })

    separateData(test);

    setTreeData(
      <Tree
        data={test}
        collapsible={true}
        pathFunc="diagonal"
        translate={treeTranslate}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        pathClassFunc={getDynamicPathClass}
      />
    );
  }


  return (
    
    <div ref={treeContainerRef} style={{ height: '100vh' }}>

      <input id="submitInput"></input>
      <button onClick={handleSubmit}>Submit</button>

      {treeData}
    </div>
  )
}
