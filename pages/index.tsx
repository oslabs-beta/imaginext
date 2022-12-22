import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import InfoPanel from '../components/infoPanel';
import { attribute, attributes, inputData } from '../public/types';

const attributes: attributes = {
  pages: {
    path: "test",
    dataRenderMethod: 'test'
  }
};

export default function Home() {
  const [data, setData] = useState(null)
  const inputPath = useRef<null | HTMLInputElement>(null);

  const shouldRecenterTreeRef = useRef(true);
  const [treeTranslate, setTreeTranslate] = useState({ x: 0, y: 0 });
  const treeContainerRef = useRef<HTMLInputElement>(null);

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
  }, []);

  useEffect(() => {
    const leafNodeArr = document.getElementsByClassName("rd3t-leaf-node");
    const nodeObj = document.getElementsByClassName("rd3t-node");
    const arrayCallback = (v: HTMLElement) => {
      v.addEventListener("mouseover", (e: Event) => {
        let newObj: attribute = {};
        let name = "";

        if ((e.target as HTMLInputElement).tagName === "text") {
          name = (e.target as HTMLInputElement).innerHTML.toLowerCase();
        } else if (e.target.classList === "rd3t-label") {
          name = (e.target as HTMLInputElement).getElementsByTagName("text")[0].innerHTML.toLowerCase();
        } else if ((e.target as HTMLInputElement).tagName === "circle") {
          name = e.target.parentElement.getElementsByClassName("rd3t-label")[0].getElementsByTagName("text")[0].innerHTML.toLowerCase();
        }

        console.log("name", name);
        newObj = { ...attributes[name] };
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

    if (obj.children === undefined) return

    obj.children.forEach((v) => { separateData(v) });
  }

  const onSubmit = (e: React.FormEvent) => {
    const path = inputPath.current.value;
    e.preventDefault();
    //post 
    fetch('http://localhost:3000/api/data', {
      method: 'POST',
      body: JSON.stringify({ path: path }),
      headers: { 'Content-Type': 'application/json' }
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

        const leafNodeArr = document.getElementsByClassName("rd3t-leaf-node");
        const nodeObj = document.getElementsByClassName("rd3t-node");
        console.log(nodeObj);
        console.log(nodeObj.length);

        for (const key in nodeObj) {
          console.log(nodeObj);
          console.log("key", key);
          console.log("nodeObj[key]", nodeObj[key]);
          console.log("id", nodeObj[key].id);
          console.log("Keys", Object.keys(nodeObj));
        }
      })
      .catch((err) => console.log(err))
  }

  return (
    <>
      <div ref={treeContainerRef} style={{ height: '100vh', overflow: "hidden" }}>
        <h3>locate the PAGES folder of your next.js project in vscode</h3>
        <h3>right click it, COPY PATH and paste below</h3>
        <form onSubmit={onSubmit}>
          <input ref={inputPath}></input>
          <button type='submit'>Submit</button>
        </form>
        <div className="info-panel">
          <InfoPanel att={currentAttribute} />
        </div>
        {treeData}
      </div>
    </>
  )
}
