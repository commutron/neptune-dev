import React, { useRef, useState, useEffect } from 'react';
import moment from 'moment';
import { 
  VictoryLine,
  VictoryScatter,
  VictoryChart, 
  VictoryAxis,
  VictoryLegend,
  VictoryZoomContainer
} from 'victory';
import Theme from '/client/global/themeV.js';

const DoneItemsTrend = ({ app, isDebug })=>{

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
    <div>
      
      <div className='rowWrap noPrint'>
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
          padding={{top: 25, right: 30, bottom: 25, left: 30}}
          domainPadding={{x: 10, y: 10}}
          height={200}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1/0.1}}
          />}
        >
        
        <VictoryLegend x={0} y={0}
        	title=""
          titleOrientation="left"
          gutter={10}
          symbolSpacer={3}
          borderPadding={{ top: 4, bottom: 0, left: 4 }}
          orientation="horizontal"
          style={{ 
            labels: { padding: 2, fontSize: 8 } 
          }}
          data={[
            { name: "Serialized Units", symbol: { fill: "rgb(39, 174, 96)" } }
          ]}
          
        />
          <VictoryAxis
            dependentAxis
            tickFormat={(t) => !tgglSpan ? '*' : t}
            style={{
              tickLabels: { 
                fontSize: '6px' }
            }}
          />
          <VictoryAxis
            fixLabelOverlap={true}
            tickFormat={(t) => !tgglSpan ? '*' :
              tgglSpan == 'month' ?
              moment(t).format('MMM-YYYY') :
              moment(t).format('w-YYYY')}
            style={{
              tickLabels: { 
                fontSize: '6px' }
            }}
          />
          
            <VictoryLine
              data={fillDT}
              style={{ data: { stroke: 'rgb(46, 204, 113)' } }}
            />
            <VictoryScatter 
              data={fillDT}
              style={{ data: { fill: 'rgb(39, 174, 96)' } }}
              size={2}
            />
           
          </VictoryChart>
          
      </div>
    </div>
  );
};

export default DoneItemsTrend;