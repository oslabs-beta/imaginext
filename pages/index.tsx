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
    path: "test",
    dataRenderMethod: 'test'
  }
};

export default function Home() {
  const inputPath = useRef<null | HTMLInputElement>(null);

  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef(null);
  
  const [treeData, setTreeData] = useState(<div className="initial-message">Please Upload A Project</div>);
  const [currentAttribute, setCurrentAttribute] = useState({
    path: "",
    dataRenderMethod: '',
    props: "",
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
    const arrayCallback = (v: HTMLElement): void => {
      v.addEventListener("mouseover", (e:Event) => {
        let newObj: attribute = {
          path: '',
          dataRenderMethod: '',
        }
        let name: string = "";

        if (e.target.tagName === "text") {
          name = e.target.innerHTML.toLowerCase();
        } else if (e.target.classList === "rd3t-label") {
          name = e.target.getElementsByTagName("text")[0].innerHTML.toLowerCase();
        } else if (e.target.tagName === "circle") {
          name = e.target.parentElement.getElementsByClassName("rd3t-label")[0].getElementsByTagName("text")[0].innerHTML.toLowerCase();
        }

        // console.log("name", name);
        newObj = {...attributes[name]};
        // console.log("newObj", newObj);
        // console.log("attributes", attributes);
        setCurrentAttribute(newObj);
      });
    }

    Array.from(leafNodeArr).forEach(arrayCallback);
    Array.from(nodeObj).forEach(arrayCallback);
  });



  const getDynamicPathClass = ({ source, target }) => {
    if (!target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };

  const separateData = (obj: node) => {
    attributes[obj.name] = obj.attributes;
    console.log("separateData attributes", attributes);

    obj.attributes = undefined;
    
    if(obj.children === undefined) return

    obj.children.forEach((v) => {separateData(v)});
  }

  const onSubmit = (e: React.FormEvent) => {
      const path: string = inputPath.current.value;
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
          />
        );
      })
      .catch((err) => console.log(err))
  }
  


  return (
    <>
      <div ref={treeContainerRef} style={{ height: '100vh', overflow: "hidden" }}>
        <SearchBar />
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
