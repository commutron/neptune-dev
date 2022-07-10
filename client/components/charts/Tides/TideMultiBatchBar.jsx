import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/tinyUi/Spin';

import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import { min2hr } from '/client/utility/Convert';

import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryLabel,
  VictoryStack
} from 'victory';
import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const TideMultiBatchBar = ({ batchIDs, app, extraClass })=> {
  
  const [ batchTimes, storeTimes ] = useState(false);
  const [ tggl, tgglSet ] = useState(false);
  
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
      <div className={'chartNoHeightContain ' + extraClass || ''}>
      <div className='rowWrap noPrint'>
        <span className='flexSpace' />
        <ToggleSwitch 
          tggID='toggleQty'
          toggleLeft='Total Hours'
          toggleRight='Hours Per Item'
          toggleVal={tggl}
          toggleSet={tgglSet}
        />
      </div>
      
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 25, right: 50, bottom: 25, left: 25}}
          domainPadding={{x: 10, y: 40}}
          height={50 + ( batchTimes.batchTides.length * 25 )}
        >
          <VictoryAxis 
            dependentAxis 
            tickFormat={(t) => Math.round( min2hr(t) )}
            style={ {
              tickLabels: { 
                fontSize: '6px' }
            } }
          />
          <VictoryAxis
            style={ {
              tickLabels: { 
                fontSize: '6px' }
            } }
          />
          
          <VictoryStack
            theme={Theme.NeptuneVictory}
            colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
            horizontal={true}
            padding={0}
          >
            <VictoryBar
              data={batchTimes.batchTides}
              y={(d)=> tggl ? d.y / (d.z || 1) : d.y}
              horizontal={true}
              labels={(l) => tggl ? 
                l.datum.y > 0 ? `${min2hr(l.datum.y / (l.datum.z || 1))} logged` : null :
                l.datum.y > 0 ? `${min2hr(l.datum.y)} logged` : null
              }
              style={{ labels: { fontSize: '6px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="end"
                />}
              barWidth={10}
            />
            <VictoryBar
              data={batchTimes.batchLeftBuffer}
              y={(d)=> tggl ? d.y / (d.z || 1) : d.y}
              horizontal={true}
              labels={(l) => tggl ? 
                l.datum.y > 0 ? `${min2hr(l.datum.y / (l.datum.z || 1))} Remaining` : null :
                l.datum.y > 0 ? `${min2hr(l.datum.y)} Remaining` : null
              }
              style={{ labels: { fill: "#969696", fontSize: '6px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="start"
                />}
              barWidth={10}
            />
            <VictoryBar
              data={batchTimes.batchOverBuffer}
              y={(d)=> tggl ? d.y / (d.z || 1) : d.y}
              horizontal={true}
              labels={(l) => tggl ? 
                l.datum.y > 0 ? `${min2hr(l.datum.y / (l.datum.z || 1))} Over` : null :
                l.datum.y > 0 ? `${min2hr(l.datum.y)} Over` : null
              }
              style={{ labels: { fill: "dimgrey", fontSize: '6px' } }}
              labelComponent={
                <VictoryLabel
                  verticalAnchor="start"
                />}
              barWidth={10}
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