// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path';
import fs from 'fs';

// todo: add support to input a link or drag and drop.
// process.cwd -> goes to the root of this project
const currentProjectPath = path.join(process.cwd(), 'pages');
const otherPath = '/Users/richter/Downloads/playground/my-app/pages'; // put in some other path to check

type Data = {
  name: string
  children: object[]
}

interface newObj {
  name: string
  attributes: {}
  children: undefined|object[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
) {

  function traverseDir(dir:string) {
    const arr:object[] = [];
    fs.readdirSync(dir).forEach((file : string) => {
      const fullPath = path.join(dir, file);
      const obj:newObj = {
        name: file,
        attributes: {path: fullPath},
        children: []
      }
      if (fs.lstatSync(fullPath).isDirectory()) {
        obj.children = traverseDir(fullPath);
      } 
      arr.push(obj)
    });
    console.log('test',arr)
    return arr
  }

  // change the argument in traverseDir
  res.status(200).json({ name: 'Pages', children: traverseDir(currentProjectPath)})
}
