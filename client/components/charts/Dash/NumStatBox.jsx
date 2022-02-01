import React from "react";

const NumStatBox = ({ 
  number, name, title,
  textColour, borderColour
})=> {
  
  const tColour = textColour || 'black';
  
  const bColour =
    !borderColour ? "rgba(0, 0, 0, 0.1)" :
    borderColour === 'blue' ? "rgba(52, 152, 219, 0.2)" :
    borderColour === 'green' ? "rgba(46, 204, 113, 0.2)" :
    borderColour === 'red' ? "rgba(192,57,43, 0.2)" :
    borderColour === 'orange' ? "rgba(230, 126, 34, 0.2)" :
    borderColour === 'purple' ? "rgba(155, 89, 182, 0.2)" :
    borderColour;
  
  const sty = {
    textAlign: 'center',
    color: tColour,
    backgroundColor: bColour,
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