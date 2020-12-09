import React, { useRef, useState, useEffect, Fragment } from 'react';
// import Pref from '/client/global/pref.js';
import moment from 'moment';
// import 'moment-timezone';
import { 
  VictoryLine,
  VictoryScatter,
  VictoryChart, 
  VictoryAxis,
  VictoryLegend,
  VictoryZoomContainer
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const OnTargetTrend = ({ app, isDebug, isNightly })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  
  const [ working, workingSet ] = useState(false);
  
  const [ tgglSpan, tgglSpanSet ] = useState( 'month' );
  const [ durrState, durrSet ] = useState( 1 );
  
  const [ fillDT, fillSet ] = useState( blank );
              
  useEffect( ()=>{
    return () => { thingMounted.current = false };
  }, []);
  
  function runLoop(tspan) {
    workingSet(true);
    tgglSpanSet(tspan);
    
    const dur = moment.duration(moment().diff(moment(app.createdAt)));
    const durCln = tspan == 'month' ?
                    parseInt( dur.asMonths(), 10 ) :
                    parseInt( dur.asWeeks(), 10 );
    durrSet( durCln );
    
    Meteor.call('cycleWeekRate', 'doneItem', durCln, tspan, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);
          fillSet(re);
          workingSet(false);
        }
      }
    });
  }
  
  return(
    <div className=''>
      
      <h4>Long Calculation, Please wait for results. !! Outstanding Performance Issues !!</h4>
        
      <div className='rowWrap'>
        {working ?
          <b><i className='fas fa-spinner fa-lg fa-spin'></i></b> :
          <i><i className='fas fa-spinner fa-lg'></i></i>
        }
  
        <button
          className='action clearBlack gap'
          onClick={()=>runLoop('month')}
          disabled={working}
        >Run Monthly</button>
        
        <button
          className='action clearBlack gap'
          onClick={()=>runLoop('week')}
          disabled={working}
        >Run Weekly</button>
        
        <span className='flexSpace' />
        
      </div>

      <div style={{backgroundColor:'white'}}>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 25, bottom: 25, left: 30}}
          domainPadding={{x: 10, y: 40}}
          height={250}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1/0.1}}
          />}
        >
        
        <VictoryLegend x={0} y={0}
        	title=""
          labels={{ fontSize: 15 }}
          titleOrientation="left"
          gutter={10}
          symbolSpacer={3}
          borderPadding={{ top: 4, bottom: 0 }}
          orientation="horizontal"
          style={{ 
            title: { padding: 2, fontSize: 10 } 
          }}
          data={[
          { name: "Serialized Item", symbol: { fill: "rgb(142, 68, 173)" } }
          ]}
          
        />
          <VictoryAxis
            dependentAxis
          />
          <VictoryAxis
            fixLabelOverlap={true}
            tickFormat={(t) => 
              tgglSpan == 'month' ?
              moment().subtract(durrState, 'month').add(t, 'month').format('MMM-YYYY') :
              `w${moment().subtract(durrState, 'week').add(t, 'week').format('w-YYYY')}`}
          />
          
            <VictoryLine
              data={fillDT}
              style={{ data: { stroke: 'rgb(155, 89, 182)' } }}
              // interpolation="catmullRom"
              animate={{
                duration: 500,
                onLoad: { duration: 500 }
              }}
            />
            <VictoryScatter 
              data={fillDT}
              style={{ data: { fill: 'rgb(142, 68, 173)' } }}
              size={2}
              animate={{
                duration: 500,
                onLoad: { duration: 500 }
              }}
            />
           
          </VictoryChart>
          
      </div>
      {/*<p className='small rightText'>Gaps in the data are intentional. Indicate when no orders were completed</p>
      */}
    </div>
  );
};

export default OnTargetTrend;