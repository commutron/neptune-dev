import React, { Fragment, useState, useEffect } from 'react';
// import moment from 'moment';
import Pref from '/client/global/pref.js';
import NumStat from '/client/components/tinyUi/NumStat.jsx';

const BranchProgress = ({ 
  batchID,
  progCols,
  app, filterBy, branchArea,
  isDebug
})=> {
  
  const [ progData, setProg ] = useState(false);
  
  useEffect( ()=> {
    const branchOnly = branchArea ? filterBy : false;
    Meteor.call('branchProgress', batchID, branchOnly, (error, reply)=>{
      error && console.log(error);
      if( reply ) { 
        setProg( reply );
        isDebug && console.log(progData);
      }
    });
  }, [batchID, branchArea, filterBy]);
  
  const dt = progData;
 
  if(dt && dt.batchID === batchID) {
    return(
      <Fragment>

        {dt.branchSets.map( (branch, index)=>{
          if(branch.steps.length === 0) {
            return(
              <div key={batchID + branch + index + 'x'}>
               <i className='fade small label'>{branch.branch}</i>
              </div>
            );
          }else{
            const calPer = ( branch.count / (dt.totalItems * branch.steps.length) ) * 100;
            const calNum = calPer > 0 && calPer < 1 ? 
                            calPer.toPrecision(1) : Math.floor( calPer );
            isDebug && console.log(`${dt.batch} ${branch.branch} calNum: ${calNum}`);
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
            let redLine = calNum >= 100 && branch.ncLeft ? ' redRight' : '';
            let yellLine = calNum < 100 && branch.shLeft ? ' yellowLeft' : '';
            let niceName = branch.branch;
            return(
              <div 
                key={batchID + branch + index + 'g'} 
                className={'fillRight' + fadeTick + redLine + yellLine}>
                <NumStat
                  num={isNaN(calNum) ? '' : `${calNum}%`}
                  name={niceName}
                  title={`Steps: ${branch.steps.length}`}
                  color='whiteT'
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