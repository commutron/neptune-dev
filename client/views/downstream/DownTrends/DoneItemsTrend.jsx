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

const DoneItemsTrend = ({ app, isDebug, isNightly })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  
  const [ working, workingSet ] = useState(false);
  const [ tgglSpan, tgglSpanSet ] = useState( false );
  const [ fillDT, fillSet ] = useState( blank );
              
  useEffect( ()=>{
    return () => { thingMounted.current = false };
  }, []);
  
  function runLoopLite(cName, tspan) {
    workingSet(true);
    
    const dur = moment.duration(moment().diff(moment(app.createdAt)));
    const durCln = tspan == 'month' ?
                    parseInt( dur.asMonths(), 10 ) :
                    parseInt( dur.asWeeks(), 10 );
    
    Meteor.call('cycleLiteRate', cName, durCln, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);
          fillSet(re);
          tgglSpanSet(tspan);
          workingSet(false);
        }
      }
    });
  }
  
  return(
    <div className=''>
      
      <div className='rowWrap'>
        {working ?
          <b><i className='fas fa-spinner fa-lg fa-spin'></i></b> :
          <i><i className='fas fa-spinner fa-lg'></i></i>
        }
        
        <button
          className='action clearBlack gap'
          onClick={()=>runLoopLite('doneUnitLiteMonths', 'month')}
          disabled={working}
        >By Month</button>
        
        <button
          className='action clearBlack gap'
          onClick={()=>runLoopLite('doneUnitLiteWeeks', 'week')}
          disabled={working}
        >By Week</button>
        
        <span className='flexSpace' />
        
      </div>

      <div style={{backgroundColor:'white'}}>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 25, bottom: 25, left: 50}}
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
          { name: "Serialized Units", symbol: { fill: "rgb(142, 68, 173)" } }
          ]}
          
        />
          <VictoryAxis
            dependentAxis
          />
          <VictoryAxis
            fixLabelOverlap={true}
            tickFormat={(t) => !tgglSpan ? '*' :
              tgglSpan == 'month' ?
              moment(t).format('MMM-YYYY') :
              moment(t).format('w-YYYY')}
          />
          
            <VictoryLine
              data={fillDT}
              style={{ data: { stroke: 'rgb(155, 89, 182)' } }}
              animate={{
                onLoad: { duration: 800 }
              }}
            />
            <VictoryScatter 
              data={fillDT}
              style={{ data: { fill: 'rgb(142, 68, 173)' } }}
              size={2}
              animate={{
                onLoad: { duration: 1000 }
              }}
            />
           
          </VictoryChart>
          
      </div>
      <p className='small rightText'>Data is NOT live. Refreshed once a day</p>
    </div>
  );
};

export default DoneItemsTrend;