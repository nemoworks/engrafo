const findFile = (uischema,formdata,parent) => {
  for(const key in uischema){
    if(Object.prototype.toString.call(uischema[key])==='[Object Object]'&&formdata.hasOwnProperty(parent)){
      findFile(uischema[key],formdata[parent],key)
    }else if(key==='ui:widget'&&uischema[key]==='base64-file'){
      if(formdata.hasOwnProperty(parent)){
        if(formdata[parent].includes('data:',0)&&formdata[parent].includes('base64')){
          var uniqueTmpfile = uniqueFilename('', '', '')
          storeFile(formdata[parent],uniqueTmpfile)
          formdata[parent]=uniqueTmpfile
        }
      }
    }
  }
}

var Buffer = require('buffer/').Buffer;
var Minio = require('minio')
const os = require('os');
var uniqueFilename = require('unique-filename')
var Readable = require('stream').Readable


var minioClient = new Minio.Client({
    endPoint: 'localhost',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
});

const storeFile = (base64Str,filename) => {
  const image=base64Str.split(';')
  image[0]=image[0].replace('data:','')
  image[1]=image[1].replace('base64,','')
  console.log(image[1])
  const buffer=Buffer.from(image[1],'base64')
  const filestream = new Readable()
  filestream.push(buffer)   
  filestream.push(null) 
  minioClient.bucketExists('engrafo', function(err, exists) {
    if (err) {
      return console.log(err)
    }
    if (exists) {
      minioClient.putObject('engrafo', filename, filestream, function(err, etag) {
        if(err){
          return console.log(err,etag)
        }
      })
    }else{
      minioClient.makeBucket('engrafo', 'us-east-1', function(err) {
        if (err){
          return console.log(err,etag)
        }
        minioClient.putObject('engrafo', filename, filestream, function(err, etag) {
          if(err) {
            return console.log(err,etag)
          }
        })
      })
    }
  })
}

const fs = require('fs');
var stream = require('stream');

const downloadFile = (res,filename) => {
  const chunks = [];
  minioClient.getObject('engrafo', filename, function(err, dataStream) {
    if (err) {
      return console.log(err)
    }
    dataStream.on('data', function(chunk) {
      chunks.push(chunk);
    })
    dataStream.on('end', function() {
      let buffer = Buffer.concat(chunks);
      console.log('End. data size = ' + buffer.length)
      var fileContents=buffer.toString('base64')
      // console.log(r)
      // res.send(r)
      var readStream = new stream.PassThrough();
      readStream.end(buffer);

      res.set('Content-disposition', 'attachment; filename=' + filename);
      res.set('Content-Type', 'application/octet-stream');

      readStream.pipe(res);
    })
    dataStream.on('error', function(err) {
      console.log(err)
    })
  })
}


module.exports = {
  findFile,
  storeFile,
  downloadFile
}