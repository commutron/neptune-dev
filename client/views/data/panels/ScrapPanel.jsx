import React, { useState, useEffect } from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import ScrapTable from '/client/components/tables/ScrapTable.jsx';

const ScrapPanel = (props)=> {
  
  const [ scraps, scrapsSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('scrapItems', (error, reply)=> {
      error && console.log(error);
      scrapsSet( reply );
    });
  }, []);
    
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
};

export default ScrapPanel;