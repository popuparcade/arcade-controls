module.exports = GifManager

var execSync = require("child_process").execSync

function GifManager(options) {
  console.log("starting gif manager")
  if (!(this instanceof GifManager)) return new GifManager(options)
  if (!options)
    options = {}
  this.imageDir = options.imageDir || 'images/'
}

GifManager.prototype.takePicture = function (fileName) {
  var takePicture = "raspistill -w 200 -h 200 -t 1000 -o "
  console.log("taking picture", fileName)
  execSync(takePicture + this.imageDir + fileName)
}

GifManager.prototype.generateGif = function (gifName) {
  console.log("converting pics to gif")
  // var gifURL = process.cwd() + '/' + this.imageDir + gifName
  var gifURL = this.imageDir + gifName
  var convertToGif = 'convert -delay 60 -loop 0 ' + this.imageDir + '*.jpg ' + gifURL
  execSync(convertToGif)
  console.log("gif URL is", gifURL)
  return gifURL
}
