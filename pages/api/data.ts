// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import {newObj, Data } from '../../public/types';
import path from 'path';
import runParser from '../../lib/parser';

// todo: add support to input a link or drag and drop.
// process.cwd -> goes to the root of this project
// TODO: currently this only works assuming pages directory is not nested. need to refactor to account for nested directories
const currentProjectPath = path.resolve(process.cwd() + '/../../pages');
// const otherPath = '/Users/richter/Downloads/playground/my-app/pages'; // put in some other path to check

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data> // setting the type from line 8
  ) {
    
  console.log('currentProjectPath: ', currentProjectPath)

  function traverseDir(dir:string) {
    const validFileType:Array<string> = ['.ts', '.tsx', '.js', 'jsx'];
    const arr:object[] = [];
    fs.readdirSync(dir).forEach((file : string) => {
      const fullPath = path.join(dir, file);

      // validate if file type is valid or if it's a folder
      if (validFileType.includes(path.extname(file)) || fs.lstatSync(fullPath).isDirectory()) {
        const obj:newObj = {
          name: file,
          attributes: {
            id: '',
            path: fullPath,
            dataRenderMethod: '',
            fetchURL: '',
            props: {}
          },
          children: undefined
        }
        if (fs.lstatSync(fullPath).isDirectory()) {
          obj.children = traverseDir(fullPath);
        } else {
          // run parser to get node attributes
          console.log('data.ts invoking runParser on path: ', fullPath)
          const data = runParser(fullPath);
          // console.log('runParser data: ', data)
          obj.attributes.dataRenderMethod = data.dataRenderMethod;
          obj.attributes.fetchURL = data.fetchURL;
          obj.attributes.props = data.props;
          // console.log('obj.attributes.props: ', obj.attributes.props)
        }
        arr.push(obj)
      } 

    });
    // console.log('parsed node attributes being sent to frontend',arr)
    return arr
  }

  // function findPagesDir(dir:string) {
  //   fs.access(dir, function(error) {
  //     if (error) {
  //       console.log('pages directory ')
  //     }
  //   })
  // }

  if (req.method === 'POST') {
    let path;
    if (req.body.path === 'undefined') {
      path = currentProjectPath;
    } else {
      path = req.body.path.replace(/\\/g, '/');
    }
    const lastPathItem = path.substring(path.lastIndexOf('/') + 1);

    // if input path is it's root. get into the pages directory and travese it instead.
    if (lastPathItem.toLowerCase() !== 'pages') {
      if (fs.existsSync(path)) {
        res.status(200).json({ name: 'Pages', children: traverseDir(path + '/pages')})
      }
      // TODO: add functionality if pages directory is nested. currently just sending an error.
      else {
        res.status(400).send({ name: 'error: invalid data', children: undefined});
      }

    } else {
      res.status(200).json({ name: 'Pages', children: traverseDir(path)})
    }
    
  } else {
    // change the argument in traverseDir
    res.status(200).json({ name: 'Pages', children: traverseDir(currentProjectPath)})
  }

}
