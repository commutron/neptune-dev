import React from 'react';

const Spin = ({ color, message }) => {
  let img = !color ? '/neptune-logo-white.svg' : '/neptune-logo-color.svg';
  let sty = { height: '50vh' };
  
  let text = message || 'Fetching Records From The Server, Please Wait';
  
  return (
    <div className='loading'>
      <img
        src={img}
        className='logoSVG shadow'
        style={sty} />
      <br />
      <p className='centreText'>{text}...</p>
    </div>
  );
};

export default Spin;

export const SpinWrap = ({ color, message })=> (
  <div className='centreContainer'>
    <div className='centrecentre'>
      <Spin color={color} message={message} />
    </div>
  </div>
);

export const CalcSpin = () => {
  let sty = { height: '50px' };
  return(
    <div className='centre'>
      <p className='centreText'>
        <img
          src='/neptuneMiniSpin.svg'
          className='minispinLogoSVG'
          style={sty} />
        <br />
        <em>Calculating</em>
      </p>
    </div>
  );
};