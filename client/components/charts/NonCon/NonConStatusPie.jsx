import React, { useState, useEffect } from 'react';

import { VictoryPie, VictoryTooltip } from 'victory';
import Theme from '/client/global/themeV.js';

const NonConSatusPie = ({ nonCons })=> {
  
  const [ totalState, totalSet ] = useState( 0 );
  const [ countState, countSet ] = useState( [0,0,0,0,0] );
  const [ labelState, labelSet ] = useState( [ 
    'Awaiting Repair', 'Awaiting Inspection', 
    'Resolved', 'Snoozing', 'Skipped' ] );
  
  useEffect( ()=>{
    const ncG = nonCons;
    totalSet(ncG.length);

    const none = ncG.filter( n => n.fix === false && n.inspect === false && n.skip === false ).length;
    const fix = ncG.filter( n => n.fix !== false && n.inspect === false && n.skip === false ).length;
    const done = ncG.filter( n => n.inspect !== false && n.skip === false ).length;
    const snooze = ncG.filter( n => n.skip !== false && ( n.snooze === true || n.comm === 'sn00ze' ) ).length;
    const skip = ncG.filter( n => n.inspect === false && n.skip !== false && ( n.snooze === false || n.comm !== 'sn00ze' ) ).length;

    const counts = [ none, fix, done, snooze, skip ];
    countSet(counts);
    
    let labels = [ 
      `${none} Awaiting \n Repair`, 
      `${fix} Awaiting \n Inspection`, 
      `${done} Resolved`, 
      `${snooze} Snoozing`, 
      `${skip} Skipped` 
    ];
    labelSet(labels);
  }, [nonCons]);
  
  let colours = ['#e74c3c', '#e67e22', '#2ecc71', '#f39c12', '#f1c40f'];
  
  return (
    <div className='centre'>
      <div className='chart15Contain chart15sq noCopy'>
        <div className='pieRing'>
          <VictoryPie
            theme={Theme.NeptuneVictory}
            colorScale={colours}
            padAngle={2}
            padding={0}
            innerRadius={150}
            data={countState}
            labels={labelState}
            labelComponent={
              <VictoryTooltip 
                style={{ fontSize: '40px' }}
              />
            }
          />
          <span className='pieCore numFont'>{totalState}</span> 
        </div>
      </div>
    </div>
  );
};

export default NonConSatusPie;