const fs = require('fs')

const readFile = (filePath, callback, jsonFileType = 'utf8') => {
  fs.readFile(filePath, jsonFileType, callback)
}

const writeFile = (filePath, data, callback, jsonFileType = 'utf8') => {
  fs.writeFile(filePath, JSON.stringify(data), jsonFileType, callback)
}

module.exports = {
  readFile,
  writeFile,
}
