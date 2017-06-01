import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import ShortTable from '../../../components/bigUi/ShortTable.jsx';

//requires batchData
export default class ShortPanel extends Component	{

  render() {

    let b = this.props.batchData;

    return (
      <SlideDownWrap>
        <div className='card'>
          <div className='space'>
            <h1 className='cap'>{Pref.missingPart}s</h1>
            <hr />
  
            <ShortTable batchData={b} />
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </SlideDownWrap>
    );
  }
}