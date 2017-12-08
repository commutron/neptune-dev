import React from 'react';

const TimeLink = ({ go }) => (
  <a href={go} target='_blank' className='navIcon'>
    <i className='icon far fa-clock fa-lg' aria-hidden='true'></i>
    <span className='icontext'>Time Clock</span>
  </a>
);

export default TimeLink;