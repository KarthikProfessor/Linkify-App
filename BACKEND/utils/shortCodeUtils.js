const { nanoid } = require('nanoid')

function generateShortCode() {
  
  const code = nanoid(7)
  return code
}

module.exports = generateShortCode