import React from 'react';

const TimeLink = ({ go }) => (
  <a href={go} target='_blank' className='navIcon'>
    <i className='icon fa fa-clock-o fa-2x' aria-hidden='true'></i>
    <span className='icontext'>Time Clock</span>
  </a>
);

export default TimeLink;