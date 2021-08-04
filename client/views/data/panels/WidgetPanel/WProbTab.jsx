import React, { useRef, useState, useEffect } from 'react';
import Pref from '/client/global/pref.js';

import TabsLite from '/client/components/smallUi/Tabs/TabsLite';
import WidgetMultiBatchBar from '/client/components/charts/WidgetMultiBatchBar';
import FailScatterChart from '/client/components/charts/FailScatterChart';
import AvgStat from '/client/components/tinyUi/AvgStat';

const WProbTab = ({ widgetData, batches, app })=> {
  
  const mounted = useRef(true);
  
  const [ rate, rateSet ] = useState([0,'flat']);
  
  useEffect( ()=>{
    Meteor.call('nonConBatchTrend', widgetData._id, (err, reply)=>{
      err && console.log(err);
      reply && mounted.current ? 
        rateSet(reply) : null;
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  return(
    <div className='space'>
      <div className='cardSelf'>
      
        <TabsLite 
          tabs={ [ 
            <i className="fas fa-exclamation-circle fa-fw"></i>,
            <i className="fas fa-exclamation-triangle fa-fw"></i>,
            <i className="fas fa-microscope fa-fw"></i>,
          ] }
          names={[ 
            Pref.nonCons,
            Pref.shortfalls,
            'test failures'
          ]}>
              
          <div>      
            <div className='rowWrapR vmarginquarter'>
              <AvgStat num={rate[0]} trend={rate[1]} type='NC Rate' flip={true} />
            </div>
          
            <WidgetMultiBatchBar 
              widgetId={widgetData._id}
              fetchFunc='nonConBatchesTypes'
            />
          </div>
        
          <WidgetMultiBatchBar 
            widgetId={widgetData._id}
            fetchFunc='shortWidgetBatches'
            leftpad={60}
          />
          
          <FailScatterChart
            fetchFunc='getBatchFailPlot'
            idLimit={widgetData._id}
            height={200}
          />
      
        </TabsLite>
        
      </div>
    </div>
  );
};

export default WProbTab;