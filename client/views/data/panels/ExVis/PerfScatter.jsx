import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import ZeroLineScatterChart from '/client/components/charts/ZeroLineScatterChart';

import PrintThis from '/client/components/tinyUi/PrintThis';


const PerfScatter = ({ app })=> {
  
  const mounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllPerform', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(mounted.current) {
          tickXYSet(re);
        }
      }
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  return(
    <div className='chartNoHeightContain'>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        <PrintThis />
      </div>
      
      <ZeroLineScatterChart 
        xy={tickXY || []} 
        fade='rgba(155,89,182,0.2)'
        fill='rgb(142, 68, 173)'
      />
      
      <p className='centreText cap small'>Performance</p>
      <p className='lightgray fade'>
        ◆ = Completed <br />
        ★ = WIP <br />
        Scroll to Zoom. Click and Drag to Pan.<br />
        Data curve is smoothed by a basis spline function<br />
        Reliable data begins {moment(app.tideWall).format('MMMM YYYY')}
      </p>
    </div>
  );
};

export default PerfScatter;