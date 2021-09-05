import React from 'react';

export default function(props){
  const {schema:{title},label:name,formData}=props
  const label=title?title:(name?name:'')

  const processFile = (files) => {
    const f = files[0];
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.readAsDataURL(f);
    });
  }
 
  return (
    <>
    <span style={{marginBottom:'10px',fontSize:'12px',color:'grey'}}>{label}</span>
    <input type="file"
      required={props.required}
      onChange={(event) => processFile(event.target.files).then(props.onChange)} />
    </>
  )
}