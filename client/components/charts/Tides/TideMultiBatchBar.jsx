import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin.jsx';
// import moment from 'moment';

import { min2hr } from '/client/utility/Convert';

import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryLabel,
  // VictoryTooltip,
  VictoryStack
} from 'victory';
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const TideMultiBatchBar = ({ batchIDs, app })=> {
  
  const [ batchTimes, storeTimes ] = useState(false);
  
  useEffect( ()=>{
    Meteor.call('countMultiBatchTideTimes', batchIDs, (error, reply)=>{
      error && console.log(error);
      storeTimes( reply );
    });
  }, [batchIDs]);
  
  if(!batchTimes) {
    return(
      <CalcSpin />
    );
  }
  
  if(batchTimes.batchTides.length > 0) {
    return(
      <div className='invert chartNoHeightContain'>
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 25, bottom: 25, left: 50}}
          domainPadding={{x: 10, y: 40}}
          height={50 + ( batchTimes.batchTides.length * 35 )}
        >
          <VictoryAxis 
            dependentAxis 
            tickFormat={(t) => Math.round( min2hr(t) )}
          />
          <VictoryAxis />
          <VictoryStack
            theme={Theme.NeptuneVictory}
            colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
            horizontal={true}
            padding={0}
          >
            <VictoryBar
              data={batchTimes.batchTides}
              horizontal={true}
              labels={(l) => `${min2hr(l.y)} logged`}
              style={{ labels: {   fontSize: '7px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="end"
                />}
              barWidth={12}
            />
            <VictoryBar
              data={batchTimes.batchLeftBuffer}
              horizontal={true}
              labels={(l) => l.y > 0 ? `${min2hr(l.y)} Remaining` : null}
              style={{ labels: { fill: "#969696",  fontSize: '7px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="start"
                />}
              barWidth={12}
            />
            <VictoryBar
              data={batchTimes.batchOverBuffer}
              horizontal={true}
              labels={(l) => l.y > 0 ? `${min2hr(l.y)} Over` : null}
              style={{ labels: { fill: "dimgrey",  fontSize: '7px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="start"
                />}
              barWidth={12}
            />
        </VictoryStack>
        </VictoryChart>
        <div className='centreText small'>Duration in Hours</div>
      </div>
    );
  }
    
  return(
    <div className='centreText fade'>
      <i className='fas fa-ghost fa-2x grayT'></i>
      <p className='medBig cap'>no {Pref.xBatchs}</p>
    </div>
  );
};

export default TideMultiBatchBar;