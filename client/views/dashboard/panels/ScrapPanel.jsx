import React, {Component} from 'react';
import SlideDownWrap from '/client/components/tinyUi/SlideDownWrap.jsx';
import Pref from '/client/global/pref.js';

import ScrapTable from '../../../components/bigUi/ScrapTable.jsx';

//requires batchData
export default class ScrapPanel extends Component	{

  render() {

    let b = this.props.batchData;

    return (
      <SlideDownWrap>
        <div className='card' key={1}>
          <div className='space'>
            <h1 className='cap'>{Pref.scrap} {Pref.item}s</h1>
            <hr />
  
            <ScrapTable batchData={b} />
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </SlideDownWrap>
    );
  }
}