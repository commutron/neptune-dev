import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import Spin from '/client/components/tinyUi/Spin.jsx';
import { FocusSelect, FilterSelect } from '/client/components/smallUi/ToolBarTools';

import FailWidgetTable from '/client/components/tables/FailWidgetTable';


const TestFailComparePanel = ({ batchData, app })=> {
  
  const [ fails, failsSet ] = useState(false);
  
  const [ groupState, groupSet ] = useState(false);
  const [ widgetState, widgetSet ] = useState(false);
  
  const [ workingList, workingListSet ] = useState([]);
  
  
  useEffect( ()=> {
    Meteor.call('testFailWidgets', (error, reply)=> {
      error && console.log(error);
      failsSet( reply );
    });
  }, []);
  
  useEffect( ()=>{
    if(Array.isArray(fails)) {
      const byGroup = !groupState || groupState === 'false' ? fails :
                fails.filter( r => r.group.toUpperCase() === groupState );
      
      const byWidget = !widgetState || widgetState === 'false' ? byGroup :
                byGroup.filter( r => r.widget.toUpperCase() === widgetState );
      
     
      // const sortList = byWidget.sort((f1, f2)=> {
      //         let f1t = f1.tfEntries[f1.tfEntries.length-1].time;
      //         let f2t = f2.tfEntries[f2.tfEntries.length-1].time;
      //         return f1t < f2t ? 1 : f1t > f2t ? -1 : 0;
      // });
                  
      workingListSet(byWidget);
    }
                    
  }, [fails, groupState, widgetState]);
  
  function changeGroup(val) {
    groupSet(val);
    widgetSet(false);
  }
  
  if(!fails) {
    return(
      <div className='centreBox'>
        <Spin />
      </div>
    );
  }
  
  const gList = _.uniq( Array.from(fails, r => r.group.toUpperCase() ) ).sort();
  const wList = _.uniq( Array.from(fails, r => 
                    r.group.toUpperCase() === groupState && r.widget.toUpperCase()
                ) ).filter(f=>f).sort();
  
 
  return(
    <div className='section overscroll' key={1}>
      <div className='space'>
        
        <div className='comfort'>
          
          <span className='balancer gapsC'>
            <FocusSelect
              gList={gList}
              focusState={groupState}
              changeFunc={(e)=>changeGroup(e.target.value)}
            />
            <FilterSelect
              unqID='fltrTYPE'
              title={`Filter ${Pref.widgets}`}
              selectList={wList}
              selectState={widgetState}
              falsey={`All ${Pref.widgets}`}
              changeFunc={(e)=>widgetSet(e.target.value)}
            />
          
          </span>
            
        </div>
        
        {!groupState ?
          <div className='centreText'>
            <i>Select Group</i>
          </div>
    
         :     
            <FailWidgetTable failData={workingList} />
        }
      
          
      </div>
    </div>
  );
};

export default TestFailComparePanel;