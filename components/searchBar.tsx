import {useState, useEffect} from 'react';
import { attributes } from '../public/types';

export default function SearchBar(props: {atts: attributes} ) {
  const [input, setInput] = useState('');

  const findNode = (data: attributes): void => {
    for(const key in data) {
      document.getElementById(data[key].id)?.classList.remove('activeNode');
    }

    if(data[input] !== undefined) {
      // add className to that node
      document.getElementById(data[input].id)?.classList.add('activeNode');
    }
  }

  useEffect(() => {
    findNode(props.atts);
  });

  
  return (
    <>
      <div>
        <input className='input' placeholder="Search..." onChange={(event: React.FormEvent<HTMLInputElement>): void => {setInput(event.currentTarget.value); console.log(input);}}/>
      </div>
    </>
  )    
}