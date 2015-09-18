module.exports = GifManager

var execSync = require("child_process").execSync
// var DOWNLOAD_DIR = 'images'

function GifManager(options) {
  console.log("starting gif manager")
  if (!(this instanceof GifManager)) return new GifManager(options)
  this.imageDir = options.imageDir || 'images/'
}  

GifManager.prototype.takePicture = function (fileName) {
  // var takePicture = "raspistill -w 200 -h 200 -t 1000 -o -"
  var takePicture = "raspistill -w 200 -h 200 -t 1000 -o "
  console.log("taking picture", fileName)
  execSync(takePicture + this.imageDir + fileName)
  // console.log("taking picture 2")
  // execSync(takePicture + this.imageDir + "/test2.jpg")
  // console.log("taking picture 3")
  // execSync(takePicture + this.imageDir + "/test3.jpg")
} 

GifManager.prototype.generateGif = function (gifName) {
  console.log("converting pics to gif")
  var gifURL = execSync(pwd) + '/' + this.imageDir + gifName
  var convertToGif = 'convert -delay 60 -loop 0 ' + this.imageDir + '*.jpg ' + gifURL
  console.log("convert to gif command:", convertToGif)
  execSync(convertToGif)
  console.log("gif URL is", gifURL)
  return gifURL
}

