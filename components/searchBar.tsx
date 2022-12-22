import {useState, useEffect} from 'react';
import { node } from '../public/types';

export default function SearchBar(props: node ) {
  const [input, setInput] = useState('');

  const findNode = (data: node): void => {
      // Search for node
    if(data.name === input) {
      // add className to that node
    } else {
      // remove className to that node
    }

    if(data.children !== undefined) {
      for(let i = 0; i < data.children.length; i++) {
        findNode(data.children[i]);
      }
    }
  }

  useEffect(() => {
    findNode(props);
  });

  
  return (
    <>
      <div>
        <input placeholder="Search..." onChange={(event: Event): void => {setInput(event.target.value); console.log(input);}}/>
      </div>
    </>
  )    
}