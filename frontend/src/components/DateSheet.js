import React from "react";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/styles";
import _, { set } from "lodash";
import Checkbox from '@mui/material/Checkbox';

const useStyles = makeStyles((theme) => ({
  button: {
    width: '100px',
    marginTop: '50'
  }
}))

const basicTypes = ['string', 'number', 'integer', 'boolean', 'null']
const arrayType = 'array'
const objectType = 'object'

const traverse = (path, title, schema, uiSchema, items, parent) => {
  if (schema.hasOwnProperty('type')) {
    const type = schema.type
    const findType = basicTypes.find(e => e === type)
    if (findType !== undefined) {
      const index = items.push({
        type: findType,
        uiSchema,
        path,
        title: schema.title ? schema.title : title,
        parent
      }) - 1
      if (parent > -1) items[parent].child.push(index)
    } else if (type === objectType) {
      const index = items.push({
        type: objectType,
        path,
        title: schema.title ? schema.title : title,
        child: [],
        parent
      }) - 1
      if (parent > -1) items[parent].child.push(index)
      const properties = schema.properties
      for (const p in properties) {
        var childUiSchema = null
        if (uiSchema) {
          childUiSchema = uiSchema.hasOwnProperty(p) ? uiSchema[p] : null
        }
        traverse(path + '->' + p, p, properties[p], childUiSchema, items, index)
      }
    } else if (type === arrayType) {
      const index = items.push({
        type: arrayType,
        title: schema.title ? schema.title : title,
        path,
        child: [],
        parent
      }) - 1
      if (parent > -1) items[parent].child.push(index)
      var childUiSchema = null
      if (uiSchema) {
        childUiSchema = uiSchema.hasOwnProperty('items') ? uiSchema['items'] : null
      }
      traverse(path + '->items', 'items', schema.items, childUiSchema, items, index)
    }
  }
}

// const isArrayDescendant = (curent, items) => {
//   if (curent === -1) {
//     return false
//   } else {
//     if (items[curent].type === arrayType) {
//       return true
//     } else if (items[curent].hasOwnProperty('arrayDescendant')) {
//       return items[curent].arrayDescendant
//     }
//   }
//   return isArrayDescendant(items[curent].parent, items)
// }

// const getRenderChild = (current, items, renderChild) => {
//   const { child } = items[current]
//   for (const c of child) {
//     const { type } = items[c]
//     const findType = basicTypes.find(e => e === type)
//     if (findType !== undefined) {
//       renderChild.push(c)
//     } else if (type === objectType) {
//       getRenderChild(c, items, renderChild)
//     } else if (type === arrayType) {
//       renderChild.push(c)
//     }
//   }
// }

// const map = (items, maps) => {
//   for (const i in items) {
//     items[i] = { ..._.cloneDeep(items[i]), isArrayDescendant: isArrayDescendant(items[i].parent, items) }
//     if (items[i].type === arrayType) {
//       const renderChild = []
//       getRenderChild(i, items, renderChild)
//       items[i] = { ..._.cloneDeep(items[i]), renderChild }
//     }
//   }
//   items.forEach((value, index) => {
//     if (value.hasOwnProperty('uiSchema')) {
//       const uiSchema = value.uiSchema
//       if (uiSchema) {
//         if (uiSchema.hasOwnProperty('ui:location')) {
//           const location = uiSchema['ui:location']
//           if (location) {
//             const { row, col } = location
//             if (row && col) {
//               maps.push({
//                 location: { row, col },
//                 index
//               })
//             }
//           }
//         }
//       }
//     }
//     const { type, isArrayDescendant } = value
//     if (!isArrayDescendant && type === arrayType) {
//       maps.push({
//         location: { row: 0, col: 0 },
//         index
//       })
//     }
//   })
// }

// const getMaxRowAndCol = (maps) => {
//   var row = 0, col = 0
//   for (const m of maps) {
//     if (m.location.row > row) row = m.location.row
//     if (m.location.col > col) col = m.location.col
//   }
//   return { row, col }
// }

// const createGrid = (maps, items) => {
//   const { row: maxRow, col: maxCol } = getMaxRowAndCol(maps)
//   const newGrid = []
//   for (var i = 0; i < maxRow; i++) {
//     newGrid[i] = []
//     for (var j = 0; j < maxCol; j++) {
//       newGrid[i][j] = { width: 100 }
//     }
//   }
//   for (const i in maps) {
//     const { location: { row, col }, index } = maps[i]
//     if (row > 0 && col > 0) {
//       newGrid[row - 1][col - 1] = { ...newGrid[row - 1][col - 1], ...maps[i], title: items[index].title, value: null, type: items[index].type }
//     } else {
//       const newRow = newGrid.push([{ width: 100, ...maps[i], title: items[index].title, value: null, type: items[index].type }])
//       maps[i] = { ...maps[i], location: { row: newRow, col: 1 } }
//       newGrid[newRow - 1][0] = { ...newGrid[newRow - 1][0], ...maps[i] }
//     }
//   }
//   return newGrid
// }

const validateType = (value, type) => {
  if (type === 'number' || type === 'integer') {
    if (value === '' || value == null) return false
    else {
      var num = Number(value)
      if (type === 'integer') {
        return { flag: Number.isInteger(num), value: num }
      } else {
        return { flag: !Number.isNaN(num), value: num }
      }
    }
  } else if (type === 'string') {
    return { flag: typeof (value) === 'string', value }
  } else if (type === 'null') {
    return { flag: true, value: null }
  } else if (type === 'boolean') {
    return { flag: typeof (value), value }
  }
}

// function customizer(objValue, srcValue) {
//   if (_.isObject(objValue) && _.isObject(srcValue) && !_.isArray(objValue) && !_.isArray(srcValue)) {
//     for (const key in srcValue) {
//       if (objValue.hasOwnProperty(key)) {
//         const res = { ..._.cloneDeep(objValue), ..._.cloneDeep(srcValue), [key]: _.mergeWith(_.cloneDeep(objValue[key]), _.cloneDeep(srcValue[key]), customizer) }
//         return res
//       }
//     }
//   } else if (_.isArray(objValue) && _.isArray(srcValue)) {
//     return objValue.concat(srcValue);
//   }
// }

// const getData = (items, grid) => {
//   var root = null
//   var temp = []
//   for (var i = 0; i < grid.length; i++) {
//     for (var j = 0; j < grid[i].length; j++) {
//       if (grid[i][j].hasOwnProperty('index')) {
//         var { index, value, type } = grid[i][j]
//         if (value || type === 'null' || type === 'boolean') {
//           const { flag, value: newValue } = validateType(value, type)
//           value = newValue
//           if (flag) {
//             var res = findPosiotn(index, items, value)
//             temp.push(res)
//             root = _.mergeWith(root, res, customizer)
//           }
//         }
//       }
//     }
//   }
//   return root
// }

// const findPosiotn = (index, items, value) => {
//   var res = value
//   var current = index
//   while (items[current].parent !== -1) {
//     const { parent, title } = items[current]
//     const { type: parentType } = items[parent]
//     if (parentType === objectType) {
//       res = { [title]: res }
//     } else if (parentType === arrayType) {
//       res = [_.cloneDeep(res)]
//     }
//     current = parent
//   }
//   return res
// }

// const findPosition = (paths, currentIndex, schema, value) => {
//   var res = null
//   if (schema.hasOwnProperty('type')) {
//     const { type } = schema
//     const findType = basicTypes.find(e => e === type)
//     if (findType !== undefined) {
//       res = value
//     } else if (type === objectType) {
//       const key = paths[currentIndex + 1]
//       res = { [key]: findPosition(paths, currentIndex + 1, schema.properties[key], value) }
//     } else if (type === arrayType) {

//     }
//   }
//   return res
// }

// const getData = (items, maps, grid, schema) => {
//   var root = null
//   for (const m of maps) {
//     const { location: { row, col }, index } = m
//     var { value } = grid[row - 1][col - 1]
//     const { type, path } = items[index]
//     if (value || type === 'null' || type === 'boolean') {
//       const { flag, value: newValue } = validateType(value, type)
//       value = newValue
//       if (flag) {
//         const paths = path.split('->')
//         const res = findPosition(paths, 0, schema, value)
//         root = _.merge(root, res)
//       }
//     }
//   }
//   return root
// }

function Check(props) {
  const { setStatus, checked, location } = props
  return (
    <Checkbox
      checked={checked}
      onChange={
        (event) => { setStatus({ value: event.target.checked, location }) }
      }
    ></Checkbox>
  )
}

// const createNewItems = (currentItemIndex, items,) => {
//   const res = []
//   for (const index of items[currentItemIndex].renderChild) {
//     const { title, type } = items[index]
//     var item = { width: 100, title, value: null, type, index }
//     if (type === 'boolean') {
//       item = {
//         ...item,
//         value: false,
//         component: null
//       }
//     } else if (type === arrayType) {
//       item = {
//         ...item,
//         component: null
//       }
//     }
//     res.push(item)
//   }
//   return res
// }

function AddButton(props) {
  const { path, setNewAddItems } = props
  return (
    <Button
      variant="contained"
      onClick={() => {
        setNewAddItems({ path })
      }}
      style={{ width: '80%', height: '80%', margin: '5px' }}
    >
      AddButton
    </Button>
  )
}

function DeleteButton(props) {
  const { path, setDeleteItems } = props
  return (
    <Button
      variant="contained"
      color='error'
      onClick={() => {
        setDeleteItems(path)
      }}
      style={{ width: '80%', height: '80%', margin: '5px' }}
    >
      DeleteButton
    </Button>
  )
}

const updateComponent = (type, location, setStatus, value) => {
  if (type === 'boolean') {
    return (
      <Check checked={value} setStatus={setStatus} location={location} />
    )
  }
  return null
}

// const addComponent = (maps, items, newGrid, setStatus, setNewAddItems) => {
//   for (const m of maps) {
//     const { location: { row, col }, index } = m
//     if (items[index].type === 'boolean') {
//       newGrid[row - 1][col - 1] = {
//         ...newGrid[row - 1][col - 1],
//         value: false,
//         component:
//           <Check checked={false} setStatus={setStatus} row={row} col={col} />
//       }
//     } else if (items[index].type === arrayType) {
//       newGrid[row - 1][col - 1] = {
//         ...newGrid[row - 1][col - 1],
//         childGrid: [],
//         component:
//           <AddButton items={items} currentItemIndex={index} row={row} setNewAddItems={setNewAddItems} location={{ row, col }} />
//       }
//     }
//   }
// }

const getDataTree = (current, typeTree, dataTree) => {
  const dataTreeIndex = dataTree.push({ typeTreeIndex: current }) - 1
  const { type } = typeTree[current]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    dataTree[dataTreeIndex] = { ..._.cloneDeep(dataTree[dataTreeIndex]) }
  } else if (type === objectType) {
    dataTree[dataTreeIndex] = { ..._.cloneDeep(dataTree[dataTreeIndex]), child: [] }
    for (var i of typeTree[current].child) {
      getDataTree(i, typeTree, dataTree[dataTreeIndex].child)
    }
  } else if (type === arrayType) {
    dataTree[dataTreeIndex] = { ..._.cloneDeep(dataTree[dataTreeIndex]), items: [] }
  }

}

const getMaxRowCol = (currentNode, typeTree, max) => {
  const { type, uiSchema } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    if (uiSchema !== undefined && uiSchema !== null) {
      if (uiSchema.hasOwnProperty('ui:location')) {
        const { row, col } = uiSchema['ui:location']
        if (max.row < row) max.row = row
        if (max.col < col) max.col = col
      }
    }
  } else if (type === objectType) {
    for (var i of currentNode.child) {
      getMaxRowCol(i, typeTree, max)
    }
  }
}

const cellOptions = { width: 100 }

const init = (max) => {
  const { row: maxRow, col: maxCol } = max
  const newGrid = []
  for (var i = 0; i < maxRow; i++) {
    newGrid[i] = []
    for (var j = 0; j < maxCol; j++) {
      newGrid[i][j] = { ...cellOptions }
    }
  }
  return newGrid
}

const initializeGrid = (typeTree, currentNode, grid, setStatus, setNewAddItems, setDeleteItems, path = [0], itemsRow = [], isArrayDescendant = false) => {
  const { type, title, uiSchema } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    const node = { ...cellOptions, value: null, type, title, path: [...path] }
    if (uiSchema !== undefined && uiSchema !== null) {
      if (uiSchema.hasOwnProperty('ui:location')) {
        const { row, col } = uiSchema['ui:location']
        grid[row - 1][col - 1] = {
          ...grid[row - 1][col - 1],
          ...node
        }
        // if (type === 'boolean') {
        //   grid[row - 1][col - 1] = {
        //     ...grid[row - 1][col - 1],
        //     ...node,
        //     value: false,
        //     component:
        //       <Check checked={false} location={{ row, col }} setStatus={setStatus} />
        //   }
        // }
      } else {
        itemsRow.push(node)
      }
    }
  } else if (type === objectType) {
    const { child } = currentNode
    child.forEach((value, i) => {
      initializeGrid(typeTree, value, grid, setStatus, setNewAddItems, setDeleteItems, [...path, i], itemsRow, isArrayDescendant)
    })
  } else if (type === arrayType) {
    const node = {
      ...cellOptions, type, title, value: null,
      path: [...path],
      component:
        <AddButton path={[...path]} setNewAddItems={setNewAddItems} />
    }
    if (!isArrayDescendant) {
      grid.push([{ ...node }])
    } else {
      itemsRow.push({ ...node })
    }
    const { items } = currentNode
    const newItemsRow = []
    items.forEach((value, i) => {
      initializeGrid(typeTree, value[0], grid, setStatus, setNewAddItems, setDeleteItems, [...path, i], newItemsRow, true)
      newItemsRow.push({
        ...cellOptions,
        value: null,
        type: 'delete',
        title: 'delete',
        path: [...path, i],
        component:
          <DeleteButton path={[...path, i]} setDeleteItems={setDeleteItems} />
      })
    })
    if (newItemsRow.length > 0) {
      grid.push(newItemsRow)
    }
  }
}

const addComponents = (grid,setStatus) => {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      const { type } = grid[i][j]
      if (type === 'boolean') {
        grid[i][j] = {
          ...grid[i][j],
          value: false,
          component:
            <Check checked={false} location={{ row:i+1, col:j+1 }} setStatus={setStatus} />
        }
      }
    }
  }
}

const addNewItem = (path, typeTree, currentNode, current = 0) => {
  const { type } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {

  } else if (type === objectType) {
    current++
    addNewItem(path, typeTree, currentNode.child[path[current]], current)
  } else if (type === arrayType) {
    if (current === path.length - 1) {
      if (currentNode.hasOwnProperty('descendantDataTree')) {
        currentNode.items.push(_.cloneDeep(currentNode.descendantDataTree))
      } else {
        const descendantDataTree = []
        getDataTree(typeTree[currentNode.typeTreeIndex].child[0], typeTree, descendantDataTree)
        currentNode.descendantDataTree = descendantDataTree
        currentNode.items.push(_.cloneDeep(descendantDataTree))
      }
    } else if (current < path.length - 1) {
      current++
      addNewItem(path, typeTree, currentNode.items[path[current]][0], current)
    }
  }
}

const deleteItem = (typeTree, currentNode, path, current = 0) => {
  const { type } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {

  } else if (type === objectType) {
    current++
    deleteItem(typeTree, currentNode.child[path[current]], path, current)
  } else if (type === arrayType) {
    if (current === path.length - 2) {
      current++
      const index = path[current]
      currentNode = currentNode.items.splice(index, 1)
    } else if (current < path.length - 1) {
      current++
      deleteItem(typeTree, currentNode.items[path[current]][0], path, current)
    }
  }
}

const findPosition = (root, value, typeTree, currentNode, path, current = 0, isArrayDescendant = false) => {
  const { type, title } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    if (isArrayDescendant) {
      root[path[current]] = value
    } else {
      root[title] = value
    }
  } else if (type === objectType) {
    if (isArrayDescendant) {
      findPosition(root[path[current++]], value, typeTree, currentNode.child[path[current]], path, current)
    } else {
      current++
      findPosition(root[title], value, typeTree, currentNode.child[path[current]], path, current)
    }
  } else if (type === arrayType) {
    if (isArrayDescendant) {
      findPosition(root[path[current++]], value, typeTree, currentNode.items[path[current]][0], path, current,true)
    } else {
      current++
      findPosition(root[title],value,typeTree, currentNode.items[path[current]][0], path, current,true)
    }
  }
}

const getData = (grid, dataTree, typeTree) => {
  var root = {}
  getDataStructure(dataTree[0], typeTree, root)
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      var { type, value, path } = grid[i][j]
      const findType = basicTypes.find(e => e === type)
      if (findType !== undefined) {
        const { flag, value: newValue } = validateType(value, type)
        value = newValue
        if (flag) {
          findPosition(root, value, typeTree, dataTree[0], path)
        }
      }
    }
  }
  return root
}

const getDataStructure = (currentNode, typeTree, root, isArrayDescendant = false) => {
  const { type, title } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    if (isArrayDescendant) {
      root.push(null)
    } else {
      root[title] = null
    }
  } else if (type === objectType) {
    if (isArrayDescendant) {
      const index = root.push({}) - 1
      for (var i of currentNode.child) {
        getDataStructure(i, typeTree, root[index])
      }
    } else {
      root[title] = {}
      for (var i of currentNode.child) {
        getDataStructure(i, typeTree, root[title])
      }
    }
  } else if (type === arrayType) {
    if (isArrayDescendant) {
      const index = root.push([]) - 1
      for (var i of currentNode.items) {
        getDataStructure(i[0], typeTree, root[index], true)
      }
    } else {
      root[title] = []
      for (var i of currentNode.items) {
        getDataStructure(i[0], typeTree, root[title], true)
      }
    }

  }
}

export default function ({ schema, uiSchema }) {
  const classes = useStyles()
  const [items, setItems] = React.useState([])
  const [maps, setMaps] = React.useState([])
  const [grid, setGrid] = React.useState([])
  const [status, setStatus] = React.useState({ location: { row: -1, col: -1 }, value: null })
  const [newAddItems, setNewAddItems] = React.useState(null)
  const [deleteItems, setDeleteItems] = React.useState(null)

  const [typeTree, setTypeTree] = React.useState([])
  const [dataTree, setDataTree] = React.useState([])

  React.useEffect(() => {
    const tTree = []
    traverse('root', 'root', schema, uiSchema, tTree, -1)
    setTypeTree(_.cloneDeep(tTree))
    if (tTree.length > 0) {
      const dTree = []
      getDataTree(0, tTree, dTree)
      setDataTree(_.cloneDeep(dTree))
    }
  }, [schema, uiSchema])

  // React.useEffect(() => {
  //   const items = []
  //   traverse('root', 'root', schema, uiSchema, items, -1)
  //   setItems(items)
  //   const maps = []
  //   map(items, maps)
  //   setMaps(maps)
  //   var newGrid = createGrid(maps, items)
  //   addComponent(maps, items, newGrid, setStatus, setNewAddItems)
  //   setGrid(newGrid)
  // }, [schema, uiSchema])

  React.useEffect(() => {
    var { location: { row, col }, value } = status
    row = row - 1
    col = col - 1
    if (row >= 0 && col >= 0) {
      var newGrid = grid.map(r => [...r]);
      newGrid[row][col].value = value
      newGrid[row][col] = {
        ...newGrid[row][col],
        component: updateComponent(newGrid[row][col].type, { row, col }, setStatus, value)
      }
      setGrid(newGrid)
    }
  }, [status])

  React.useEffect(() => {
    if (newAddItems) {
      const { path } = newAddItems
      const newDataTree = _.cloneDeep(dataTree)
      addNewItem(path, typeTree, newDataTree[0])
      setDataTree(newDataTree)
    }
  }, [newAddItems])

  React.useEffect(() => {
    if (dataTree.length > 0) {
      var max = { row: 0, col: 0 }
      getMaxRowCol(dataTree[0], typeTree, max)
      var newGrid = init(max)
      initializeGrid(typeTree, dataTree[0], newGrid, setStatus, setNewAddItems, setDeleteItems)
      addComponents(newGrid,setStatus)
      setGrid(newGrid)
      console.log(typeTree, dataTree, newGrid)
    }
  }, [dataTree])

  // React.useEffect(() => {
  //   if (newAddItems) {
  //     const { row, items: newCells, location } = newAddItems
  //     var newGrid = _.cloneDeep(grid)
  //     const deleteArray = []
  //     for (const cell of newCells) {
  //       const col = newGrid[row - 1].push(cell)
  //       deleteArray.push({ row, col })
  //       const { type, index } = cell
  //       if (type === 'boolean') {
  //         newGrid[row - 1][col - 1] = {
  //           ...newGrid[row - 1][col - 1],
  //           component:
  //             <Check checked={false} setStatus={setStatus} row={row} col={col} />
  //         }
  //       } else if (type === arrayType) {
  //         newGrid[row - 1][col - 1] = {
  //           ...newGrid[row - 1][col - 1],
  //           childGrid: [],
  //           component:
  //             <AddButton items={items} currentItemIndex={index} row={row} setNewAddItems={setNewAddItems} location={{ row, col }} />
  //         }
  //       }
  //     }
  //     const col = newGrid[row - 1].push({
  //       width: 100, title: 'deleteBtn', value: null, type: 'delete'
  //     })
  //     deleteArray.push({ row, col })
  //     newGrid[row - 1][col - 1] = {
  //       ...newGrid[row - 1][col - 1],
  //       component:
  //         <DeleteButton deleteArray={deleteArray} setDeleteItems={setDeleteItems} />
  //     }
  //     const deleteIndex = newGrid[location.row - 1][location.col - 1].childGrid.push(deleteArray) - 1
  //     setGrid(newGrid)
  //   }
  // }, [newAddItems])

  React.useEffect(() => {
    if (deleteItems) {
      const newDataTree = _.cloneDeep(dataTree)
      deleteItem(typeTree, newDataTree[0], deleteItems)
      setDataTree(newDataTree)
    }
  }, [deleteItems])

  // console.log('items', items)
  // console.log('maps', maps)
  // console.log('grid', grid)

  return (
    <>
      <ReactDataSheet
        data={grid}
        valueRenderer={cell => {
          var { title, value, type } = cell
          title = title ? title : ''
          if (type === 'boolean') {
            value = ': ' + value
          } else {
            value = value ? ': ' + value : ''
          }
          return title + '' + value
        }}
        dataRenderer={cell => {
          var { value } = cell
          value = value ? value : ''
          return value
        }}
        onCellsChanged={changes => {
          const newGrid = _.cloneDeep(grid)
          changes.forEach(({ cell, row, col, value }) => {
            newGrid[row][col] = { ...grid[row][col], value };
            if (cell.type === 'boolean') {
              newGrid[row][col] = { ...grid[row][col], value: cell.value };
            }
          });
          setGrid(newGrid);
        }}
      />
      <Button
        className={classes.button}
        variant="contained"
        onClick={() => {
          console.log(getData(grid, dataTree, typeTree))
          // var root = {}
          // getDataStructure(dataTree[0], typeTree, root)
          // console.log(root)
        }}
      >
        submit
      </Button>
    </>
  )
}