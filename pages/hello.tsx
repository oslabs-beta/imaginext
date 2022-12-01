import { useState, useEffect } from 'react'

export default function Hello() {
<<<<<<< HEAD
  return (
    <h1>Demo!</h1>
  )
}

// test
=======
    const [data, setData] = useState(null)

    const testClick = () => {
        fetch('http://localhost:3000/api/hello')
          .then((response) => response.json())
          .then((json) => {
            setData(json)
          })
    
        //   const res = await fetch(`http://localhost:3000/api/hello`)
        //   const data = await res.json()
        // console.log(data)
      }

      console.log(data)

    return (
        <div>
            <button onClick={testClick}>Test</button>
        </div>
    )
}
>>>>>>> cbeff8dc6c940a0ed9189943e2dae2835dee8fbe
