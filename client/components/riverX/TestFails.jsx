import React, { Fragment } from 'react';
import moment from 'moment';

const TestFails = ({ fails })=> {
  
  const dt = fails.sort();
  
  return(
    <Fragment>
      {dt.map( (entry, index)=>{
        return(
          <details 
            key={'testfail'+index}
            className='testFail'
          >
            <summary>
              Failed {moment(entry.time).calendar()}
            </summary>
            {entry.comm}
          </details>
      )})}
    </Fragment>
  );
};

export default TestFails;