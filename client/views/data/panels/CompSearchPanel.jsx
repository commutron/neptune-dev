import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';


export default class CompSearchPanel extends Component	{

  render() {

  

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section' key={1}>
          <div className='space'>
            <h1 className='cap'>Starfish Components Search</h1>
            <hr />
  
            
  
  		    <br />
          <hr />
          </div>
          <br />
        </div>
      </AnimateWrap>
    );
  }
}