import React from 'react';

import { VictoryPie, VictoryTooltip } from 'victory';
import Theme from '/client/global/themeV.js';

const NonConSatusPie = (props)=> {
  
  let none = 0;
  let fix = 0;
  let done = 0;
  let snooze = 0;
  let skip = 0;
    
  const ncG = props.nonCons.filter( n => !n.trash );
  none = ncG.filter( n => n.fix === false && n.inspect === false && n.skip === false ).length;
  fix = ncG.filter( n => n.fix !== false && n.inspect === false && n.skip === false ).length;
  done = ncG.filter( n => n.fix !== false && n.inspect !== false && n.skip === false ).length;
  snooze = ncG.filter( n => n.skip !== false && ( n.snooze === true || n.comm === 'sn00ze' ) ).length;
  skip = ncG.filter( n => n.inspect === false && n.skip !== false && ( n.snooze === false || n.comm !== 'sn00ze' ) ).length;

  const counts = [ none, fix, done, snooze, skip ];
  
  let labels = [ 
    `${none} Awaiting Repair`, 
    `${fix} Awaiting Inspection`, 
    `${done} Resolved`, 
    `${snooze} Snoozing`, 
    `${skip} Skipped` ];

  let colours = ['#e74c3c', '#e67e22', '#2ecc71', '#f39c12', '#f1c40f'];
  
  let ttl = ncG.length;

  return (
    <div className='centre'>
      <div className='chart15Contain noCopy'>
        <div className='pieRing'>
          <VictoryPie
            theme={Theme.NeptuneVictory}
            colorScale={colours}
            padAngle={2}
            padding={0}
            innerRadius={150}
            data={counts}
            labels={labels}
            labelComponent={
              <VictoryTooltip 
                style={{ fontSize: '50px' }}
              />
            }
          />
          <span className='pieCore numFont'>{ttl}</span> 
        </div>
      </div>
    </div>
  );
};

export default NonConSatusPie;