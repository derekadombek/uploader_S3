var aws = require('aws-sdk')
//require('dotenv').config(); // Configure dotenv to load in the .env file
// Configure aws with your accessKeyId and your secretAccessKey
aws.config.loadFromPath('./config.json')
const S3_BUCKET = 'bucket-name'

// exports.gallery = (req,res) => {
//   const s3_gallery = new aws.S3();
//   const fileName = req.body;
//   const params = {
//     Bucket: S3_BUCKET,
//     Key: fileName
//   }
//   s3_gallery.getObject(params, (err, data) => {
//     if(err){
//       console.log(err);
//       res.json({success: false, error: err})
//     }
//     const returnData2 = {
//       url2: data
//     };
//     res.json({success:true, data:{returnData2}});
//   })
// }
exports.s3_gallery = (req, res) => {
  const s3_gallery = new aws.S3()
  //const fileName = req.body.fileName;
  const params = {
    Bucket: S3_BUCKET, //,
    //Key: fileName
  }
  s3_gallery.listObjectsV2(params, function (err, data) {
    if (err) {
      console.log('Error', err)
      res.json({ success: false, error: err })
    }

    console.log('Success', data)
    res.json({ success: true, data })
  })
}

// Now lets export this function so we can call it from somewhere else
exports.sign_s3 = (req, res) => {
  const s3 = new aws.S3() // Create a new instance of S3
  const fileName = req.body.fileName
  const fileType = req.body.fileType
  const meta_fileType = `image/${fileType}`
  // Set up the payload of what we are sending to the S3 api
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 1000,
    ContentType: meta_fileType,
  }
  // Make a request to the S3 API to get a signed URL which we can use to upload our file
  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      res.json({ success: false, error: err })
    }
    // Data payload of what we are sending back, the url of the signedRequest and a URL where we can access the content after its saved.
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`,
    }
    res.json({ success: true, data: { returnData } })
  })
}

// async function list_S3Bucket(S3_BUCKET, prefix) {
//   let isTruncated = true;
//   let marker;
//   while(isTruncated) {
//     let params = { Bucket: S3_BUCKET };
//     if (prefix) params.Prefix = prefix;
//     if (marker) params.Marker = marker;
//     try {
//       const response = await s3.listObjects(params).promise();
//       response.Contents.forEach(item => {
//         console.log(item.Key);
//       });
//       isTruncated = response.IsTruncated;
//       if (isTruncated) {
//         marker = response.Contents.slice(-1)[0].Key;
//       }
//   } catch(error) {
//       throw error;
//     }
//   }
// }

// export default list_S3Bucket(S3_BUCKET);
