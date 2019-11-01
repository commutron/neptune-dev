import React, { useState } from 'react';

const SlidesNested = ({ menuTitle, menu, disable, extraClass, topPage, children })=> {
  
  const [ section, setSection ] = useState(menuTitle ? false : 0);
  
  const handleClick = (clk)=> {
    setSection(clk);
  };

  let show = section;
  const dA = Array.isArray(disable) ? disable : [];
    
  return(
    <div className='slidesNestedLayout'>
      <div className='slidesNestedMenu noPrint'>
        {menuTitle &&
          <button
            key={'0x0'}
            onClick={()=>handleClick(false)}
            className={
              show === false ? 
                'slideNestedMenuButton cap slideOn' : 
                'slideNestedMenuButton cap slideOff'
            }
          ><div className='wide centreText'><b>{menuTitle}</b></div></button>}
          
        {menu.map( (entry, index)=>{
          let clss =  show === index ? 
                      'slideNestedMenuButton cap slideOn' : 
                      'slideNestedMenuButton cap slideOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
              disabled={dA[index]}
            >{entry}</button>
        )})}
      </div>
      <div className={`slidesNestedSlide ${extraClass || ''}`}>
        
        {show === false ?
          topPage
        :
          children[show]
        }
      
      </div>
    </div>
  );
};

export default SlidesNested;