import React, { useState, useEffect, useRef } from 'react';
import { 
  VictoryChart,
  VictoryAxis, 
  VictoryArea, 
  VictoryZoomContainer } from 'victory';
import Theme from '/client/global/themeV.js';

const ProgLayerBurndown = ({ 
  batchId, seriesId, batchNum, start, floorRelease, end, riverFlow, 
  itemData, title, isDebug
})=> {
  
  const mounted = useRef(true);
  
  useEffect(() => { return () => { mounted.current = false; }; }, []);
  
  const [ countState, countSet ] = useState( false );
 
  useEffect( ()=> {
    Meteor.call('layeredHistoryRate', batchId, seriesId, start, end, riverFlow, 
    (error, reply)=> {
      error && console.log(error);
      reply && mounted.current ? countSet( reply ) : null;
      isDebug && console.log(reply);
    });
  }, []);
  
  return(
    <div className='burndownFill'>
    <div className='rowWrap noPrint'>
      {!countState ?
        <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
        <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
      }
    </div>
    {countState &&
      
      <div className='wide balance cap'>
      
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 40, bottom: 25, left: 40}}
          scale={{x: "time", y: "linear"}}
          height={200}
          width={400}
          containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1000/500, y: 0.1}}
          />}
        >
          <VictoryAxis 
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fontSize: '6px' }
            } }
          />
          <VictoryAxis
            dependentAxis
            tickFormat={(l)=> l.toFixed(0,10)}
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { fontSize: '5px' }
            } }
          />
        
        {countState.map( (entry, index)=>{
          return(
            <VictoryArea
              key={index+entry.name}
              data={entry.data}
              
              style={{ 
                data: { 
                  stroke: 'rgb(41, 128, 185)',
                  strokeWidth: '1px',
                  fill: 'rgba(41, 128, 185, 0.2)'
                },
              }}
            />
          )}
        )}
        
        </VictoryChart>
        
        <div className='centreText smCap'>{title}</div>
        
      </div>
    }
    
      <details className='footnotes grayT small wide'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          The X axis is the percentage of counters and serialized items remaining.
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
  );
};

export default ProgLayerBurndown;