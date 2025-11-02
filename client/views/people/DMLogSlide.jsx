import React, { Fragment, useState } from 'react';
import Pref from '/client/global/pref.js';
import moment from 'moment';
import { chunkArray } from '/client/utility/Convert';

import PrintThis from '/client/components/tinyUi/PrintThis';
import PagingSelect from '/client/components/tinyUi/PagingSelect';
import UserName from '/client/utility/Username.js';


const DMLogSlide = ()=> {
  
  const [ workState, workSet ] = useState(false);
  const [ logState, logSet ] = useState(false);
  const [ pageState, pageSet ] = useState(0);
  
  function getDMlog() {
    workSet(true);
    Meteor.call('fetchDMLog', (err, re)=>{
      err && console.log(err);
      if(re) {
        logSet( JSON.parse(re).toReversed() );
        workSet(false);
      }
    });
  }
  
  const inpieces = !logState ? [] : chunkArray(logState, Pref.pagingSize);
  
  return(
    <div className='vmargin uspace'>
      
      <div className='noPrint rowWrap'>
        <span className='flexSpace' />
        <PrintThis />
      </div>
      
      {!logState ?
        <div className='centreText'>
          <p className='numFont med'>Direct user to user messages are logged for 90 days for the purposes of management oversight and user safety.</p>
          <p className='numFont med'>Content of these messages may be subject to Commutron Ltd. policies, and Provincial and Federal privacy laws.</p>
          <p className='numFont med'>View, screenshot, print, copy, distribute, store and discard message logs responsibly.</p>
          <p>
            <button
              className='action nSolid vmargin'
              onClick={()=>getDMlog()}
            >Access Direct Messages Log</button>
          </p>
          <p>{workState && <n-fa0><i className="fa-solid fa-spinner fa-2x fa-spin"></i></n-fa0>}</p>
        </div>
      :
      <Fragment>
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)}
        />
            
        <table className='wide cap'>
          <thead>
            <tr style={{width:'100%',margin:'0 auto',fontFamily:'Verdana, sans-serif',height:'50px'}}>
              <th colSpan={4} style={{padding:'0 10px'}}>
                <div style={{textAlign:'center',letterSpacing:'1px',fontWeight:'600',fontSize:'18px'}}>
                  <span className='noPrint'>Message Logs Are Automatically Deleted From Server After 90 days.</span>
                  <n-print><em>Page {pageState+1}/{inpieces.length}</em> - Destroy Paper Logs Of All Messages Older Than 90 Days.</n-print>
                </div>
              </th>
            </tr>
            <tr className='leftText'>
              <th>Sent (Local Time)</th>
              <th>From</th>
              <th>To</th>
              <th className='noRightBorder'>Content</th>
            </tr>
          </thead>
          {(inpieces[pageState] || []).map( (log, index)=>(
            <tbody key={index}>
              <tr className='clean'>
                <td>{moment(log.time).format('hh:mm A, MMM DD YYYY')}</td>
                <td className='wordBr'>{UserName(log.fromId)}</td>
                <td className='wordBr'>{UserName(log.toId)}</td>
                <td className='noRightBorder'>{log.content}</td>
              </tr>
            </tbody>
          ))}
        </table>
      
        <PagingSelect 
          multiArray={inpieces}
          isSet={pageState}
          doChange={(e)=>pageSet(e)}
        />
      </Fragment>
      }
        
    </div>
  );
};

export default DMLogSlide;