import type { NextApiRequest, NextApiResponse } from 'next'
import { parse } from '@typescript-eslint/typescript-estree';
import path from 'path';
import fs from 'fs';
import TestParse from '../../lib/parser'

type Data = {
  data: object
}

const sourcePath = '/Users/bapplemac16/Documents/codingProjectsPractice/nextJS/commerce/site/pages/404.tsx'
// // const sourcePath = path.join(process.cwd(), "/pages/api/hello.ts")
// console.log('sourcePath: ', sourcePath)

const ast = TestParse(sourcePath)

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
) {
  res.status(200).json({data: ast})
}
