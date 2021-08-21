import React from 'react';
import { Meteor } from 'meteor/meteor';
import { ToastContainer } from 'react-toastify';

import HomeIcon from '/client/layouts/HomeIcon';
import TideFollow from '/client/components/tide/TideFollow';
import { UpTaskBar, DownTaskBar } from './TaskBars';

const StreamLayout = ({
  user,
  app,
  flowData,
  title,
  subLink,
  tag,
  navBar,
  isAuth,
  children
})=>	{
              
  return(
    <div className='containerEx'>
      <ToastContainer
        position="top-center"
        newestOnTop />
      <div className='tenHeader noPrint'>
        <div className='topBorder' />
        <HomeIcon />
        
          <div className='frontCenterTitle cap'>{title}
          {tag && <sup className='vbig monoFont'>{tag}</sup>}</div>
        
        <TideFollow />
      
      </div>
      <aside className='taskBarEx noPrint'>
        {navBar === 'down' ?
          <DownTaskBar subLink={subLink} /> :
          <UpTaskBar 
            subLink={subLink} 
            showParts={app.partsGlobal}
            isAuth={isAuth}
          />
        }
      </aside>
      
      <div className='contentAreaEx'>
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