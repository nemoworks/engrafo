import React, { useState, useEffect } from "react";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/styles";
import _, { set } from "lodash";
import Checkbox from '@mui/material/Checkbox';
import ArrayDataSheet from "./ArrayDataSheet";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import ArrayValueRender from "./ArrayValueRender";

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
        parent,
        uiSchema
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
        parent,
        uiSchema
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

// function AddButton(props) {
//   const { path, setNewAddItems } = props
//   return (
//     <Button
//       variant="contained"
//       onClick={() => {
//         setNewAddItems({ path })
//       }}
//       style={{ width: '80%', height: '80%', margin: '5px' }}
//     >
//       AddButton
//     </Button>
//   )
// }

// function DeleteButton(props) {
//   const { path, setDeleteItems } = props
//   return (
//     <Button
//       variant="contained"
//       color='error'
//       onClick={() => {
//         setDeleteItems(path)
//       }}
//       style={{ width: '80%', height: '80%', margin: '5px' }}
//     >
//       DeleteButton
//     </Button>
//   )
// }

const updateComponent = (type, location, setStatus, value) => {
  if (type === 'boolean') {
    return (
      <Check checked={value} setStatus={setStatus} location={location} />
    )
  }
  return null
}


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

const gerDataJSONTree = (current, typeTree, parent, parentTitle) => {
  const { type } = typeTree[current]
  parent[parentTitle] = { typeTreeIndex: current }
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {

  } else if (type === objectType) {
    parent[parentTitle].properties = {}
    for (var i of typeTree[current].child) {
      const { title } = typeTree[i]
      parent[parentTitle].properties[title] = null
      gerDataJSONTree(i, typeTree, parent[parentTitle].properties, title)
    }
  } else if (type === arrayType) {
    parent[parentTitle].items = []
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

const initializeGrid = (typeTree, currentNode, grid, setStatus, setArrayStatus, setNewAddItems, setDeleteItems, path = [0], itemsRow = [], isArrayDescendant = false) => {
  const { type, title, uiSchema } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    const node = { ...cellOptions, value: null, type, title, path: [...path] }
    if (!isArrayDescendant) {
      if (uiSchema !== undefined && uiSchema !== null) {
        if (uiSchema.hasOwnProperty('ui:location')) {
          const { row, col } = uiSchema['ui:location']
          grid[row - 1][col - 1] = {
            ...grid[row - 1][col - 1],
            ...node
          }
        }
      }
    } else {
      itemsRow.push({ ...node })
    }
  } else if (type === objectType) {
    const { child } = currentNode
    child.forEach((value, i) => {
      initializeGrid(typeTree, value, grid, setStatus, setArrayStatus, setNewAddItems, setDeleteItems, [...path, i], itemsRow, isArrayDescendant)
    })
  } else if (type === arrayType) {
    const node = {
      ...cellOptions, type, title, value: null,
      path: [...path],
      setNewAddItems,
      setArrayStatus,
    }
    if (!isArrayDescendant) {
      // grid.push([{ ...node }])
    } else {
      itemsRow.push({ ...node })
    }
    const { items } = currentNode
    const newItemsRow = []
    items.forEach((value, i) => {
      initializeGrid(typeTree, value[0], grid, setStatus, setArrayStatus, setNewAddItems, setDeleteItems, [...path, i], newItemsRow, true)
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
    const { uiSchema: arrayUiSchema } = typeTree[currentNode.typeTreeIndex]
    if (arrayUiSchema) {
      if (arrayUiSchema.hasOwnProperty('ui:location') && arrayUiSchema.hasOwnProperty('ui:span')) {
        const { row, col } = arrayUiSchema['ui:location']
        const { rowSpan, colSpan } = arrayUiSchema['ui:span']
        addItems(grid, { array: { ...node, location: { row, col } }, items: newItemsRow, itemsNumPerGroup: newItemsRow.length / items.length }, { row, col, rowSpan, colSpan })
      }
    }
  }
}

const initializeNewGrid = (typeTree, currentNode, grid, setStatus, setNewAddItems, setDeleteItems, path = [0], itemsRow = [], isArrayDescendant = false) => {
  const { type, title, uiSchema } = typeTree[currentNode.typeTreeIndex]
  const findType = basicTypes.find(element => element === type)
  if (findType !== undefined) {
    const node = { ...cellOptions, value: null, type, title, path: [...path] }
    if (!isArrayDescendant) {
      if (uiSchema !== undefined && uiSchema !== null) {
        if (uiSchema.hasOwnProperty('ui:location')) {
          const { row, col } = uiSchema['ui:location']
          grid[row - 1][col - 1] = {
            ...grid[row - 1][col - 1],
            ...node
          }
        }
      }
    } else {
      itemsRow.push({ ...node })
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
      setNewAddItems,
    }
    if (!isArrayDescendant) {
      // grid.push([{ ...node }])
    } else {
      itemsRow.push({ ...node })
    }
    const { items } = currentNode
    const newItemsRow = []
    items.forEach((value, i) => {
      initializeGrid(typeTree, value[0], grid, setStatus, setArrayStatus, setNewAddItems, setDeleteItems, [...path, i], newItemsRow, true)
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
    const { uiSchema: arrayUiSchema } = typeTree[currentNode.typeTreeIndex]
    if (arrayUiSchema) {
      if (arrayUiSchema.hasOwnProperty('ui:location') && arrayUiSchema.hasOwnProperty('ui:span')) {
        const { row, col } = arrayUiSchema['ui:location']
        const { rowSpan, colSpan } = arrayUiSchema['ui:span']
        addItems(grid, { array: { ...node }, items: newItemsRow, itemsNumPerGroup: newItemsRow.length / items.length }, { row, col, rowSpan, colSpan })
      }
    }
  }
}

const addItems = (grid, context, { row, col, rowSpan, colSpan }) => {
  var l = grid.length + 1
  for (var i = l; i <= row; i++) {
    grid.push([{ ...cellOptions }])
  }
  l = grid[row - 1].length + 1
  for (var i = l; i <= col; i++) {
    grid[row - 1].push({ ...cellOptions })
  }
  const { array: { type, title, value } } = context
  grid[row - 1][col - 1] = {
    ...grid[row - 1][col - 1],
    type, title, value,
    rowSpan,
    colSpan,
    context,
    component:
      <ArrayDataSheet context={context} />
  }
}

const completeGrid = (grid) => {
  var rowSize = 0
  // var colSize = 0
  for (var i = 1; i <= grid.length; i++) {
    for (var j = 1; j <= grid[i - 1].length; j++) {
      var currentMaxRow = 0
      // var currentMaxCol = 0
      if (grid[i - 1][j - 1].hasOwnProperty('rowSpan') && grid[i - 1][j - 1].hasOwnProperty('colSpan')) {
        const { rowSpan, colSpan } = grid[i - 1][j - 1]
        currentMaxRow = i + rowSpan - 1
        // currentMaxCol = j + colSpan - 1
      } else {
        currentMaxRow = i
        // currentMaxCol = j
      }
      if (rowSize < currentMaxRow) rowSize = currentMaxRow
      // if (colSize < currentMaxCol) colSize = currentMaxCol
    }
  }
  var cellNum = []
  for (var i = 1; i <= rowSize; i++) {
    cellNum.push(0)
  }
  for (var i = 1; i <= grid.length; i++) {
    for (var j = 1; j <= grid[i - 1].length; j++) {
      if (grid[i - 1][j - 1].hasOwnProperty('rowSpan') && grid[i - 1][j - 1].hasOwnProperty('colSpan')) {
        const { rowSpan, colSpan } = grid[i - 1][j - 1]
        for (var t = 1; t <= rowSpan; t++) {
          cellNum[i + t - 2] += colSpan
        }
      } else {
        cellNum[i - 1]++
      }
    }
  }
  var max = 0
  for (var i = 1; i <= rowSize; i++) {
    if (cellNum[i - 1] > max) max = cellNum[i - 1]
  }

  for (var i = grid.length + 1; i <= rowSize; i++) {
    if (max > cellNum[i - 1]) {
      grid.push([{ ...cellOptions }])
      cellNum[i - 1]++
    }
  }
  for (var i = 1; i <= rowSize; i++) {
    for (var j = cellNum[i - 1] + 1; j <= max; j++) {
      grid[i - 1].push({ ...cellOptions })
    }
  }

}

const addComponents = (grid, setStatus) => {
  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      const { type } = grid[i][j]
      if (type === 'boolean') {
        grid[i][j] = {
          ...grid[i][j],
          value: false,
          component:
            <Check checked={false} location={{ row: i + 1, col: j + 1 }} setStatus={setStatus} />
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
      findPosition(root[path[current++]], value, typeTree, currentNode.items[path[current]][0], path, current, true)
    } else {
      current++
      findPosition(root[title], value, typeTree, currentNode.items[path[current]][0], path, current, true)
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
  const [grid, setGrid] = React.useState([])
  const [gridContext, setGriContext] = React.useState({ rowSize: 0, colSize: 0 })
  const [status, setStatus] = React.useState({ location: { row: -1, col: -1 }, value: null })
  const [arrayStatus, setArrayStatus] = React.useState({ location: { row: -1, col: -1 }, value: null, index: -1 })
  const [newAddItems, setNewAddItems] = React.useState(null)
  const [deleteItems, setDeleteItems] = React.useState(null)

  const [typeTree, setTypeTree] = React.useState([])
  const [dataTree, setDataTree] = React.useState([])

  const [dataJSONTree, setDataJSONTrees] = useState(null)

  React.useEffect(() => {
    const tTree = []
    traverse('root', 'root', schema, uiSchema, tTree, -1)
    setTypeTree(_.cloneDeep(tTree))
    if (tTree.length > 0) {
      const dTree = []
      getDataTree(0, tTree, dTree)
      setDataTree(_.cloneDeep(dTree))
      // var dt = { root: null }
      // gerDataJSONTree(0, tTree, dt, 'root')
      // setDataJSONTrees(_.cloneDeep(dt))
      // console.log(tTree, dt)
    }
  }, [schema, uiSchema])

  React.useEffect(() => {
    var { location: { row, col }, value } = status
    if (row >= 0 && col >= 0) {
      var newGrid = grid.map(r => [...r]);
      newGrid[row - 1][col - 1].value = value
      newGrid[row - 1][col - 1] = {
        ...newGrid[row - 1][col - 1],
        component: updateComponent(newGrid[row - 1][col - 1].type, { row, col }, setStatus, value)
      }
      setGrid(newGrid)
    }
  }, [status])

  useEffect(() => {
    var { location: { row, col }, value, index } = arrayStatus
    if (row >= 0 && col >= 0 && index >= 0) {
      var newGrid = _.cloneDeep(grid)
      console.log(arrayStatus)
      newGrid[row-1][col-1].context.items[index].value=value
      setGrid(newGrid)
    }
  }, [arrayStatus])

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
      initializeGrid(typeTree, dataTree[0], newGrid, setStatus, setArrayStatus, setNewAddItems, setDeleteItems)
      addComponents(newGrid, setStatus)
      completeGrid(newGrid)
      setGrid(newGrid)
      console.log(typeTree, dataTree, newGrid)
    }
  }, [dataTree])

  useEffect(() => {
    if (dataJSONTree) {
      var newGrid = []
      initializeNewGrid(typeTree, dataJSONTree.root, newGrid, setStatus, setNewAddItems, setDeleteItems)
      console.log(newGrid)
    }
  }, [dataJSONTree])

  React.useEffect(() => {
    if (deleteItems) {
      const newDataTree = _.cloneDeep(dataTree)
      deleteItem(typeTree, newDataTree[0], deleteItems)
      setDataTree(newDataTree)
    }
  }, [deleteItems])

  return (
    <>
      <ReactDataSheet
        data={grid}
        valueRenderer={(cell, row, col) => {
          var { title, value, type } = cell
          title = title ? title : ''
          if (type === 'boolean') {
            value = ': ' + value
          } else if (type === arrayType) {
            return <ArrayValueRender context={grid[row][col].context} />
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
        }}
      >
        submit
      </Button>
    </>
  )
}