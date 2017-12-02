import React from 'react';

const Spin = ({ color }) => {
  let img = !color ? '/neptune-logo-white.svg' : '/neptune-logo-color.svg';
  let sty = { height: '50vh' };
  return (
    <div className='loading'>
      <img
        src={img}
        className='logoSVG shadow'
        style={sty} />
      <br />
      <p className='centreText'>Fetching Records From The Server, Please Wait...</p>
    </div>
  );
};

export default Spin;