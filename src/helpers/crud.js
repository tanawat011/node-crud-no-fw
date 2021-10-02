const { rootDatabase } = require('../constants')
const errorUtils = require('./error')
const { readFile, writeFile } = require('../libs/fileSystem')
const { uuid } = require('../libs/uuid')

const resultSuccess = (payload) => ({ code: 200, message: 'success', data: payload })
const resultNotFound = (payload) => ({ code: 404, message: 'not_found', ...payload && { data: payload } })

const _find = async (fileName, filters = {}, isStrict = false) => {
  const filePath = `${rootDatabase}/${fileName}.json`

  const result = new Promise((resolve, reject) => {
    readFile(filePath, (err, data) => {
      if (err) {
        errorUtils.errorHandler(err, reject)

        return
      }

      if (data) {
        let dataParsed = JSON.parse(data)

        Object.entries(filters).forEach(([key, val]) => {
          dataParsed = dataParsed.filter(f => {
            const keySplit = key.split('_')

            if (keySplit.length > 1) {
              const [filterType, realKey] = keySplit

              if (filterType === 'like') {
                if (isStrict) {
                  return f[realKey].toLowerCase().includes(val.toLowerCase())
                }

                return f[realKey].includes(val)
              }
            }

            return f[key] === val
          })
        })

        if (!dataParsed || !dataParsed.length) {
          resolve(resultNotFound([]))
        }

        resolve(resultSuccess(dataParsed))

        return
      }

      resolve(resultNotFound([]))
    })
  })

  return result
}

const _create = async (fileName, payload) => {
  const filePath = `${rootDatabase}/${fileName}.json`

  payload = {
    id: uuid(),
    ...payload,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: new Date(),
  }

  const result = new Promise((resolve, reject) => {
    const errorReject = (err) => errorUtils.errorHandler(err, reject)

    readFile(filePath, (err, oldData) => {
      if (err || !oldData) {
        const data = [payload]
        writeFile(filePath, data, errorReject)
        resolve(resultSuccess(payload))

        return
      }

      oldData = JSON.parse(oldData)
      oldData.push(payload)
      writeFile(filePath, oldData, errorReject)
      resolve(resultSuccess(payload))
    })
  })

  return result
}

const _update = async (fileName, id, payload) => {
  const filePath = `${rootDatabase}/${fileName}.json`

  const result = new Promise((resolve, reject) => {
    const errorReject = (err) => errorUtils.errorHandler(err, reject)

    readFile(filePath, (err, oldData) => {
      if (err) {
        errorReject(err, reject)

        return
      }

      if (!oldData) {
        resolve(resultNotFound())

        return
      }

      oldData = JSON.parse(oldData)
      let dataFound = oldData.find(f => f.id === id)

      if (!dataFound) {
        resolve(resultNotFound())

        return
      }

      dataFound.updatedAt = new Date()
      Object.entries(payload).forEach(([key, val]) => {
        dataFound[key] = val
      })

      oldData[oldData.findIndex(f => f.id === id)] = dataFound
      writeFile(filePath, oldData, errorReject)
      resolve(resultSuccess(dataFound))
    })
  })

  return result
}

const _delete = async (fileName, id) => {
  const filePath = `${rootDatabase}/${fileName}.json`

  const result = new Promise((resolve, reject) => {
    const errorReject = (err) => errorUtils.errorHandler(err, reject)

    readFile(filePath, (err, oldData) => {
      if (err) {
        errorReject(err, reject)

        return
      }

      if (!oldData) {
        resolve(resultNotFound())

        return
      }

      oldData = JSON.parse(oldData)
      let dataFound = oldData.find(f => f.id === id)

      if (!dataFound) {
        resolve(resultNotFound())

        return
      }

      oldData.splice(oldData.findIndex(f => f.id === id), 1)

      writeFile(filePath, oldData, errorReject)
      resolve(resultSuccess(undefined))
    })
  })

  return result
}

module.exports = {
  _find,
  _create,
  _update,
  _delete,
}
