import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';
//import Pref from '/client/global/pref.js';
import ErrorCatch from '/client/layouts/ErrorCatch.jsx';

import HomeIcon from '/client/layouts/HomeIcon.jsx';
import TideFollow from '/client/components/tide/TideFollow.jsx';
import { UpTaskBar } from './TaskBars.jsx';

const StreamLayout = ({
  // batchData,
  // bCache, pCache, acCache, brCache,
  user,
  app,
  flowData,
  title,
  subLink,
  invertColor,
  beta,
  children
})=>	{
  
  const invert = invertColor ? 'invert' : '';
              
  return(
    <ErrorCatch>
      <div className='containerEx'>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop />
        <div className='tenHeader noPrint'>
          <div className='topBorder' />
          <HomeIcon />
          
            <div className='frontCenterTitle cap'>{title}
            {beta && <sup className='medBig monoFont'>BETA</sup>}</div>
          
          <TideFollow />
        
        </div>
        <aside className='taskBarEx noPrint'>
          <UpTaskBar subLink={subLink} />
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
    </ErrorCatch>
  );
};

export default StreamLayout;