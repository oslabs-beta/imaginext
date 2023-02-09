[![Logo](public/logo.png)](Logo)
# 

This is a Next.js visualization tool that helps developers understand the structure of their Next.js app by displaying its file and folder hierarchy. The tool uses d3.js to create a tree-like structure that represents the app's file and folder organization, making it easy to navigate and understand the app's architecture.

## Features
#
* Display the folder structure of a Next.js app in a tree-like format
* Show the file names and their extensions
* Display each page's data rendering method (SSR, SSG, etc.)
* Ability to expand and collapse folders to view their contents
* Easy navigation through the folder structure using mouse click events

## Installation
#
Install the npm package to your local Next.js project with this command:
```
npm i imaginext --save-dev
```
npm page: https://www.npmjs.com/package/imaginext

## Usage
#
To use the visualization tool, navigate to the project root directory in your terminal and run the following command:

```bash
npx imaginext
```

This will start a local development server, and you can access the visualization tool by visiting [http://localhost:3333](http://localhost:3333) in your browser. The tool will then automatically extract the file and folder structure of your app and display it in the visualization.

Use the hotkeys **Ctrl+C** to stop the local server.

## Viewing other projects
#
Once the localhost:3333 page is running, you can also submit another Next.js project path into the form to visualize another project. Of course you may also install the npm package into any other project as well.

## Limitations
#
The tool is currently limited to displaying the file and folder structure of Next.js apps that use the Pages directory. Future updates may add support for Next.js apps using the App directory, as well as other types of frameworks like React.

## Contributing
#
This visualization tool is open source and contributions are welcome! If you would like to contribute, please create a pull request with your changes and include a brief description of the changes made.