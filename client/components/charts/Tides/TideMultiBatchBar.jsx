import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import moment from 'moment';

import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryLabel,
  VictoryTooltip,
  VictoryStack
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const TideMultiBatchBar = ({ batchIDs, app })=> {
  
  const [ batchTimes, storeTimes ] = useState(false);
  
  useEffect( ()=>{
    const flipBatchIDs = batchIDs.reduce((ary, ele) => {ary.unshift(ele); return ary}, []);
    Meteor.call('countMultiBatchTideTimes', flipBatchIDs, (error, reply)=>{
      error && console.log(error);
      storeTimes( reply );
    });
  }, [batchIDs]);
  
  const asHours = (mnts) => moment.duration(mnts, "minutes").asHours().toFixed(1, 10);

  
  if(!batchTimes) {
    return(
      <CalcSpin />
    );
  }
    
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
          tickFormat={(t) => Math.round( asHours(t) )}
        />
        <VictoryAxis />
        <VictoryStack
          theme={Theme.NeptuneVictory}
          colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
          horizontal={true}
          padding={0}
          animate={{
            duration: 500,
            onLoad: { duration: 250 }
          }}
        >
            <VictoryBar
              data={batchTimes.batchTides}
              horizontal={true}
              labels={(l) => `${asHours(l.y)} logged`}
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
              labels={(l) => l.y > 0 ? `${asHours(l.y)} Remaining` : null}
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
              labels={(l) => l.y > 0 ? `${asHours(l.y)} Over` : null}
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
};

export default TideMultiBatchBar;