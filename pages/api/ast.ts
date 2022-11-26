import type { NextApiRequest, NextApiResponse } from 'next'
import { parse } from '@typescript-eslint/typescript-estree';
import path from 'path';
import fs from 'fs';


type Data = {
  data: object
}

const sourcePath = path.join(process.cwd(), "/pages/api/hello.ts")
const source = fs.readFileSync(sourcePath, "utf8")

const ast = parse(source, {
  jsx: true,
});

console.log(ast)


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
) {
  res.status(200).json({data: ast})
}
