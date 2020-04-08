import React, { Fragment, useState, useEffect } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/uUi/NumStat.jsx';

const PhaseProgress = ({ 
  batchID, releasedToFloor,
  progCols, clientTZ, 
  app, isDebug
})=> {
  
  const [ progData, setProg ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('phaseProgress', batchID, clientTZ, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setProg( reply );
        isDebug && console.log(progData);
      }
    });
  }, [batchID]);
  
  const dt = progData;
 
  if(releasedToFloor !== false && dt && dt.batchID === batchID) {
    return(
      <Fragment>

        {dt.phaseSets.map( (phase, index)=>{
          if(phase.steps.length === 0) {
            return(
              <div key={batchID + phase + index + 'x'}>
               <i className='fade small label'>{phase.phase}</i>
              </div>
            );
          }else{
            const calPer = ( phase.count / (dt.totalItems * phase.steps.length) ) * 100;
            const calNum = calPer > 0 && calPer < 1 ? 
                            calPer.toPrecision(1) : Math.floor( calPer );
            isDebug && console.log(`${dt.batch} ${phase.phase} calNum: ${calNum}`);
            let fadeTick = calNum == 0 ? '0' :
                 calNum < 2 ? '1' :
                 calNum < 10 ? '5' :
                 calNum < 20 ? '10' :
                 calNum < 30 ? '20' :
                 calNum < 40 ? '30' :
                 calNum < 50 ? '40' :
                 calNum < 60 ? '50' :
                 calNum < 70 ? '60' :
                 calNum < 80 ? '70' :
                 calNum < 90 ? '80' :
                 calNum < 100 ? '90' :
                 '100';
            let redLine = calNum >= 100 && phase.ncLeft ? ' redRight' : '';
            let yellLine = calNum < 100 && phase.shLeft ? ' yellowLeft' : '';
            let niceName = phase.phase === 'finish' ?
                            Pref.isDone : phase.phase;
            return(
              <div 
                key={batchID + phase + index + 'g'} 
                className={'fillRight' + fadeTick + redLine + yellLine}>
                <NumStat
                  num={`${calNum}%`}
                  name={niceName}
                  title={`Steps: ${phase.steps.length}`}
                  color='whiteT'
                  size='big' />
            </div>
        )}})}
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {progCols.map( (phase, index)=>{
        return(
          <div key={batchID + phase + index + 'z'}>
            <i className='fade small label'>{phase}</i>
          </div>
      )})}
    </Fragment>
  );    
};

export default PhaseProgress;