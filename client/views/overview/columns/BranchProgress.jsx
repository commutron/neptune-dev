import React, { Fragment, useState, useEffect, useRef } from 'react';
import Pref from '/client/global/pref.js';

import NumStat from '/client/components/tinyUi/NumStat';

const BranchProgress = ({ 
  batchID, showTotal,
  progCols, progType, tBatch,
  app, filterBy, branchArea,
  updateTrigger, isDebug
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ dtTotl, setTotl ] = useState(false);
  const [ dtProg, setProg ] = useState(false);
  
  useEffect( ()=> {
    if(tBatch && tBatch.branchProg && !isNaN(tBatch.totalItems) ) {
      setProg( tBatch.branchProg );
      setTotl( tBatch.totalItems );
      
      console.log(tBatch.branchTime);
    }else{
      Meteor.call('branchProgress', batchID, (error, reply)=>{
        error && console.log(error);
        if( reply && mounted.current ) { 
          setProg( reply.branchProg );
          setTotl( reply.totalItems );
          isDebug && console.log(reply);
        }
      });
      
      // branchTaskTime(batchID,
    }
  }, [batchID, branchArea, filterBy, updateTrigger]);
 
  if(dtTotl && dtProg) {
    return(
      <Fragment>
        
        {showTotal &&
          <div>
            <NumStat
              num={dtTotl}
              name='Total Items'
              title=''
              color='blueT'
              size='big' />
          </div>}
      
        {(branchArea ? dtProg.filter( b => b.branch === filterBy) : dtProg)
          .map( (branch, index)=>{
          if(branch.steps === 0) {
            return(
              <div key={batchID + branch + index + 'x'}>
               <i className='fade small label'>{branch.branch}</i>
              </div>
            );
          }else{
            const calNum = branch.calNum;
            isDebug && console.log(`${branch.branch} calNum: ${calNum}`);
            let fadeTick = isNaN(calNum) ? '' :
               calNum == 0 ? '0' :
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
            let isRed = /* calNum >= 100 && */ branch.ncLeft;
            let redLne = isRed ? ' redRight' : '';
            let redtxt = isRed ? `\nUnresolved ${Pref.nonCons}` : '';
            
            let isYllw = calNum < 100 && branch.shLeft;
            let ylwLne = isYllw ? ' yellowLeft' : '';
            let ylwTxt = isYllw ? `\nBlocked by ${Pref.shortfalls}` : '';
            
            const ttlText = `Steps: ${branch.steps}${ylwTxt}${redtxt}`;

            let niceName = branch.branch;
            return(
              <div 
                key={batchID + branch + index + 'g'} 
                className={'fillRight' + fadeTick + redLne + ylwLne}
                title={ttlText}>
                <NumStat
                  num={isNaN(calNum) ? '' : `${calNum}%`}
                  name={niceName}
                  color='blackT'
                  size='big' />
            </div>
        )}})}
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {progCols.map( (branch, index)=>{
        return(
          <div key={batchID + branch + index + 'z'}>
            <i className='fade small label'>{branch}</i>
          </div>
      )})}
    </Fragment>
  );    
};

export default BranchProgress;