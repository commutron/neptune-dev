import React, { useState } from 'react';

const Slides = ({ menu, disable, extraClass, children })=> {
  
  const [ section, setSection ] = useState(0);
  
  const handleClick = (clk)=> {
    setSection(clk);
  };

  let show = section;
  const dA = Array.isArray(disable) ? disable : [];
    
  return(
    <div className='slidesLayout'>
      <div className='slidesMenu noPrint'>
        {menu.map( (entry, index)=>{
          let clss =  show === index ? 
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
      <div className={`slidesSlide ${extraClass || ''}`}>

        {children[show]}
      
      </div>
    </div>
  );
};

export default Slides;