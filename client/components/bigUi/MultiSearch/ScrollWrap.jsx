import React, { useState, useEffect } from 'react';

import SerialResult from '/client/components/bigUi/MultiSearch/SerialResult';
import BatchResult from '/client/components/bigUi/MultiSearch/BatchResult';


const ScrollWrap = ({ tggl, queryState, resultState }) => {
  
  const [ scrollY, scrollYSet ] = useState(50);
  
  function handleScroll(e) {
    if(e.target.scrollTop > scrollY) {
      scrollYSet(e.target.scrollTop / 2);
    }
  }
  
  useEffect( ()=> {
    scrollYSet(50);
  }, [queryState]);
  
  useEffect( ()=> {
    if(resultState.length > 50) {
      document.getElementById('queryResults')
        .addEventListener('scroll', handleScroll);
    }
    return ()=> {
      if(resultState.length > 50) {
        document.getElementById('queryResults')
                    .removeEventListener('scroll', handleScroll);
      }
    };
  }, []);
  
  return(
    <div id='queryResults' className='fixedResults forceScrollStyle wide max875'>
      {tggl ?
        <BatchResult
          queryState={queryState}
          resultState={resultState}
          listLimit={scrollY} 
        />
      :
        <SerialResult
          queryState={queryState}
          resultState={resultState}
          listLimit={scrollY} 
        />
      }
    </div>
  );
};

export default ScrollWrap;