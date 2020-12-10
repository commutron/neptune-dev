import React from "react";

const NumStatBox = ({ 
  number, name, title,
  textColour, borderColour
})=> {
  
  const tColour = textColour || 'black';
  
  const bColour =
    !borderColour ? 'black' :
    borderColour === 'blue' ? "rgb(52, 152, 219)" :
    borderColour === 'green' ? "rgb(46, 204, 113)" :
    borderColour === 'red' ? "rgb(192,57,43)" :
    borderColour === 'orange' ? "rgb(230, 126, 34)" :
    borderColour;
  
  const sty = {
    textAlign: 'center',
    margin: '5px',
    color: tColour,
    borderColor: bColour
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