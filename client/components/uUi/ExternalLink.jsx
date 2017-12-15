import React from 'react';

const ExternalLink = ({ go, title, icon }) => (
  <a href={go} target='_blank' className='navIcon'>
    <i className={'icon ' + icon + ' fa-lg'} aria-hidden='true'></i>
    <span className='icontext'>{title}</span>
  </a>
);

export default ExternalLink;