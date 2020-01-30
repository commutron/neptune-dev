import React, { useState, useEffect } from 'react';

import { VictoryPie, VictoryTooltip } from 'victory';
import Theme from '/client/global/themeV.js';

const ShortfallSatusPie = ({ shortfalls })=> {
  
  const [ totalState, totalSet ] = useState( 0 );
  const [ countState, countSet ] = useState( [0,0,0,0,0] );
  const [ labelState, labelSet ] = useState( [ 
    'Awaiting Decision', 'Ship Without', 'Waiting', 'Resolved' 
    ] );
  
  useEffect( ()=>{
    const sh = shortfalls;
    totalSet(sh.length);

    const pending = sh.filter( s => s.inEffect === null ).length;
    const doOmit = sh.filter( s => s.inEffect === true ).length;
    const waiting = sh.filter( s => !s.reSolve ).length - pending - doOmit;
    const good = sh.filter( s => s.reSolve === true ).length;

    const counts = [ pending, doOmit, waiting, good ];
    countSet(counts);
    
    let labels = [ 
      `${pending} Awaiting \n Decision`, 
      `${doOmit} Ship \n Without`, 
      `${waiting} Waiting`, 
      `${good} Resolved` 
    ];
    labelSet(labels);
  }, [shortfalls]);
  
  let colours = [
    'rgb(243, 156, 18)',
    'rgb(40, 40, 40)',
    'rgb(230, 126, 34)',
    'rgb(39, 174, 96)'
  ];
    
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

export default ShortfallSatusPie;