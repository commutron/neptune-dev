import React from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';

function GeneralLabel({ batch, data }) {
  return(
    <div className='noCopy'>
      <div className='centreRow'>
        <div className='centre'>
          <i className='pxxlg'>{batch}</i>
          <Barcode id='barcode' value={batch} format='CODE39' text=' ' width={1.25} height={20} margin={1} />
        </div>
        <span className='bffrbffr'></span>
        <div className='pmd centreText'>
          <i>TH</i><br />
          <i>SMT</i>
        </div>
        <span className='bffr'></span>
      </div>
      <div className='centre up'>
        <i className='plg'>{data.group}</i>
        <i className='pmd'>{data.widget} Rev {data.ver}</i>
        <i className='pmd'>{data.desc}</i>
      </div>
      <div className='centreRow'>
        <div className='centreText'>
          <i className='pmd'>Qty</i><br />
          <i><input defaultValue={data.quant} maxLength='10' /></i>
        </div>
        <span className='bffr'></span>
        <i className='pxlg'>{data.date}</i>
      </div>
    </div>
  );
}

export default GeneralLabel;