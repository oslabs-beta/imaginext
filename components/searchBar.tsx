import {useState, useEffect} from 'react';
import { node, attributes } from '../public/types';

export default function SearchBar(props: attributes ) {
  const [input, setInput] = useState('');

  const findNode = (data: attributes): void => {
    for(const key in data) {
      document.getElementById(data[key].id)?.classList.remove('activeNode');
    }

    if(data[input] !== undefined) {
      // add className to that node
      document.getElementById(data[input].id)?.classList.add('activeNode');
    }

    if(data.children !== undefined) {
      for(let i = 0; i < data.children.length; i++) {
        findNode(data.children[i]);
      }
    }
  }

  useEffect(() => {
    findNode(props.atts);
  });

  
  return (
    <>
      <div>
        <input placeholder="Search..." onChange={(event: Event): void => {setInput(event.target.value); console.log(input);}}/>
      </div>
    </>
  )    
}