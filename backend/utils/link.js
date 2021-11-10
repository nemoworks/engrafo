const { outgoing, context, account, db, FStemplates } = require("../database");

const basicTypes = ['string', 'number', 'integer', 'boolean', 'null']
const arrayType = 'array'
const objectType = 'object'
const traverse = (schema, links, path = []) => {
  if (schema.hasOwnProperty('link')) {
    const linkType = schema.link.substring(2, schema.link.length - 1)
    links.push({ title: linkType, path })
  } else {
    if (schema.hasOwnProperty('type')) {
      const type = schema.type
      const findType = basicTypes.find(e => e === type)
      if (findType !== undefined) {
      } else if (type === objectType) {
        const properties = schema.properties
        for (const p in properties) {
          traverse(properties[p], links, [...path, 'properties', p])
        }
      } else if (type === arrayType) {
        traverse(schema.items, links, [...path, 'items'])
      }
    }
  }
}

const findPosition = (schema, path, index,newSchema) => {
  // console.log(schema, path, index,newSchema)
  if (index !== path.length - 1){
    findPosition(schema[path[index]],path,++index,newSchema)
  }else{
    schema[path[index]]=newSchema
  }
  
}

module.exports = {
  traverse,
  findPosition
}