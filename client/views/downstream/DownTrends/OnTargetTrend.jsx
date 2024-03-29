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
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';

import { percentOf } from '/client/utility/Convert';


const OnTargetTrend = ({ app, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  
  const [ working, workingSet ] = useState(false);
  
  const [ tgglSpan, tgglSpanSet ] = useState( false );
  const [ tgglState, tgglSet ] = useState( false );
  
  const [ fillDT, fillSet ] = useState( blank );
  const [ shipDT, shipSet ] = useState( blank );
  const [ dataQ, dataSetQ ] = useState( blank );
              
  useEffect( ()=>{
    return () => { thingMounted.current = false };
  }, []);
  
  function chartConvert(re) {
    const FasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[0] + w.y[1]), w.y[0]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    fillSet(FasPercent);
    
    const SasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[2] + w.y[3]), w.y[2]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    shipSet(SasPercent);
    
    const QasPercent = Array.from(re, w => { 
      const pof = percentOf( (w.y[4] + w.y[5]), w.y[4]);
      const dtp = isNaN(pof) ? null : pof;
      return { x: w.x, y: dtp };
    });
    dataSetQ(QasPercent);
    
    workingSet(false);
  }
  
  function runLoopLite(cName, tspan) {
    workingSet(true);
    
    const backDate = isDebug ? app.createdAt : app.tideWall;
    const dur = moment.duration(moment().diff(moment(backDate)));
    const durCln = tspan == 'month' ?
                    parseInt( dur.asMonths(), 10 ) :
                    parseInt( dur.asWeeks(), 10 );
                    
    Meteor.call('cycleLiteRate', cName, durCln, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);
          chartConvert(re);
          tgglSpanSet(tspan);
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
          className='smallAction blackHover gap'
          onClick={()=>runLoopLite('doneBatchLiteMonths', 'month')}
          disabled={working}
        >By Month</button>
        
        <button
          className='smallAction blackHover gap'
          onClick={()=>runLoopLite('doneBatchLiteWeeks', 'week')}
          disabled={working}
        >By Week</button>
        
        <span className='flexSpace' />
        
        <ToggleSwitch 
          tggID='shipfilltrnd'
          toggleLeft='ship'
          toggleRight='fulfill'
          toggleVal={tgglState}
          toggleSet={tgglSet}
        />
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
            { name: "On Time", symbol: { fill: "rgb(39, 174, 96)" } },
            { name: "On Quote", symbol: { fill: "rgb(142, 68, 173)" } }
          ]}
          
        />
          <VictoryAxis
            dependentAxis
            tickValues={[10,20,30,40,50,60,70,80,90,100]}
            tickFormat={(t) => `${t}%`}
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
              data={tgglState ? fillDT : shipDT}
              style={{ data: { stroke: 'rgb(46, 204, 113)' } }}
              interpolation="catmullRom"
            />
            <VictoryScatter 
              data={tgglState ? fillDT : shipDT}
              style={{ data: { fill: "rgb(39, 174, 96)" } }}
              size={2}
            />
            
            <VictoryLine
              data={dataQ}
              style={{ data: { stroke: 'rgb(155, 89, 182)' } }}
              interpolation="monotoneX"
            />
            <VictoryScatter 
              data={dataQ}
              style={{ data: { fill: 'rgb(142, 68, 173)' } }}
              size={2}
            />
          </VictoryChart>
          
      </div>

    </div>
  );
};

export default OnTargetTrend;