import React from 'react';
import moment from 'moment';

const TestFails = ({ fails })=> {
  const dt = fails.reverse();
  let styD = {
    paddingLeft: '10px',
    paddingBottom: '5px',
    backgroundColor: 'transparent',
    borderLeft: '5px solid var(--pomegranate)',
  };
  let styS = {
    textIndent: '-15px'
  };
  return (
    <div>
      {dt.map( (entry, index)=>{
        return(
          <details key={index} style={styD}>
            <summary style={styS}>
              Fail {moment(entry.time).calendar()}
            </summary>
            {entry.comm}
          </details>
      )})}
    </div>
  );
};

export default TestFails;