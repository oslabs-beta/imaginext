// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const path = require('path');
const fs = require('fs');

// todo: add support to input a link or drag and drop.
// process.cwd -> goes to the root of this project
const currentProjectPath = path.join(process.cwd(), 'pages');
const otherPath = '/Users/richter/Downloads/playground/my-app/pages'; // put in some other path to check

type Data = {
  pages: object[]
}

interface newObj {
  name: string
  path: string
  folder: object[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
) {

  function traverseDir(dir:string) {
    const arr:object[] = [];
    fs.readdirSync(dir).forEach((file : string) => {
      let fullPath = path.join(dir, file);
      const obj:newObj = {
        name: file,
        path: fullPath,
        folder: []
      }
      if (fs.lstatSync(fullPath).isDirectory()) {
        obj.folder = traverseDir(fullPath);
      } 
      arr.push(obj)
    });
    return arr
  }

  // change the argument in traverseDir
  res.status(200).json({ pages: traverseDir(currentProjectPath)})
}
