// index.jsx
import React from 'react';
import Property from './property';

export const PropertyRoute = (props) => {
  const { match: { params }} = props
  return (
    <Property property_id={params.id} />
  )
}
