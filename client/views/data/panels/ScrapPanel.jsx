import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import ScrapTable from '/client/components/bigUi/ScrapTable.jsx';

export default class ScrapPanel extends Component	{
  
  constructor() {
    super();
    this.state = {
      scraps: false,
    };
  }
  
  getScraps() {
    Meteor.call('scrapItems', (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({ scraps: reply });
    });
  }

  render() {
    
    const scraps = this.state.scraps;
    
    if(!scraps) {
      return(
        <CalcSpin />
      );
    }

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={1}>
          <div className='space'>
            <h1 className='cap'>{Pref.scrap} {Pref.item}s</h1>
            <hr />
  
            <ScrapTable batchData={scraps} />
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </AnimateWrap>
    );
  }
  componentDidMount() {
    this.getScraps();
  }
}