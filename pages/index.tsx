import Head from 'next/head'
import Image from 'next/image'
import SearchBar from '../components/searchBar'
import styles from '../styles/Home.module.css'
import Tree from 'react-d3-tree'
import { useState, useRef, useEffect } from 'react'
import { node, attribute, attributes } from '../public/types'
import InfoPanel from '../components/infoPanel'

const attributes: attributes = {
  pages: {
    id: "test",
    path: "test",
    dataRenderMethod: 'test',
  }
};

export default function Home() {
  const inputPath = useRef<null | HTMLInputElement>(null);

  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef<HTMLInputElement>(null);
  
  const [treeData, setTreeData] = useState(<div className="initial-message">Please Upload A Project</div>);
  const [currentAttribute, setCurrentAttribute] = useState<attribute>({
    id: '',
    path: "",
    dataRenderMethod: '',
    props: "",
  });

  useEffect(() => {
    console.log("Setting dimensions...");
    if (treeContainerRef.current && shouldRecenterTreeRef.current) {
      shouldRecenterTreeRef.current = false;
      const dimensions = treeContainerRef.current.getBoundingClientRect();

      setTreeTranslate({
        x: dimensions.width / 2,
        y: dimensions.height / 2,
      });
    }
  }, []);

  useEffect(() => {
    console.log("Adding event listeners...");
    const leafNodeArr: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-leaf-node");
    const nodeObj: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-node");
    const arrayCallback = (v: Element): void => {
      v.addEventListener("mouseover", (e:Event) => {
        let name = "";
        const target: Element = e.target as Element;

        if(target !== null) {
          if (target.tagName === "text") {
            name = target.innerHTML.toLowerCase();
          } else if (target.classList.value === "rd3t-label") {
            name = target.getElementsByTagName("text")[0].innerHTML.toLowerCase();
          } else if (target.tagName === "circle" && target.parentElement !== null) {
            name = target.parentElement?.getElementsByClassName("rd3t-label")[0].getElementsByTagName("text")[0].innerHTML.toLowerCase();
          }
        }

        const newObj = {...attributes[name]};
        setCurrentAttribute(newObj);
      });
    }

    Array.from(leafNodeArr).forEach(arrayCallback);
    Array.from(nodeObj).forEach(arrayCallback);
  });

  useEffect(() => {
    console.log("Adding IDs to attributes...");
    const leafNodeArr: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-leaf-node");
    const nodeArr: Array<Element> = Array.from(leafNodeArr).concat(Array.from(document.getElementsByClassName("rd3t-node")));
    

    //const target: Element = e.target as Element;
    
    Array.from(nodeArr).forEach((v) => {
      const child: Element = v.lastChild?.firstChild as Element;
      attributes[child.innerHTML.toLowerCase()].id = v.id;
    });
  });

  const getDynamicPathClass = ({target }) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };

  const separateData = (obj: node) => {
    attributes[obj.name] = obj.attributes;
    obj.attributes = undefined;
    
    if(obj.children === undefined) return

    obj.children.forEach((v) => {separateData(v)});
  }

  const onSubmit = (e: React.FormEvent) => {
    setTreeData(<div className="initial-message">Loading...</div>);
    const path: string = inputPath.current !== null ? inputPath.current.value : "inputPath.current is null"
    e.preventDefault();
    //post 
    fetch('http://localhost:3000/api/data', {
      method: 'POST',
      body: JSON.stringify({path: path}),
      headers:{'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((json) => {
      console.log(json)
      separateData(json);
      setTreeData(
        <Tree
          data={json}
          collapsible={true}
          pathFunc="diagonal"
          translate={treeTranslate}
          orientation="vertical"
          rootNodeClassName="node__root"
          branchNodeClassName="node__branch"
          leafNodeClassName="node__leaf"
          pathClassFunc={getDynamicPathClass}
          onNodeMouseOver={(e)=>{console.log("Moused Over: ", e)}}
          // onUpdate={(e)=>{console.log("On Update: ", e)}}
        />
      );
    })
    .then(() => {delete attributes["Pages"]})
    .catch((err) => console.log(err))
  }
  


  return (
    <>
      <div ref={treeContainerRef} style={{ height: '100vh', overflow: "hidden" }}>
        <SearchBar atts={attributes}/>
        <h3>locate the PAGES folder of your next.js project in vscode</h3>
        <h3>right click it, COPY PATH and paste below</h3>
        <h3>C:\Users\leora\Desktop\CodesmithRepos\floppy-osp\pages</h3>
        <form onSubmit={onSubmit}>
          <input placeholder="Routes Filepath..." ref={inputPath}></input>
          <button type='submit'>Submit</button>
        </form>
        <div className="info-panel">
          <InfoPanel att = {currentAttribute}/>
        </div>
        {treeData}
      </div>
    </>
  )
}
