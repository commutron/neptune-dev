import React from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import moment from 'moment';

function GeneralLabel({ batch, data }) {
  return(
    <div className='noCopy'>
      <div className='centreRow'>
        <div className='centre'>
          <i className='pxxlg numFont'>{batch}</i>
          <i className='pmd numFont'>{data.sales}</i>
        </div>
        <div className='centreText'>
          <i className='pmd numFont'>Qty</i><br />
          <i><input className='pxlg numFont' defaultValue={data.quant} maxLength='10' /></i>
        </div>
      </div>
      <div className='centre up'>
        <i className='plg numFont'>{data.group}</i>
        <i className='pmd numFont'>{data.widget} Rev {data.ver}</i>
        <i className='pmd numFont'>{data.desc}</i>
      </div>
    </div>
  );
}

export default GeneralLabel;