import React, { Fragment, useState, useEffect, useRef } from 'react';
import Pref from '/client/global/pref.js';

import NumStat from '/client/components/tinyUi/NumStat';
import { min2hr, percentOf } from '/client/utility/Convert';

const BranchProgress = ({ 
  batchID, showTotal,
  progCols, progType, tBatch,
  filterBy, branchArea,
  updateTrigger, isDebug
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);
  
  const [ dtTotl, setTotl ] = useState(false);
  const [ dtProg, setProg ] = useState(false);
  
  useEffect( ()=> {
    if(!progType) {
      if(tBatch && tBatch.branchProg && !isNaN(tBatch.totalItems) ) {
        setProg( tBatch.branchProg );
        setTotl( tBatch.totalItems );
      }else{
        Meteor.call('branchProgress', batchID, (error, reply)=>{
          error && console.log(error);
          if( reply && mounted.current ) { 
            setProg( reply.branchProg );
            setTotl( reply.totalItems );
            isDebug && console.log(reply);
          }
        });
      }
    }else{
      if(tBatch && tBatch.branchTime && !isNaN(tBatch.totalItems) ) {
        setProg( tBatch.branchTime );
        setTotl( tBatch.totalItems );
      }else{
        Meteor.call('branchTaskTime', batchID, (error, reply)=>{
          error && console.log(error);
          if( reply && mounted.current ) { 
            setProg( reply.branchTime );
            setTotl( reply.totalItems );
            isDebug && console.log(reply);
          }
        });
      }
    }
  }, [progType, batchID, branchArea, filterBy, updateTrigger]);
 
  if(dtProg) {
    return(
      <Fragment>
        
        {showTotal &&
          <div>
            <NumStat
              num={dtTotl || ""}
              name='Total Items'
              title='Total Items Quantity'
              color='blueT'
              size='big' />
          </div>}
      
        {(branchArea ? dtProg.filter( b => b.branch === filterBy) : dtProg)
          .map( (br, index)=>{
            const niceName = br.branch;
            const bgt = !progType ? null : br.budget === null ? null : Math.round(br.budget); 
            const calNum = !progType ? br.calNum : percentOf((bgt || 0), br.time);
            
            isDebug && console.log(`${niceName} calNum: ${calNum}`);
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
            
            if(!progType) {
              if(br.steps === 0) {
                return(
                  <div key={batchID + br.branch + index + 'x'} title={br.branch}>
                   <i className='fade small label'>{br.branch}</i>
                  </div>
                );
              }else{
                let isRed = /* calNum >= 100 && */ br.ncLeft;
                let redLne = isRed ? ' redRight' : '';
                let redtxt = isRed ? `\nUnresolved ${Pref.nonCons}` : '';
                
                let isYllw = calNum < 100 && br.shLeft;
                let ylwLne = isYllw ? ' yellowLeft' : '';
                let ylwTxt = isYllw ? `\nBlocked by ${Pref.shortfalls}` : '';
              
                return(
                  <div 
                    key={batchID + niceName + index + 'g'} 
                    className={'fillRight' + fadeTick + redLne + ylwLne}
                    title={`${niceName}\nSteps: ${br.steps}${ylwTxt}${redtxt}`}>
                    <NumStat
                      num={isNaN(calNum) ? '' : `${calNum}%`}
                      name={niceName}
                      color='blackT'
                      size='big' />
                  </div>
                );
              }
            }else{
              return(
                <div 
                  key={batchID + niceName + index + 'b'} 
                  className={bgt !== null ? calNum > 100 ? 'warnRed' : 'fillUp' + fadeTick : br.time > 0 ? 'blueGlow' : ''}
                  title={`${niceName}\n${Math.round(br.time)} minutes verified\n${bgt || 0} minutes budgeted\n${isFinite(calNum) && calNum >= 0 ? calNum+'%' : ''}`}>
                  <NumStat
                    num={isNaN(br.time) || br.time === 0 ? '' : `${min2hr(br.time)} 𝗁𝗋𝗌`}
                    name={niceName}
                    color='blackT'
                    size='big' />
                </div>
              );
            }
        })}
      </Fragment>
    );
  }
  
  return(
    <Fragment>
      {progCols.map( (branch, index)=>{
        return(
          <div key={batchID + branch + index + 'z'} title={branch}>
            <i className='fade small label'>{branch}</i>
          </div>
      )})}
    </Fragment>
  );    
};

export default BranchProgress;