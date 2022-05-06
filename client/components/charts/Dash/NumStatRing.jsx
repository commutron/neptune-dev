import React from "react";
import { VictoryPie } from 'victory';
//import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';

const NumStatRing = ({ total, nums, name, title, colour, maxSize, noGap, isDebug })=> {
  
  const colours =
    colour === 'blue' ? ["#4181cb","#044289","#499eff","#0579ff","#7b9dc4"] :
    colour === 'blueBi' ? [ "rgb(52, 152, 219)", "rgba(41, 128, 185, 0.5)" ] :
    colour === 'green' ? ["#2ecc71","#22f97c","#02d85b","#4fff98","#028237"] :
    colour === 'greenBi' ? [ "rgb(46, 204, 113)", "rgba(39, 174, 96, 0.5)" ]:
    colour === 'red' ? ["#e74c46","#a30500","#720300","#8c0c08","#9b0500"] :
    colour === 'redTri' ? [ "rgb(192,57,43)", "rgb(231,76,60)", "rgba(39,174,96,0.5)" ] :
    colour === 'orangeBi' ? [ "rgb(230, 126, 34)", "rgba(39, 174, 96, 0.5)" ]:
    colour;
  
  isDebug && console.log(nums);
  
  const contain = maxSize || 'chart10Contain';
  
  return(
    <div className={`${contain} noCopy`} title={title}>
      <div className='pieRing'>
        <VictoryPie
          theme={Theme.NeptuneVictory}
          colorScale={colours}
          padAngle={noGap ? 0 : 3}
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