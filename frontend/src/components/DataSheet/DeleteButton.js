import React from "react";
import Button from '@mui/material/Button';

export default function(props) {
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