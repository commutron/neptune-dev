import React from "react";

const NumStatBox = ({ 
  number, name, title, fontSize,
  textColour, borderColour
})=> {
  
  const sty = {
    color: textColour || 'black',
    "--kpiColor": borderColour
  };
  
  const tSty = {
    fontSize: fontSize || 'inherit'
  };
  
  const lSty = {
    verticalAlign: 'top',
    textTransform: 'capitalize',
    wordBreak: 'keep-all',
    wordWrap: 'keep-all',
  };
  
  return(
    <div style={sty} className='dashNumBox noCopy cap' title={title}>
      <div>
        <span className='numFont' style={tSty}>{number}</span> 
      </div>
      <p style={lSty} className='centreText cap'>{name}</p>
    </div>
  );
};
  
export default NumStatBox;