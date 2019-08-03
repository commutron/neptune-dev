import React, { useState, useEffect } from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import './style.css';

const Tabs = ({ tabs, names, wide, stick, hold, sessionTab, children })=> {
  
  const [ sect, setSect ] = useState(0);

  useEffect( ()=>{
    if(!hold) { 
      null;
    }else{
      const holder = Session.get(sessionTab);
      !holder ? null : setSect( holder );
    }
  }, []);
  
  function handleClick(clk) {
    setSect(clk);
    !hold ? null : Session.set(sessionTab, clk);
  }

  let show = sect;
  const sticky = stick ? 'stickyBar' : '';
  const styl = wide ? { width: 100 / tabs.length + '%'} : null;
    
  return (
    <div>
      <div className={sticky}>
        {tabs.map( (entry, index)=>{
          let clss =  show === index ? 'tabOn' : 'tabOff';
          return (
            <button
              key={index}
              onClick={()=>handleClick(index)}
              className={clss}
              style={styl}
            >{entry} {names && names[index]}</button>
        )})}
      </div>
      <AnimateWrap type='cardTrans'>
        <div className='tabBody'>

          {children[show]}
        
        </div>
      </AnimateWrap>
    </div>
  );
};

export default Tabs;