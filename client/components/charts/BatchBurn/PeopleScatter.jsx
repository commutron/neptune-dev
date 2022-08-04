import React, { useState, useEffect } from "react";
import moment from 'moment';
import { 
  VictoryScatter, 
  VictoryChart, 
  VictoryAxis,
  VictoryClipContainer,
  VictoryZoomContainer
} from 'victory';
import Theme from '/client/global/themeV.js';
import UserName from '/client/utility/Username.js';

const PeopleScatter = ({ tide, period, xlabel, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ idNum, idNumSet ] = useState(1);
  
  useEffect( ()=> {
    const tideArr = tide || [];
    const max = _.uniq( Array.from(tideArr, t=> t.who) ).length;
    const tideS = tideArr.sort((a,b)=> a.startTime > b.startTime ? 1 : 
                                       a.startTime < b.startTime ? -1 : 0);
    
    let days = [];
    for(let t of tideS) {
      days.push({
        x: moment(t.startTime).startOf(period).format(),
        y: UserName(t.who, true)
      });
    }
    const slim = _.uniq(days, n=> n.x + n.y );
    
    seriesSet(slim);
    idNumSet(max);
  }, [tide]);
          

  isDebug && console.log({series, idNum});
    
  return(
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 80}}
        domainPadding={20}
        height={50 + ( idNum * 15 )}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1000/500, y: 0.1}}
          />}
      >
        <VictoryAxis
          tickFormat={(t) => series.length === 0 ? '*' : moment(t).format(xlabel || 'MMM D YYYY')}
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
          scale="time"
        />

        <VictoryAxis 
          dependentAxis
          fixLabelOverlap={true} 
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px',
              textTransform: 'capitalize'
            }
          }}
        />
        <VictoryScatter
          data={series}
          groupComponent={<VictoryClipContainer/>}
          style={ {
            data: { 
              fill: 'rgb(41, 128, 185)',
              strokeWidth: 0
          } } }
        />
      </VictoryChart>
      
      <p className='centreText small cap'>People Distribution</p>
      
      <details className='footnotes wide grayT small'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          If no time was recorded the day is skipped 
        </p>
        <p className='footnote'>
          People are listed in no particular order. Date order takes precedence.
        </p>
        <p className='footnote'>
          Scroll to zoom, click and drag to pan.
        </p>
        <p className='footnote'>
          If labels are overlaping, zoom in or out. The software does the best it can. 
        </p>
      </details>
    </div>
  );
};

export default PeopleScatter;