/**
 * Thanks for code idea from repo https://github.com/pillarjs/path-to-regexp
 */

const escapeString = (str) => {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, '\\$1')
}

const match = (str) => {
  const keys = []
  const re = pathToRegexp(str, keys)

  return regexpToFunction(re, keys)
}

const pathToRegexp = (path, keys) => {
  return stringToRegexp(path, keys)
}

const stringToRegexp = (path, keys) => {
  return tokensToRegexp(parse(path), keys)
}

const regexpToFunction = (re, keys) => {
  const decode = (x) => x

  return (pathname) => {
    const m = re.exec(pathname)

    if (!m) return false

    const { 0: path, index } = m
    const params = Object.create(null)

    for (let i = 1; i < m.length; i++) {
      if (m[i] === undefined) continue

      const key = keys[i - 1]

      if (key.modifier === '*' || key.modifier === '+') {
        params[key.name] = m[i].split(key.prefix + key.suffix).map(value => {
          return decode(value, key)
        })
      } else {
        params[key.name] = decode(m[i], key)
      }
    }

    return { path, index, params }
  }
}

const lexer = (str) => {
  const tokens = []
  let i = 0

  while (i < str.length) {
    const char = str[i]

    if (char === ':') {
      let name = ''
      let j = i + 1

      while (j < str.length) {
        const code = str.charCodeAt(j)

        if (
          // `0-9`
          (code >= 48 && code <= 57) ||
          // `A-Z`
          (code >= 65 && code <= 90) ||
          // `a-z`
          (code >= 97 && code <= 122) ||
          // `_`
          code === 95
        ) {
          name += str[j++]

          continue
        }

        break
      }

      tokens.push({ type: 'NAME', index: i, value: name })
      i = j
      continue
    }

    tokens.push({ type: 'CHAR', index: i, value: str[i++] })
  }

  tokens.push({ type: 'END', index: i, value: '' })

  return tokens
}

const parse = (str) => {
  const tokens = lexer(str)
  const prefixes = './'
  const defaultPattern = `[^${escapeString('/#?')}]+?`
  const result = []
  let key = 0
  let i = 0
  let path = ''

  const tryConsume = (type) => {
    if (i < tokens.length && tokens[i].type === type) return tokens[i++].value
  }

  const mustConsume = (type) => {
    const value = tryConsume(type)
    if (value !== undefined) return value
    const { type: nextType, index } = tokens[i]
    throw new TypeError(`Unexpected ${nextType} at ${index}, expected ${type}`)
  }

  const consumeText = () => {
    let result = ''
    let value
    while ((value = tryConsume('CHAR') || tryConsume('ESCAPED_CHAR'))) {
      result += value
    }
    return result
  }

  while (i < tokens.length) {
    const char = tryConsume('CHAR')
    const name = tryConsume('NAME')
    const pattern = tryConsume('PATTERN')

    if (name || pattern) {
      let prefix = char || ''

      if (prefixes.indexOf(prefix) === -1) {
        path += prefix
        prefix = ''
      }

      if (path) {
        result.push(path)
        path = ''
      }

      result.push({
        name: name || key++,
        prefix,
        suffix: '',
        pattern: pattern || defaultPattern,
        modifier: tryConsume('MODIFIER') || ''
      })
      continue
    }

    const value = char || tryConsume('ESCAPED_CHAR')
    if (value) {
      path += value
      continue
    }

    if (path) {
      result.push(path)
      path = ''
    }

    const open = tryConsume('OPEN')
    if (open) {
      const prefix = consumeText()
      const name = tryConsume('NAME') || ''
      const pattern = tryConsume('PATTERN') || ''
      const suffix = consumeText()

      mustConsume('CLOSE')

      result.push({
        name: name || (pattern ? key++ : ''),
        pattern: name && !pattern ? defaultPattern : pattern,
        prefix,
        suffix,
        modifier: tryConsume('MODIFIER') || ''
      })
      continue
    }

    mustConsume('END')
  }

  return result
}

const tokensToRegexp = (tokens, keys) => {
  let route = '^'

  for (const token of tokens) {
    if (typeof token === 'string') {
      route += escapeString(token)
    } else {
      const prefix = escapeString(token.prefix)
      const suffix = escapeString(token.suffix)

      if (token.pattern) {
        if (keys) keys.push(token)

        if (prefix || suffix) {
          if (token.modifier === '+' || token.modifier === '*') {
            const mod = token.modifier === '*' ? '?' : ''
            route += `(?:${prefix}((?:${token.pattern})(?:${suffix}${prefix}(?:${token.pattern}))*)${suffix})${mod}`
          } else {
            route += `(?:${prefix}(${token.pattern})${suffix})${token.modifier}`
          }
        } else {
          route += `(${token.pattern})${token.modifier}`
        }
      } else {
        route += `(?:${prefix}${suffix})${token.modifier}`
      }
    }
  }

  route += `[${escapeString('/#?')}]?$`

  return new RegExp(route, 'i')
}

module.exports = {
  parse,
  match,
  regexpToFunction,
  tokensToRegexp,
  pathToRegexp,
}
