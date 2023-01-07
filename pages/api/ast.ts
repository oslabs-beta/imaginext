import type { NextApiRequest, NextApiResponse } from 'next'
import runParser from '../../lib/parser'

// this endpoint is for testing only. import runParser and use function instead
type Data = {
  data: object
}

// hard-coded path for testing only
// const sourcePath = path.join(process.cwd(), "/pages/api/hello.ts")
const sourcePath = '/Users/bapplemac16/Documents/codingProjectsPractice/nextJS/nextjs-blog/pages/about.js';
console.log('sourcePath: ', sourcePath)

const ast = runParser(sourcePath)


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
) {
  res.status(200).json({data: ast})
}
