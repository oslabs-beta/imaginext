import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Tree from 'react-d3-tree'
import {useState,useRef, useEffect} from 'react'

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
  const test = {
    name: 'Pages',
    children: [
      {
        name: "_app.tsx",
        attributes: {
            path: "pages/_app.tsx",
        },
          children:[]
      },
       {
        name: "index.tsx",
        attributes: {
            path: "pages/index.tsx",
        },
          children:[]
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
               }
          ]
      },
    ]
  }
  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);

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

  return (
    // <div id='treeWrapper' style={{ width: '50em', height: '20em' }}>
    //   <Tree data = {test} />
    //   </div>
        <div ref={treeContainerRef} style={{ height: '100vh' }}>
      <Tree
        data={test}
        collapsible={true}
        pathFunc="step"
        translate={treeTranslate}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
      />
    </div>
  )
}
