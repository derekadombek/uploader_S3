import React, { Component } from 'react'
import axios from 'axios'
import _ from 'lodash'
import '../index.css'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import clip from '../images/clip-image.png'

export default class Gallery extends Component {
  interval = null
  constructor(props) {
    super(props)
    this.state = {
      images: [],
      isLoading: true,
      errors: null,
      value: '',
      copied: false,
    }
  }

  componentDidMount() {
    this.interval = setInterval(this.getData, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.interval)
  }

  getData = () => {
    axios
      .get('http://localhost:3001/gallery')
      // .then(response => console.log(response))
      // .catch(error => this.setState({ error, isLoading: false }));
      .then((res) =>
        res.data.data.Contents.map((key) => ({
          image: `s3_bucket_url/${key.Key}`,
          date: key.LastModified,
        }))
      )
      .then((images) => {
        this.setState({
          images: _.orderBy(images, ['date'], ['desc']),
          isLoading: false,
        })
      })
      .catch((error) => this.setState({ error, isLoading: false }))
  }

  render() {
    const { isLoading, images } = this.state
    console.log(images)
    return (
      <div>
        <div>
          <ul className="wrapper">
            {!isLoading ? (
              images.map((key) => {
                const { image } = key
                return (
                  <div key={image}>
                    <li className="box">
                      <img className="s3-image" src={image} alt="pics" />
                      <br />
                      <br />
                      <p>{`${image}`}</p>
                      <CopyToClipboard
                        text={`${image}`}
                        onCopy={() => this.setState({ copied: true })}
                      >
                        <button className="clip-button">
                          <img src={clip} alt="clip" />
                        </button>
                      </CopyToClipboard>
                    </li>
                  </div>
                )
              })
            ) : (
              <p>Loading...</p>
            )}
          </ul>
        </div>
      </div>
    )
  }
}
