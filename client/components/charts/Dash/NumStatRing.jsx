import React from "react";
import ReactDOM from 'react-dom';
import { VictoryPie } from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NumStatRing = ({ total, nums, name, title, colour})=> {
  
  const colours =
    colour === 'blue' ? ["#4181cb","#044289","#499eff","#0579ff","#7b9dc4"] :
    colour === 'green' ? ["#2ecc71","#22f97c","#02d85b","#4fff98","#028237"] :
    colour === 'red' ? ["#e74c46","#a30500","#720300","#8c0c08","#9b0500"] :
    null;
    console.log(nums);
  return(
    <div className='invert' className='chart20Contain noCopy' title={title}>
      <div className='pieRing'>
        <VictoryPie
          theme={Theme.NeptuneVictory}
          colorScale={colours}
          padAngle={3}
          padding={0}
          innerRadius={160}
          data={nums}
          labels={(l)=>null}
        />
        <span className='pieCore numFont'>{total}</span> 
      </div>
      <p className='centreText cap'>{name}</p>
    </div>
  );
};
  
export default NumStatRing;