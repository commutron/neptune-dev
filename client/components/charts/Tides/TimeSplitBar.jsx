import React from "react";

const TimeSplitBar = ({ title, chunks })=> (
  <div className='noCopy' title={title}>
    <n-piece-bar-wrap>
      <n-piece-bar style={{height:'1.5vmax'}}>
        {chunks.map( (et, ix)=>{
          if(!et) { 
            return <n-pc-off key={ix}></n-pc-off>;
          }else{
            return <n-pc-on key={ix}></n-pc-on>;
          }
        })}
      </n-piece-bar>
  </n-piece-bar-wrap>
  </div>
);
  
export default TimeSplitBar;