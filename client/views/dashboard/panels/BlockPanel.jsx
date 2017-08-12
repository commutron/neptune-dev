import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import BlockTable from '../../../components/bigUi/BlockTable.jsx';

//requires batchData
export default class BlockPanel extends Component	{

  render() {

    let b = this.props.batchData;

    return (
      <SlideDownWrap>
        <div className='card' key={2}>
          <div className='space'>
            <h1 className='cap'>{Pref.block}s</h1>
            <hr />
  
            <BlockTable batchData={b} />
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </SlideDownWrap>
    );
  }
}