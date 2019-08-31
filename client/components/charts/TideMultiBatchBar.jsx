import React, { useState, useEffect } from 'react';
import { CalcSpin } from '/client/components/uUi/Spin.jsx';
import moment from 'moment';

import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryLabel
} from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const TideMultiBatchBar = ({ batchIDs, app })=> {
  
  const [ batchTides, storeTides ] = useState(false);
  
  useEffect( ()=>{
    const flipBatchIDs = batchIDs.reverse();
    Meteor.call('countMultiBatchTideTimes', flipBatchIDs, (error, reply)=>{
      error && console.log(error);
      storeTides( reply );
    });
  }, []);
  
  const asHours = (mnts) => moment.duration(mnts, "minutes").asHours().toFixed(2, 10);

  
  if(!batchTides) {
    return(
      <CalcSpin />
    );
  }
    
  return(
    <div className='invert chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 25, right: 50, bottom: 25, left: 50}}
      >
        <VictoryAxis 
          dependentAxis 
          tickFormat={(t) => asHours(t)}
        />
        <VictoryAxis />
        <VictoryBar
          data={batchTides}
          horizontal={true}
          labels={(l) => asHours(l.y)}
          style={{ labels: { fill: "dimgray" } }}
          labelComponent={<VictoryLabel />}
        />
        </VictoryChart>
        <div className='centreText small'>Duration in Hours</div>
      </div>
  );
};

export default TideMultiBatchBar;