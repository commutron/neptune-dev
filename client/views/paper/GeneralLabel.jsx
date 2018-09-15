import React from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import moment from 'moment';

function GeneralLabel({ batch, data }) {
  return(
    <div className='noCopy'>
      <div className='centre'>
        <div className='centreText'>
          <i className='pxxlg numFont'>{batch}</i>
          <i className='pmd numFont'>{data.sales}</i>
        </div>
        <div className='centre up'>
          <i className='pxlg numFont'>{data.group}</i>
          <i className='pmd numFont'>{data.widget} Rev {data.ver}</i>
          <i className='pmd numFont'>{data.desc}</i>
        </div>
        <div className='centreText'>
          <i className='psm numFont'>Qty</i><br />
          <i><input className='plg numFont' defaultValue={data.quant} maxLength='10' /></i>
        </div>
      </div>
    </div>
  );
}

export default GeneralLabel;