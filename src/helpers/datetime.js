const diffTimestamp = (start, end = new Date().getTime()) => {
  return end - start
}

module.exports = {
  diffTimestamp,
}
