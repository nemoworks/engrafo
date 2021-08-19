const _ = require('lodash')
const jsf =require( 'json-schema-faker')
const delimiter = '#'
const keys =  [
    "manager",
    "engineer",
    "status",
    "feedback"
]


const obj2keys = (source) => {
    let res = []
    const flat = (obj, stack) => {
        Object.keys(obj).forEach(k => {
            let s = stack.concat([k])
            let v = obj[k]
            if (typeof v === 'object') flat(v, s)
            else res.push(s.join(delimiter))
        })
    }
    flat(source, [])
    return res
}

const schema2entry = (schema) => obj2keys(jsf.generate(schema))

const keys2disabled = (keys) => {
    let res = {}
    keys.forEach(k => {
        if (k.split('#').length === 1) res[k] = { "ui:disabled": true }
        else {
            let karr = k.split('#')
            let v = { "ui:disabled": true }
            while (karr.length !== 1) {
                let tmpk = karr.pop()
                let nv = {}
                nv[tmpk] = v
                v = nv
            }
            let rtk = karr.pop()
            res[rtk] = res[rtk] ? { ...res[rtk], ...v } : v
        }
    })
    return res
}

const uischema = {
    "feedback":{
        "ui:widget": "textarea"
    }
}

console.log(_.merge(keys2disabled(keys),uischema))