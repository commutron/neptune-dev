import React, { useState, useEffect } from 'react';

import { VictoryPie, VictoryTooltip } from 'victory';
import Theme from '/client/global/themeV.js';
import { countMulti } from '/client/utility/Arrays';

const NonConSatusPie = ({ nonCons })=> {
  
  const [ totalState, totalSet ] = useState( 0 );
  const [ countState, countSet ] = useState( [0,0,0,0,0] );
  const [ labelState, labelSet ] = useState( [ 
    'Awaiting Repair', 'Awaiting Inspection', 
    'Resolved', 'Skipped/Snoozing' ] );
  
  useEffect( ()=>{
    const ncG = nonCons;
    totalSet(countMulti(ncG));

    const none = countMulti( ncG.filter( n => n.fix === false && n.inspect === false ) );
    const fix = countMulti( ncG.filter( n => n.fix !== false && n.inspect === false ) );
    const done = countMulti( ncG.filter( n => n.inspect !== false ) );
    const skip = countMulti( ncG.filter( n => n.inspect === false && n.snooze === true ) );

    const counts = [ none, fix, done, skip ];
    countSet(counts);
    
    let labels = [ 
      `${none} Awaiting \n Repair`, 
      `${fix} Awaiting \n Inspection`, 
      `${done} Resolved`, 
      `${skip} Skipped/Snoozing` 
    ];
    labelSet(labels);
  }, [nonCons]);
  
  let colours = ['#e74c3c', '#e67e22', '#2ecc71', '#f1c40f'];
  
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