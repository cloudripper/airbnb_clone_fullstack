// property.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import { Link } from 'react-router-dom';

import BookingWidget from './bookingWidget';

import './property.scss';

class Property extends React.Component {
  state = {
    property: {},
    loading: true,
    image: null,
    imageLoad: false,
  }

  componentDidMount() {
    this.fetchProp()     
  }

  async fetchProp() {
    const propObj = await fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then(data => {
          return data.property
      })

    await this.setState({
      property: propObj,
      image: (propObj.image.array) ? propObj.image.array[1].image : propObj.image.seed,
      loading: false,
      
    })
  
    console.log("Property: ", this.state.property)
  //  await this.loadImage()

  }

  //loadImage() {        
  //  const { property } = this.state;     
  //  let propImg = new Image()
  //  console.log("onliad")
  //  propImg.onload = () => {
  //    //this.setState({image: propImg.src})
  //    console.log("img loaded: ", propImg.src)
  //    return propImg.src
  //    $("#propHero").css("background-image", `url(${propImg.src})`)
//
  //    propImg = null
  //  }
  //  propImg.src = property.image.array[0].image
//
  //}

  render () {
    const { property, loading } = this.state;
    if (loading) {
      return <p>loading...</p>;
    };

    const {
      id,
      title,
      description,
      city,
      country,
      property_type,
      price_per_night,
      max_guests,
      bedrooms,
      beds,
      baths,
      image_url,
      user,
    } = property

    return (
      <>
        <div className="property-image mb-3" style={{ backgroundImage: `url(${this.state.image})` }}>
          {(() => { 
            let imageSrc = ''
            if (property.image.array) {
              imageSrc = property.image.array[0].image
            } else {
              imageSrc = property.image.seed
            }
            return <img className="propImage" onLoad={()=> $(".propImage").addClass("img-visible") } src={imageSrc} />
          })()} 
        </div>
          <div className="container">
            <div className="row">
              <div className="info col-12 col-lg-8">
                <div className="mb-3">
                  <h3 className="mb-0">{title}</h3>
                  <p className="text-uppercase mb-0 text-secondary"><small>{city}</small></p>
                  <p className="mb-0"><small>Hosted by <b><Link to={`/users/show/${user.id}`}>{user.username}</Link></b></small></p>
                </div>
                <div>
                  <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                  <p>
                    <span className="mr-3">{max_guests} guests</span>
                    <span className="mr-3">{bedrooms} bedroom</span>
                    <span className="mr-3">{beds} bed</span>
                    <span className="mr-3">{baths} bath</span>
                  </p>
                </div>
                <hr />
                <p>{description}</p>
              </div>
              <div className="col-12 col-lg-5">
                <BookingWidget property_id={id} price_per_night={price_per_night} />
              </div>
            </div>
        </div>
      </>
    )
  }
}

export default Property