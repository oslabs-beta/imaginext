import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Tree from 'react-d3-tree'
import { useState, useRef, useEffect } from 'react'
import { inputData, child, attribute, attributes } from '../public/types'
import InfoPanel from '../components/infoPanel'

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

const attributes : attributes = {
  pages: {
    path: "test", 
    dataRenderMethod: 'test'
  }
};

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
          dataRenderMethod: 'SSR',
          props:'haha '
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

  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  
  const [treeData, setTreeData] = useState(<div className="initial-message">Please Upload A Project</div>)
  const [currentAttribute, setCurrentAttribute] = useState({
    path: "", 
    dataRenderMethod: '',
  });

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

  useEffect(() => {
    const leafNodeArr = document.getElementsByClassName("rd3t-leaf-node");
    const nodeObj = document.getElementsByClassName("rd3t-node");
    const arrayCallback = (v: HTMLElement) => {
      v.addEventListener("mouseover", (e:Event) => {
        let newObj: attribute = {};
        let name: string = "";

        if(e.target.tagName === "text") {
          name = e.target.innerHTML.toLowerCase();
        } else if(e.target.classList === "rd3t-label") {
          name = e.target.getElementsByTagName("text")[0].innerHTML.toLowerCase();
        } else if(e.target.tagName === "circle") {
          name = e.target.parentElement.getElementsByClassName("rd3t-label")[0].getElementsByTagName("text")[0].innerHTML.toLowerCase();
        }

        console.log("name", name);
        newObj = {...attributes[name]};
        console.log("newObj", newObj);
        console.log("attributes", attributes);
        setCurrentAttribute(newObj);
      });
    }

    Array.from(leafNodeArr).forEach(arrayCallback);
    Array.from(nodeObj).forEach(arrayCallback);
  });



  const getDynamicPathClass = ({ source, target }, orientation) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };

  const separateData = (obj: inputData) => {
    attributes[obj.name] = obj.attributes;
    console.log("separateData attributes", attributes);

    obj.attributes = undefined;
    
    if(obj.children === undefined) return

    obj.children.forEach((v) => {separateData(v)});
  }
   
  const handleSubmit = () => {
    const input: HTMLElement | null = document.getElementById("submitInput");
    let value: string;
    input != null ? value = input.value : value = ""
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

    const leafNodeArr = document.getElementsByClassName("rd3t-leaf-node");
    const nodeObj = document.getElementsByClassName("rd3t-node");
    console.log(nodeObj);
    console.log(nodeObj.length);
    
    for (let key in nodeObj) {
      console.log(nodeObj);
      console.log("key", key);
      console.log("nodeObj[key]", nodeObj[key]);
      console.log("id", nodeObj[key].id);
      console.log("Keys", Object.keys(nodeObj));
      // nodeObj[key].addEventListener("mouseover", (e:Event) => {
      //   const newObj: attributes = {};
      //   const name: string = e.target.getElementsByTagName("text")[0].innerHTML;

      //   newObj[name] = attributes[name]
      //   setCurrentAttribute(newObj);
      //   console.log("name", name);
      // });
    }
  }


  return (
    <>
      <div ref={treeContainerRef} style={{ height: '100vh', overflow: "hidden" }}>
        <div className="submit">
          <input id="submitInput"></input>
          <button onClick={handleSubmit}>Submit</button>
        </div>
        <div className="info-panel">
          <InfoPanel att = {currentAttribute}/>

        </div>

        {treeData}
      </div>
      
    </>
  )
}
