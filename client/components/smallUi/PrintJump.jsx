import React from 'react';

const PrintJump = ({ batchNum, tBatch, title, iText }) => {
  
  if(!tBatch) {
    return ( 
      <div className='overButton'>
        <small className='darkgrayT'>print</small>
      </div>
    );
  }
  
  const isWhat = tBatch.isWhat;
  
  const flink = '/print/generallabel/' + batchNum +
                '?group=' + isWhat[0] +
                  '&widget=' + isWhat[1] +
                  '&ver=' + isWhat[2].slice(2) +
                  ( tBatch.rad ? '💥' : ''  ) +
                  '&desc=' + tBatch.describe +
                  '&sales=' + tBatch.salesOrder +
                  '&quant=' + tBatch.quantity; 
  
  return(
    <div className='overButton'>
			<a 
			  title={title}
			  href={flink}
			 >
        <label>
          <n-fa1>
            <i className='fa-solid fa-print darkgrayT'></i>
          </n-fa1>
          {iText && <span className='label darkgrayT'>{title}</span>}
        </label>
      </a>
    </div>
  );
};

export default PrintJump;