import React, { useState } from 'react';

const Slides = ({ menu, disable, extraClass, children })=> {
  
  const [ section, setSection ] = useState(0);
  
  const handleClick = (clk)=> {
    setSection(clk);
  };

  const dA = Array.isArray(disable) ? disable : [];
    
  return(
    <div className='slidesLayout'>
      <div className='slidesMenu forceScrollStyle noPrint'>
        {menu.map( (entry, index)=>{
          let clss =  section === index ? 
                      'slideMenuButton cap slideOn' : 
                      'slideMenuButton cap slideOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
              disabled={dA[index]}
            >{entry}</button>
        )})}
      </div>
      <div className={`slidesSlide forceScrollStyle ${extraClass || ''}`}>

        {children[section]}
      
      </div>
    </div>
  );
};

export default Slides;