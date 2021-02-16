import React, { Component } from 'react'
import axios from 'axios'
import '../index.css'

export default class Upload extends Component {
  constructor (props) {
    super(props)
    this.state = {
      success: false,
      url: '',
      error: false,
      errorMessage: ''
    }
  }

  handleChange = (ev) => {
    this.setState({ success: false, url: '' })
  }

  handleUpload = (ev) => {
    const fileInput = document.getElementById('file')

    const filePath = fileInput.value
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i

    if (!allowedExtensions.exec(filePath)) {
      window.alert('Invalid file type')
      fileInput.value = ''
      return false
    } else {
      const file = this.uploadInput.files[0]
      // Split the filename to get the name and type
      const fileParts = this.uploadInput.files[0].name.split('.')
      const fileName = fileParts[0]
      const fileType = fileParts[1]
      console.log('Preparing the upload')
      axios
        .post('http://localhost:3001/sign_s3', {
          fileName: fileName,
          fileType: fileType
        })
        .then((response) => {
          var returnData = response.data.data.returnData
          var signedRequest = returnData.signedRequest
          var url = returnData.url
          this.setState({ url: url })
          console.log('Recieved a signed request ' + signedRequest)

          var options = {
            headers: {
              'Content-Type': file.type
            }
          }
          axios
            .put(signedRequest, file, options)
            .then((result) => {
              console.log('Response from s3')
              this.setState({ success: true })
            })
            .catch((error) => {
              window.alert('ERROR ' + JSON.stringify(error))
            })
        })
        .catch((error) => {
          window.alert(JSON.stringify(error))
        })
    }
  }

  render () {
    const ErrorMessage = () => (
      <div style={{ padding: 50 }}>
        <h3 style={{ color: 'red' }}>FAILED UPLOAD</h3>
        <span style={{ color: 'red', backgroundColor: 'black' }}>ERROR: </span>
        <span>{this.state.errorMessage}</span>
        <br />
      </div>
    )
    return (
      <div className='mt-8'>
        <center>
          <div className="upload-background">
          <h1>UPLOAD IMAGE</h1>
          {this.state.error ? <ErrorMessage /> : null}
          <label className='btn btn-default btn-file'>
            Browse{' '}
            <input
              id='file'
              onChange={this.handleChange}
              ref={(ref) => {
                this.uploadInput = ref
              }}
              type='file'
            />
          </label>
          <br />
          <button
            className='upload-button'
            color='primary'
            onClick={this.handleUpload}
          >
            UPLOAD
          </button>
          <br />
          <br />
          </div>
        </center>
      </div>
    )
  }
}
