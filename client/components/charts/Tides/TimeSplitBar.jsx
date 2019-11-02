import React from "react";
// import ReactDOM from 'react-dom';
import { VictoryBar, VictoryStack } from 'victory';

const TimeSplitBar = ({ title, nums, colour})=> {
  
  const colours =
    colour === 'blue' ? ["#4181cb","#044289","#499eff","#0579ff","#7b9dc4"] :
    colour === 'green' ? ["#2ecc71","#22f97c","#02d85b","#4fff98","#028237"] :
    colour === 'red' ? ["#e74c46","#a30500","#720300","#8c0c08","#9b0500"] :
    colour === 'pale' ? ["#b4b3a8", "#807f6b", "#97957f", "#bdbca3", "#efeed4"] :
    null;
  
  Roles.userIsInRole(Meteor.userId(), 'debug') && 
    console.log(nums);
  
  return(
    <div className='invert' className='noCopy' title={title}>
    
      <VictoryStack
        colorScale={colours}
        horizontal={true}
        padding={0}
        height={45}
        // animate={{
        //   duration: 500,
        //   onLoad: { duration: 250 }
        // }}
      >
        {nums.map((ph, ix)=>{
          return(
            <VictoryBar 
              key={ix}
              data={[{ x: "ph", y: ph.y }]}
              barWidth={40}
            />
        )})}
      </VictoryStack>
    </div>
  );
};
  
export default TimeSplitBar;