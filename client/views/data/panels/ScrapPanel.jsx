import React, { useState, useEffect } from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
// import Pref from '/client/global/pref.js';

import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import ScrapTableAll from '/client/components/tables/ScrapTableAll.jsx';

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
  
  const sortList = scraps.sort((s1, s2)=> {
                    if (s1.scEntry.time < s2.scEntry.time) { return -1 }
                    if (s1.scEntry.time > s2.scEntry.time) { return 1 }
                    return 0;
                  });

  return(
    <AnimateWrap type='cardTrans'>
      <div className='section overscroll' key={1}>
        <div className='space'>

          <ScrapTableAll scrapData={sortList} />

        </div>
      </div>
    </AnimateWrap>
  );
};

export default ScrapPanel;