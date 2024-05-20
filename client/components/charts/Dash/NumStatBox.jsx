import React from "react";

const NumStatBox = ({ 
  number, name, title,
  textColour, borderColour
})=> {
  
  const sty = {
    color: textColour || 'black',
    "--kpiColor": borderColour
  };
  
  const lSty = {
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all',
  };
  
  return(
    <div style={sty} className='dashNumBox noCopy' title={title}>
      <div>
        <span className='numFont'>{number}</span> 
      </div>
      <p style={lSty} className='centreText cap'>{name}</p>
    </div>
  );
};
  
export default NumStatBox;