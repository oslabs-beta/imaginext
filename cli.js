#!/usr/bin/env node
"use strict";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process').exec;

console.log("Launching imagiNEXT on port 3333...To view, go to http://localhost:3333. To stop server, use CTRL + C");

exec('PORT=3333 npm --prefix ./node_modules/imaginext run dev', (err) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
})