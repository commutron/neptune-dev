import React, { Fragment, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import NumStat from '/client/components/tinyUi/NumStat';

const BranchProgress = ({ 
  batchID, showTotal,
  progCols,
  app, filterBy, branchArea,
  updateTrigger, isDebug
})=> {
  
  const [ dt, setProg ] = useState(false);
  
  useEffect( ()=> {
    const branchOnly = branchArea ? filterBy : false;
    Meteor.call('branchProgress', batchID, branchOnly, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setProg( reply );
        isDebug && console.log(reply);
      }
    });
  }, [batchID, branchArea, filterBy, updateTrigger]);
 
  if(dt && dt.batchID === batchID) {
    return(
      <Fragment>
        
        {showTotal &&
          <div>
            <NumStat
              num={dt.totalItems}
              name='Total Items'
              title=''
              color='blueT'
              size='big' />
          </div>}
      
        {dt.branchSets.map( (branch, index)=>{
          if(branch.steps === 0) {
            return(
              <div key={batchID + branch + index + 'x'}>
               <i className='fade small label'>{branch.branch}</i>
              </div>
            );
          }else{
            const calNum = branch.calNum;
            isDebug && console.log(`${dt.batchID} ${branch.branch} calNum: ${calNum}`);
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
            let isRed = calNum >= 100 && branch.ncLeft;
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