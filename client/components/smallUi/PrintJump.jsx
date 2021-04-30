import React, { useState, useEffect } from 'react';

const PrintJump = ({ batchNum, title, iText }) => {
  
  const [ flink, flinkSet ] = useState('');
  
  useEffect( ()=>{
    Meteor.call('getBatchPrintLink', batchNum, (err, re)=> {
      err && console.log(err);
      if(re) {
        flinkSet(re);
      }
    });
  }, []);
  
  return(
    <div className='overButton'>
			<a 
			  title={title}
			  href={flink}
			 >
        <label>
          <n-fa1>
            <i className='fas fa-print darkgrayT'></i>
          </n-fa1>
          {iText && <span className='label darkgrayT'>{title}</span>}
        </label>
      </a>
    </div>
  );
};

export default PrintJump;