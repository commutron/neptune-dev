import React, { useState } from 'react';

const SlidesNested = ({ 
  menuTitle, menu, 
  disable, disableAll, extraClass, 
  topPage, defaultSlide,
  children
})=> {
  
  const df = defaultSlide === undefined ? menuTitle ? false : 0 : defaultSlide;

  const [ section, setSection ] = useState( df );
  
  const handleClick = (clk)=> {
    setSection(clk);
  };

  let show = section;
  let dA = [];
  
  if(Array.isArray(disable)) {
    dA = disable;
  }else if(disableAll) {
    for(let i = 0; i <= children.length; i++) {
      dA.push(true);
    }
  }else{null}
  
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
            disabled={dA[0]}
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
              disabled={dA[index+1]}
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