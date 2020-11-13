import React, { useRef, useState, useEffect } from 'react';
// import Pref from '/client/global/pref.js';
import moment from 'moment';
// import 'moment-timezone';
import { 
  VictoryLine,
  VictoryChart, 
  VictoryAxis,
  VictoryLegend,
  VictoryZoomContainer
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

// import ToggleBar from '/client/components/bigUi/ToolBar/ToggleBar';
// <ToggleBar
//         toggleOptions={['hours', 'minutes', 'percent']}
//         toggleVal={conversion}
//         toggleSet={(e)=>conversionSet(e)}
//       />
import { percentOf } from '/client/utility/Convert';


const MonthTrend = ({ app, isDebug })=>{

  const thingMounted = useRef(true);
  const blank =  [ {x:1,y:0} ];
  
  const [ durrState, durrSet ] = useState( 1 );
  const [ data, dataSet ] = useState( blank );
  const [ dataQ, dataSetQ ] = useState( blank );
              
  useEffect( ()=>{
    // const dur = parseInt( moment.duration(
    //                         moment().diff(moment(app.createdAt)))
    //                         .asMonths(), 10 );
        // preformace issues                    
    const dur = parseInt( moment.duration(
                            moment().diff(moment(app.tideWall)))
                            .asMonths(), 10 );
                            
    durrSet( dur );
    Meteor.call('cycleWeekRate', 'doneBatch', dur, 'month', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          isDebug && console.log(re);

          const FasPercent = Array.from(re, w => { 
            const pof = percentOf( (w.y[0] + w.y[1]), w.y[0]);
            const np = isNaN(pof) ? 0 : pof;
            return { x: w.x, y: np } } );
          dataSet(FasPercent);
          const QasPercent = Array.from(re, w => { 
            const pof = percentOf( (w.y[2] + w.y[3]), w.y[2]);
            const np = isNaN(pof) ? 0 : pof;
            return { x: w.x, y: np } } );
          dataSetQ(QasPercent);
        }
      }
    });
    return () => { thingMounted.current = false };
  }, []);
  
  return(
    <div className='space5x5'>
      
      <h3 className='orangeBorder'>PROTOTYPE - Expected to Be Slow</h3>
      
      <div style={{backgroundColor:'white'}}>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 25, bottom: 25, left: 30}}
          domainPadding={{x: 10, y: 40}}
          height={250}
          containerComponent={<VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1/0.25}}
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
          { name: "On Time", symbol: { fill: "rgb(142, 68, 173)" } },
          { name: "Under Quote", symbol: { fill: "rgb(39, 174, 96)" } }
          ]}
          
        />
          <VictoryAxis
            dependentAxis
            tickValues={[10,20,30,40,50,60,70,80,90,100]}
            tickFormat={(t) => `${t}%`}
          />
          <VictoryAxis
            tickCount={data.length}
            fixLabelOverlap={true}
            tickFormat={(t) => 
              moment().subtract(durrState, 'month').add(t, 'month').format('MMM YYYY') }
          />
          
            <VictoryLine
              data={data}
              style={{ data: { stroke: 'rgb(142, 68, 173)' } }}
              interpolation="catmullRom"
              animate={{
                duration: 500,
                onLoad: { duration: 500 }
              }}
            />
            <VictoryLine
              data={dataQ}
              style={{ data: { stroke: 'rgb(39, 174, 96)' } }}
                interpolation="monotoneX"
              animate={{
                duration: 500,
                onLoad: { duration: 500 }
              }}
            />
          </VictoryChart>
          
      </div>
    
    
    </div>
  );
};

export default MonthTrend;