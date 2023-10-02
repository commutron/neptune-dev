import React from 'react';

const Spin = ({ message }) => {
  let text = message || '';
  
  return (
    <div className='loading'>
      <img
        src='/neptune-logo-white.svg'
        className='logoSVG shadow'
        style={{ height: '50vh' }} />
      <br />
      <p className='centreText darkgrayT'>{text}</p>
    </div>
  );
};

export default Spin;

export const SpinWrap = ({ message })=> (
  <div className='centreContainer'>
    <div className='centrecentre'>
      <Spin message={message} />
    </div>
  </div>
);

export const CalcSpin = () => (
  <div className='centre'>
    <p className='centreText'>
      <img
        src='/neptuneMiniSpin.svg'
        className='minispinLogoSVG'
        style={{ height: '50px' }} />
      <br />
      <em>Loading...</em>
    </p>
  </div>
);