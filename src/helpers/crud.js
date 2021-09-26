const errorUtils = require('./error')
const { readFile, writeFile } = require('../libs/fileSystem')

const create = async (fileName, payload) => {
  const filePath = `database/${fileName}.json`

  const result = new Promise((resolve, reject) => {
    const errorReject = (err) => errorUtils.errorHandler(err, reject)

    readFile(filePath, (err, oldData) => {
      if (err) {
        const data = [payload]
        writeFile(filePath, data, errorReject)
        resolve(payload)

        return
      }

      oldData = JSON.parse(oldData)
      oldData.push(payload)
      json = JSON.stringify(oldData)
      writeFile(filePath, oldData, errorReject)
      resolve(payload)
    })
  })

  return result
}

module.exports = {
  create,
}
