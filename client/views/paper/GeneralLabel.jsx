import React from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import moment from 'moment';

function GeneralLabel({ batch, data }) {
  return(
    <div className='noCopy'>
      <div className='centreRow'>
        <div className='centre'>
          <i className='pxxlg'>{batch}</i>
          {/*<Barcode id='barcode' value={batch} format='CODE39' text=' ' width={1.25} height={20} margin={1} />*/}
        </div>
        <span className='bffr'></span>
        <div className='centreText'>
          <i className='pmd'>Qty</i><br />
          <i><input className='pxlg' defaultValue={data.quant} maxLength='10' /></i>
        </div>
        <span className='bffr'></span>
      </div>
      <div className='centre up'>
        <i className='plg'>{data.group}</i>
        <i className='pmd'>{data.widget} Rev {data.ver}</i>
        <i className='pmd'>{data.desc}</i>
      </div>
      <div className='centreRow'>
        <div className='centreText yellowT'>
          <i className='pmd'>Release By</i><br />
          <i><input className='yellowT plg' defaultValue='?' maxLength='14' /></i>
        </div>
        <div className='centreText'>
          <i className='pmd'>Ship by</i><br />
          <i className='pxlg'>{moment(data.date, "YYYY-MM-DD").format("ddd MMM Do")}</i>
        </div>
      </div>
    </div>
  );
}

export default GeneralLabel;