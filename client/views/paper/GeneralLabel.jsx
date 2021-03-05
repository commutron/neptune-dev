import React from 'react';
import ReactDOM from 'react-dom';
// import moment from 'moment';
// import Pref from '/client/global/pref.js';

const GeneralLabel = ({ batch, data })=> (
  <div className='noCopy'>
    <div className='centre'>
      <div className='evenRow'>
        <div className='centreText'>
          <i className='pxlg'>{batch}</i>
        </div>
        <div className='centreText'>
          <i className='psm'>Qty</i><br />
          <i><input className='plg' defaultValue={data.quant} maxLength='5' /></i>
        </div>
      </div>
      <div className='centre up'>
        <i className='plg'>{data.group}</i>
        <i className='pmd'>{data.widget} Rev. {data.ver}</i>
        <i className='psm'>{data.desc}</i>
        <i className='psm'>{data.sales}</i>
      </div>
    </div>
  </div>
);

export default GeneralLabel;