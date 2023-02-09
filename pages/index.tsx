
import Head from 'next/head'
import Image from 'next/image'
import SearchBar from '../components/searchBar'
import Tree from 'react-d3-tree'
import { useState, useRef, useEffect } from 'react'
import { node, attribute, attributes } from '../public/types'
import InfoPanel from '../components/infoPanel'
import { log } from 'console'
import { TreeLinkDatum } from 'react-d3-tree/lib/types/common'

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
  
  const [treeData, setTreeData] = useState(<div className="initial-message"></div>);
  const [currentAttribute, setCurrentAttribute] = useState<attribute>({
    id: '',
    path: "",
    dataRenderMethod: '',
    props: {},
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
  }, []);

  useEffect(() => {
    const leafNodeArr: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-leaf-node");
    const nodeObj: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-node");
    const arrayCallback = (v: Element): void => {
      v.addEventListener("mouseover", (e:Event) => {
        let name = "";
        const target: Element = e.target as Element;
        
        if(e.target !== null) {
          if (target.tagName === "text") {
            name = target.innerHTML.toLowerCase();
          } else if (target.classList.value === "rd3t-label") {
            name = target.getElementsByTagName("text")[0].innerHTML.toLowerCase();
          } else if (target.tagName === "circle" && target.parentElement) {
            name = target.parentElement.getElementsByClassName("rd3t-label")[0].getElementsByTagName("text")[0].innerHTML.toLowerCase();
          }
        }

        const newObj: attribute = {...attributes[name]};
        setCurrentAttribute(newObj);
      });
    }

    Array.from(leafNodeArr).forEach(arrayCallback);
    Array.from(nodeObj).forEach(arrayCallback);
  });

  useEffect(() => {
    const leafNodeArr: HTMLCollectionOf<Element> = document.getElementsByClassName("rd3t-leaf-node");
    const nodeArr: Array<Element> = Array.from(leafNodeArr).concat(Array.from(document.getElementsByClassName("rd3t-node")));
    
    Array.from(nodeArr).forEach((v: Element) => {
      const child: Element = v.lastChild?.firstChild as Element;
      attributes[child.innerHTML.toLowerCase()].id = v.id;
    });
  });

  const getDynamicPathClass = (treeLink : TreeLinkDatum) => {
    if (!treeLink.target.children) {
      // Target node has no children -> this link leads to a leaf node.
      return 'link__to-leaf';
    }

    // Style it as a link connecting two branch nodes by default.
    return 'link__to-branch';
  };

  const separateData = (obj: node) => {
    obj.attributes ? attributes[obj.name] = obj.attributes : {}
    obj.attributes = undefined;
    
    if(obj.children === undefined) return

    obj.children.forEach((v) => {separateData(v)});
  }

  const onSubmit = (e: React.FormEvent) => {
    setTreeData(<div className="initial-message">Loading...</div>);
    const path: string = inputPath.current !== null ? inputPath.current.value : "inputPath.current is null"
    e.preventDefault();

    fetch('./api/data', {
      method: 'POST',
      body: JSON.stringify({path: path}),
      headers:{'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((json) => {
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
        />
      );
    })
    .then(() => {delete attributes["Pages"]})
    .catch((err) => console.log(err))
  }
  
  // on intial load, fetch tree for default project
  // TODO: this is basically a copy/paste of the onSubmit right now. refactor onSubmit/this function
  const fetchProjectOnLoad = () => {
    console.log("Initial fetch");

    fetch('./api/data', {
      method: 'POST',
      body: JSON.stringify({path: 'undefined'}),
      headers:{'Content-Type': 'application/json'}
    })
    .then((response) => response.json())
    .then((json) => {
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
        />
      );
    })
    .then(() => {delete attributes["Pages"]})
    .catch((err) => console.log(err))
  }

  useEffect(fetchProjectOnLoad, [])

  return (
    <>
      <div ref={treeContainerRef} style={{ height: '100vh', overflow: "hidden" }}>
        <div className='has-text-centered m-6'>
          <Image src='/logo.png' alt='logo' width={"100"} height={"100"} />
          <div className = 'underline'></div>
        </div>
        <div className = 'inputArea'>
          <SearchBar atts={attributes}/>
          <form onSubmit={onSubmit}>
            <input className = 'input is-small is-rounded' placeholder="Routes Filepath..." ref={inputPath}></input>
            <button className = 'button is-small is-rounded is-outlined is-hovered submitbtn ml-1' type='submit'>Submit</button>
          </form>
        </div>

        <div className="info-panel">
          <InfoPanel att = {currentAttribute}/>
        </div>
        {treeData}
      </div>
    </>
  )
}
