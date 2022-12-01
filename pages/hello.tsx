import React, { useState, useEffect, useRef } from 'react'

export default function Hello() {
    const [data, setData] = useState(null)
    const inputPath = useRef<null | HTMLInputElement>(null);

    // const testClick = () => {
    //     //get
    //     fetch('http://localhost:3000/api/hello')
    //       .then((response) => response.json())
    //       .then((json) => {
    //         setData(json)
    //       })
    
    //     //async await
    //     //   const res = await fetch(`http://localhost:3000/api/hello`)
    //     //   const data = await res.json()
    //     // console.log(data)
    //   }

    //   console.log(data)

    const onSubmit = (e: React.FormEvent) => {
        const path = inputPath.current.value;
        e.preventDefault();
        //post 
        fetch('http://localhost:3000/api/hello', {
            method: 'POST',
            body: JSON.stringify({path: path}),
            headers:{'Content-Type': 'application/json'}
        })
        .then((response) => response.json())
        .then((json) => {console.log(json)})
        .catch((err) => console.log(err))
    }

    return (
        <div>
            <h3>/Users/richter/Downloads/playground/floppy-osp/pages</h3>
            {/* <button onClick={testClick}>Test</button> */}

            <form onSubmit={onSubmit}>
                <input ref={inputPath}></input>

                <button type='submit'>Submit</button>
            </form>
        </div>
    )
}