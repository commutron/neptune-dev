import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';

const DocsReadySlide = ({ traceDT, app })=> {
  
  const [ liveState, liveSet ] = useState(false);
  
  useEffect( ()=>{
    Meteor.setTimeout( ()=> {
      Meteor.call('updateLiveNoise');
    },1000);
  }, []);
  
  useEffect( ()=>{
    let normal = [];
    for(let tBatch of traceDT) {
      
      const dS = tBatch.docStatus || null;
      const dL = dS?.url || undefined;

      if(!dS || normal.find( f => f[4] === dL )) {
        null;
      }else{
        const dT = dS?.title || undefined;
        const dV = !dS ? null : dS.topLevelV;
        const mV = !dS ? null : dS.modulesV;
        const lM = !dS ? null : dS.last_modified;
        normal.push([ dT, dV, mV, lM, dL ]);
      }
    }
    
    const ordered = normal.sort((d1, d2)=> {
      if (d1[0] > d2[0]) { return 1 }
      if (d1[0] < d2[0]) { return -1 }
      return 0;
    });
    
    liveSet(ordered);
  
  /*
  function callDocs() {
    return new Promise(() => {
      fetch("http://localhost/pisces-staging/customers/mcrn/test-instruction.json", {})
      .then(function(response) {
        return response.json();
      })
      .then(function(articles) {
        console.log(articles);
      });
    });
  }*/
  }, [traceDT]);
  
  return(
    <div className='space5x5 forceScrollStyle'>
      <h3>Required Instruction Docs for Live {Pref.XBatchs}</h3>
      <div className=''>
        {!liveState ?
          <Spin />
          :
          <table className='wide numFont'>
            <thead>
              <tr className='leftText'>
                <th>Doc</th>
                <th>Top Page</th>
                <th>All Modules</th>
                <th>Last Modified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {liveState.map( (entry, index)=>{
              return(
                <tr key={index}>
                  <td>{entry[0]}</td>
                  <td className={`bold ${entry[1] ? 'greenT' : 'orangeT'}`}>{entry[1] ? "Verified" : "Unverified"}</td>
                  <td className={`bold ${entry[2] ? 'greenT' : 'orangeT'}`}>{entry[2] ? "Verified" : "Unverified"}</td>
                  <td>{entry[3] ? moment(entry[3]).format("MMM DD YYYY, hh:mm A (ddd)") : null}</td>
                  <td>{entry[4] ? <a href={entry[4]} target="_blank">Open</a> : null}</td>
                </tr>
              )})}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
};

export default DocsReadySlide;