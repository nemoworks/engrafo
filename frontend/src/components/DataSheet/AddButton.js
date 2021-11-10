import React from "react";
import Button from '@mui/material/Button';

export default function (props) {
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