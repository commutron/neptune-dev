import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { UpTaskBar, DownTaskBar } from './TaskBars.jsx';

const StreamLayout = ({
  // batchData,
  // bCache, pCache, acCache, brCache,
  user,
  app,
  flowData,
  title,
  subLink,
  invertColor,
  tag,
  navBar,
  children
})=>	{
  
  const invert = invertColor ? 'invert' : '';
              
  return(
    <div className='containerEx'>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        newestOnTop />
      <div className='tenHeader noPrint'>
        <div className='topBorder' />
        <HomeIcon />
        
          <div className='frontCenterTitle cap'>{title}
          {tag && <sup className='medBig monoFont'>{tag}</sup>}</div>
        
        <TideFollow />
      
      </div>
      <aside className='taskBarEx noPrint'>
        {navBar === 'down' ?
          <DownTaskBar subLink={subLink} /> :
          <UpTaskBar subLink={subLink} />}
      </aside>
      
      <div className={`contentAreaEx ${invert}`}>
        <div 
          className='baseContainer'>
          
          <div className='traverseContent forceScroll forceScrollStyle' >
            {children[0] || children}
          </div>
            
        </div>
        
      </div>
      
    </div>
  );
};

export default StreamLayout;