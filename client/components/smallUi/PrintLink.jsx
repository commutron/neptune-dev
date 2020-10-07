import React, { useState, useEffect } from 'react';

const PrintLink = ({ batchNum, title, iText }) => {
  
  const [ flink, flinkSet ] = useState('');
  
  // const fetchLink = ()=> {
  //   Meteor.call('getBatchPrintLink', batchNum, (err, re)=> {
  //     err && console.log(err);
  //     if(re) {
  //       FlowRouter.go(re);
  //       ReactiveVar.set(re);
  //     }
  //   });
  // };
  useEffect( ()=>{
    Meteor.call('getBatchPrintLink', batchNum, (err, re)=> {
      err && console.log(err);
      if(re) {
        flinkSet(re);
      }
    });
  }, []);
  
  return(
    <a
      title={title}
      className='transparent'
      //onClick={()=>fetchLink()}
      href={flink}
      >
      <label className='navIcon actionIconWrap taskLink'>
        <i className={`fas fa-print`} data-fa-transform='down-2 shrink-2'></i>
      </label>
      {iText && <span className={'infoSquareLabel whiteT'}>{title}</span>}
    </a>
  );
};

export default PrintLink;










