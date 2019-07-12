import React from 'react';
import moment from 'moment';
import business from 'moment-business';
import Pref from '/client/global/pref.js';

import ProgLayerBurndown from '/client/components/charts/ProgLayerBurndown.jsx';
import { AnonyUser } from '/client/components/smallUi/UserNice.jsx';

const TimeTab = ({
  a, b, user, 
  done, allDone,
  riverFlow, riverAltFlow
}) =>	{


///////////////////////////////////////
    const proto = Roles.userIsInRole(Meteor.userId(), 'nightly');
    let allthetimes = [];
    for(let item of b.items) {
      for(let entry of item.history) {
        if(entry.type === 'inspect' && entry.good === true) {
          allthetimes.push({
            key: entry.key,
            step: entry.step,
            time: entry.time,
            who: entry.who,
          });
        }
      }
    }
    const cronoTimes = allthetimes.sort((x1, x2)=> {
                        if (x1.time < x2.time) { return -1 }
                        if (x1.time > x2.time) { return 1 }
                        return 0;
                      });
    let sortedTimes = [];
    for(let step of riverFlow) {
      if(step.type === 'inspect') {
        const thesetimes = cronoTimes.filter( x => x.key === step.key );
        sortedTimes.push({
          step: step.step,
          entries: thesetimes
        });
      }
    }
////////////////////////////////////////


  return(
    <div className='space3v'>
      <div className='vmargin space'>
                
                
                
                
                
                
                
      </div>
        
      <div className='dropCeiling vmargin space'>
        <ProgLayerBurndown
          id={b._id}
          start={b.start}
          floorRelease={b.floorRelease}
          end={b.finishedAt}
          flowData={riverFlow}
          itemData={b.items.filter( x => x.alt === 'no' || x.alt === false )}
          title='Progress Burndown' />
                
        {b.riverAlt !== false &&  
          <ProgLayerBurndown
            id={b._id}
            start={b.start}
            floorRelease={b.floorRelease}
            end={b.finishedAt}
            flowData={riverAltFlow}
            itemData={b.items.filter( x => x.alt === 'yes' )}
            title='Alt Progress Burndown' />}
              
        <details className='footnotes'>
          <summary>Chart Details</summary>
          <p className='footnote'>
            The X axis is the number of serialized items remaining.
          </p>
          <p className='footnote'>
            The Y axis starts with the batch creation date and ends with 
            either today or the batch complete day. Weekends are skipped 
            entirely.
          </p>
          <p className='footnote'>
            A step that was added mid-run might not reach zero because 
            finished items would have skipped recording that step.
          </p>
        </details>
      </div>
      
      <div className='vmargin space'>
                
        <ul className='numFont'>
          {!b.tide ?
            <p className='centreText'>start/stop not enabled</p>
            :
            b.tide.map( (mov, index)=>{
              return(
                <li key={index} title={mov.tKey}>
                  <AnonyUser id={mov.who} />
                  - {moment(mov.startTime).format()}
                  - {mov.stopTime && moment(mov.stopTime).format()}
                </li>
            )})}
          </ul>
                
                
      </div>
      
              
        {proto ?
        <div>
          <ol>
            {sortedTimes.length === 0 ?
            <p className='centreText'>no inspections</p>
            :
            sortedTimes.map( (step, index)=>{
              return(
                <ol key={index}>
                  <b>{step.step} inspect</b>
                  {step.entries.map( (ding, inx)=>{
                    return(
                      <li key={inx}>
                        - {ding.time.toString()} - 
                        - {ding.who.slice(0, 3).toLowerCase()}
                      </li> );
                  })}
                </ol>
            )})}
          </ol>
        </div>
      : <div><p className='centreText'>raw time data available for on the "nightly" track</p></div>}
      
              
    </div>  
  );
};

export default TimeTab;