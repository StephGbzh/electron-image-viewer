import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

// extract the image file path from the arguments
// ----------------------------------------------
const electron = window.require('electron');
var args =  electron.remote.process.argv
// first two args are the path to electron itself + "."
args.shift()
args.shift()
// build a string from the array of remaining args and parse the resulting JSON
var argsString = JSON.parse(args.join(' '))
var imagePath = argsString.remain[0].replace(/^echo /,"")
var imageUrl = "file://"+imagePath
//console.log(imageUrl)

// 
//
var folderPath = imagePath.replace(/\/[^/]+$/, "")
const fs = electron.remote.require('fs');
// https://nodejs.org/api/fs.html#fs_fs_readdirsync_path_options
var fileNames = fs.readdirSync(folderPath)
var imageFileNames = fileNames.filter(function(fileName) {
  return fileName.endsWith(".jpg")
})
console.log(imageFileNames)


// TODO open on screen where the cursor is https://electron.atom.io/docs/api/screen/
// => getCursorScreenPoint + getDisplayNearestPoint
// or maybe remember the last screen where it was opened ?
var screenElectron = electron.screen;
var secondScreen = screenElectron.getAllDisplays()[1];

//console.log(secondScreen.bounds.width, secondScreen.bounds.height); 

// <div className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h2>Welcome to React</h2>
//         </div>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>





class App extends Component {
  state = {imageIndex:0};
  handleKeyPress = (event) => {
    // 33 page up  34 page down
    //console.log(event.keyCode)
    if (event.keyCode === 33){
      this.setState((prevState) => ({
        imageIndex: prevState.imageIndex === 0 ? imageFileNames.length -1 : prevState.imageIndex -1
      }))
    } else if (event.keyCode === 34){
      this.setState((prevState) => ({
        imageIndex: prevState.imageIndex === imageFileNames.length -1 ? 0 : prevState.imageIndex +1
      }))
    }
  }
  
  // to avoid a few pixels to be added at the bottom of the page (3 or 4), we have to say that the img is not text
  // two solutions: "display":"block" or "vertical-align":"middle" (or top or bottom)
  // https://stackoverflow.com/questions/6540163/a-few-extra-pixels-of-height-where-could-they-be-coming-from

  // to be able to have a key down recognized, we have to add tabIndex=0 on elements which are not links or forms
  // https://stackoverflow.com/a/32445016

  // to avoid having a border on the selected element, add style  "outline": "none"
  // https://stackoverflow.com/questions/3015523/remove-or-disable-focus-border-of-browser-via-javascript

  render() {
    return (
      <div className="App"
        style={{
          "height": secondScreen.bounds.height,
          "width": secondScreen.bounds.width,
          "outline": "none",
          "display":"flex",
          "align-items":"center",
          "justify-content":"center"
        }}
        tabIndex="0"
        onKeyDown={this.handleKeyPress}>
        <img className="MainImage"
          style={{
            "maxHeight": secondScreen.bounds.height,
            "maxWidth": secondScreen.bounds.width,
            "verticalAlign": "middle"
          }}
          src={"file://" + folderPath + "/" + imageFileNames[this.state.imageIndex]}
          alt="Current pic here" />
      </div>
    );
  }
}

export default App;
