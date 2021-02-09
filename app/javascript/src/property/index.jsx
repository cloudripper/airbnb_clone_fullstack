// index.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Property from './property';

export const PropertyRoute = (props) => {
  const { match: { params }} = props
  return (
    <Property property_id={params.id} />
  )
}


//document.addEventListener('DOMContentLoaded', () => {
//  const node = document.getElementById('params');
//  const data = JSON.parse(node.getAttribute('data-params'));
//
//  ReactDOM.render(
//    <Property property_id={data.property_id} />,
//    document.body.appendChild(document.createElement('div')),
//  )
//})