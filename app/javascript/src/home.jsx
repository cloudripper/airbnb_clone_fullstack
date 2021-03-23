// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import { Spinner } from '@utils/tools';

import './home.scss';


export class Home extends React.Component {

  state = {
    properties: [],
    total_pages: null,
    next_page: null,
    loading: true,
    error: null,
  }

  componentDidMount() {
    fetch('/api/properties?page=1')
      .then(handleErrors)
      .then(data => {
        
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
      })

    
  }

  //componentWillUnmount() {
  //  this.setState({loading: true})
  //}

  loadMore = () => {
    if (this.state.next_page === null) {
      return;
    }
    this.setState({ loading: true });
    fetch(`/api/properties?page=${this.state.next_page}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          properties: this.state.properties.concat(data.properties),
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
      })
  }

  render () {
    const { properties, next_page, loading, error } = this.state;
    return (
        <div className="container pt-4">
          <h4 className="mb-1">Top-rated places to stay</h4>
          <p className="text-secondary mb-3">Explore some of the best-reviewed stays in the world</p>
          <div className="row">
            {properties.map(property => {
              let bgImg = "https://via.placeholder.com/300x400"
              let fillImg = ""
              if (property.image.array && property.image.array.length > 1) {
                bgImg = property.image.array[1].image
                fillImg = property.image.array[0].image
              } else if (property.image.seed) {
                bgImg = property.image.seed
              } else {
              }
              
              return (
                <div key={property.id} className="col-6 col-lg-4 mb-4 property">
                  <a href={`/property/${property.id}`} className="text-body text-decoration-none">
                    <div className="property-image mb-1 styleContainer" id={property.id} style={{ backgroundImage: `url(${bgImg})` }}>
                      <img className="homePropImage styleContainer" onLoad={()=> $(".homePropImage").addClass("img-visible") } src={fillImg} />
                    </div>
                    <p className="text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
                    <h6 className="mb-0">{property.title}</h6>
                    <p className="mb-0"><small>${property.price_per_night} USD/night</small></p>
                  </a>
                </div>
              )
            })}
          </div>
          {loading && <Spinner error={error} />}
          {(loading || next_page === null) ||
          <div className="text-center mb-5 pb-3">
            <button
              className="btn btn-light mb-4 styleContainer"
              onClick={this.loadMore}
            >load more</button>
          </div>
          }
        </div>
    )
  }
}
