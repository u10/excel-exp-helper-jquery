import keywords from './keywords'

const classNames: { [key: string]: { test: (str: string) => boolean } } = {
  operator: /^[\+\-*\/<>=]$/i,
  num: /^\d*\.?\d+$/i,
  keyword: {
    test: function(str: string) {
      return keywords.indexOf(str.toUpperCase()) !== -1
    }
  },
  cell: /^\$?\w{1,2}\$?\d+$/i,
  ref: /^.+!$/i,
  str: /^".*"$/i,
  other: /.*/
}

function space (n: number) {
  let s = ''
  for (let i = 0; i < n; i++) {
    s += ' '
  }
  return s
}

function parseCode (code: string) {
  var arr, c, j, len, skip, word
  arr = []
  word = ''
  skip = false
  for (j = 0, len = code.length; j < len; j++) {
    c = code[j]
    switch (c) {
      case '"':
        skip = !skip
        if (!skip) {
          word = '"' + word + '"'
        }
        if (word !== '') {
          arr.push(word)
        }
        word = ''
        break
      case '(':
      case ')':
      case ',':
      case ';':
      case ' ':
      case '+':
      case '-':
      case '*':
      case '/':
      case '=':
      case '<':
      case '>':
      case ':':
      case '!':
        if (skip) {
          word += c
        } else {
          if (c === '!') {
            word += c
          }
          if (word !== '') {
            arr.push(word)
          }
          if (c !== ' ' && c !== '!') {
            arr.push(c)
          }
          word = ''
        }
        break
      default:
        word += c
    }
  }
  if (word) arr.push(word)
  return arr
}

function formatCode (code: string, styled = true) {
  var arr, deep, el, j, len, name, pattern, ret, t
  if (styled == null) {
    styled = true
  }
  arr = parseCode(code)
  ret = ''
  deep = 0
  for (j = 0, len = arr.length; j < len; j++) {
    t = arr[j]
    t = t.trim().replace(/^;$/, ',')
    el = t
    if (styled) {
      for (name in classNames) {
        pattern = classNames[name]
        if (!(pattern.test(t))) {
          continue
        }
        el = "<span class='" + name + "'>" + t + "</span>"
        break
      }
    }
    if (t === ')') {
      deep--
      if (styled) {
        ret += "\n" + (space(deep * 2)) + "</pre>"
      } else {
        ret += "\n" + (space(deep * 2))
      }
    }
    ret += el
    if (t === ';' || t === ',') {
      ret += '\n' + space(deep * 2)
    }
    if (t === '(') {
      deep++
      if (styled) {
        ret += "<span class='folder'>...</span><pre style='display: inline'> \n" + (space(deep * 2))
      } else {
        ret += "\n" + (space(deep * 2))
      }
    }
  }
  return ret
}

export {
  formatCode
}
