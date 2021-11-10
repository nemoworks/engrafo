import React from "react";
import { useState, useEffect } from "react";
import ReactDataSheet from 'react-datasheet';
import 'react-datasheet/lib/react-datasheet.css';

const cellOptions = { width: 100 }

export default function ({ context }) {
  const { items, itemsNumPerGroup } = context
  const [grid, setGrid] = useState([])
  useEffect(() => {
    var newGrid = []
    var newRow = []
    items.forEach((value, index) => {
      if ((index+1)%itemsNumPerGroup === 0) {
        newGrid.push(newRow)
        newRow = []
      }else{
        newRow.push({
          ...value
        })
      }
    })
    setGrid(newGrid)
  }, [items])

  return (
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
  )
}