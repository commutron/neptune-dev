import React from 'react';

const GeneralLabel = ({ batch, data })=> {
  
  const gensty = {
    boxSizing: 'content-box',
    fontFamily: 'VarelaLocal',
    width: '900px',
    height: '600px',
    margin: 'auto',
    border: '2px dashed black',
    padding: '0',
    backgroundColor: 'white',
    color: 'black',
    fontWeight: '900',
    fontStretch: 'semi-expanded',
    verticalAlign: 'middle'
  };
  
  const top = {
    margin: '20px 10px 10px 10px',
    padding: '0',
    alignItems: 'center'
  };
  const div = {
    margin: '10px',
    padding: '0',
    alignItems: 'center'
  };
  
  const pxlg = {
    margin: '5px 0',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '9rem',
    lineHeight: '1.1',
  };
  const plg = {
    margin: '5px 0',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '6rem',
    lineHeight: '1.2',
  };
  const pmd = {
    margin: '5px 0',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '3rem',
  };
  const psm = {
    margin: '5px 0',
    verticalAlign: 'middle',
    textAlign: 'center',
    fontSize: '2.5rem',
  };
  const pxsm = {
    margin: '5px 0',
    verticalAlign: 'middle',
    fontSize: '2rem',
  };
  const input = {
    width: '300px',
    height: 'auto',
    border: 'none',
    fontWeight: '800',
    textAlign: 'center',
    margin: '5px 0',
    verticalAlign: 'middle',
    fontSize: '6rem',
    lineHeight: '1.2',
  };



  return(
  <div style={gensty} className='printGenLabel'>
    <div style={top} className='noCopy'>
      <div style={div} className='centre'>
        <div style={div}  className='evenRow'>
          <div style={div} className='centreText'>
            <i style={pxlg}>{batch}</i>
          </div>
          <div style={div} className='centreText'>
            <i style={pxsm}>Qty</i><br />
            <i><input style={input} defaultValue={data.quant} maxLength='5' /></i>
          </div>
        </div>
        <div style={div} className='centre up'>
          <i style={plg}>{data.group}</i>
          <i style={pmd}>{data.widget} Rev. {data.ver}</i>
          <i style={psm}>{data.desc}</i>
          <i style={psm}>{data.sales}</i>
        </div>
      </div>
    </div>
  </div>
);
};

export default GeneralLabel;