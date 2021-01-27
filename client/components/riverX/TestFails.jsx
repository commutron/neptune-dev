import React, { Fragment } from 'react';
import moment from 'moment';

const TestFails = ({ fails })=> {
  
  let styD = {
    paddingLeft: '10px',
    paddingBottom: '5px',
    backgroundColor: 'transparent',
    borderLeft: '0.5vmax solid var(--pomegranate)',
  };
  
  const dt = fails.sort();
  
  return(
    <Fragment>
      {dt.map( (entry, index)=>{
        return(
          <details style={styD} className='testFail'>
            <summary>
              Fail {moment(entry.time).calendar()}
            </summary>
            {entry.comm}
          </details>
      )})}
    </Fragment>
  );
};

export default TestFails;