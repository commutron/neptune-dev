import React from 'react';
import ReactDOM from 'react-dom';
import Barcode from 'react-barcode';
import moment from 'moment';

function GeneralLabel({ batch, data }) {
  return(
    <div className='noCopy'>
      <div className='centre'>
        <div className='centreRow'>
          <div className='centreText'>
            <i className='pxlg'>{batch}</i>
            {/*<i className='pmd'>{data.sales}</i>*/}
          </div>
          <div className='centreText'>
            <i className='psm'>Qty</i><br />
            <i><input className='plg' defaultValue={data.quant} maxLength='5' /></i>
          </div>
        </div>
        <div className='centre up'>
          <i className='plg'>{data.group}</i>
          <i className='pmd'>{data.widget} Rev {data.ver}</i>
          <i className='pmd'>{data.desc}</i>
        </div>
        <div className='centreRow'>
          <div className='centreText'>
            <i className='psm'>Ready by</i><br />
            <i><input className='plg' defaultValue='?' maxLength='14' /></i>
          </div>
          <div className='centreText'>
            <i className='psm'>Start by</i><br />
            <i><input className='plg' defaultValue='?' maxLength='14' /></i>
          </div>
          <div className='centreText'>
            <i className='psm'>Ship by</i><br />
            <i>
              <input 
                className='plg'
                defaultValue={moment(data.fulfill, "YYYY-MM-DD").format("MMM D")} 
                maxLength='14' />
            </i>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralLabel;