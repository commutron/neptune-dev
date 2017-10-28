import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import BlockTable from '../../../components/bigUi/BlockTable.jsx';

//requires batchData
export default class BlockPanel extends Component	{

  render() {

    let b = this.props.batchData;

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={2}>
          <div className='space'>
            <h1 className='cap'>{Pref.block}s</h1>
            <hr />
  
            <BlockTable batchData={b} />
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </AnimateWrap>
    );
  }
}