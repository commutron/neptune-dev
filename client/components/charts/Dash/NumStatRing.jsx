import React, { useState } from "react";
import ReactDOM from 'react-dom';
import { VictoryPie, VictoryTooltip } from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NumStatRing = ({num, name, title})=> {
  
  const [ series, setSeries ] = useState( [] );
      
  
  
          
    
    //Roles.userIsInRole(Meteor.userId(), 'debug') && 
    //console.log('');
    
  return(
    <div className='invert' className='chart30Contain noCopy' title={title}>
    
      <div className='pieRing'>
        <VictoryPie
          theme={Theme.NeptuneVictory}
          colorScale={["#355140","#628470","#77AA8C","#A2E8BF","#558C6B"]}
          padAngle={3}
          padding={0}
          innerRadius={160}
          data={[35, 40, 55 ]}
        />
        <span className='pieCore numFont'>{num}</span> 
      </div>
      <p className='centreText'>{name}</p>
       
    </div>
  );
};
  
export default NumStatRing;