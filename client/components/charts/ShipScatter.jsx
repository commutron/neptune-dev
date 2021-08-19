import React, { useState, useEffect, useRef } from "react";
import ZeroLineScatterChart from '/client/components/charts/ZeroLineScatterChart';
import PrintThis from '/client/components/tinyUi/PrintThis';


const ShipScatter = ({ 
  fetchFunc, idLimit, 
  print, height, leftpad, extraClass
})=> {
  
  const mounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call(fetchFunc, idLimit, (err, re)=>{
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
    <div className={'chartNoHeightContain ' + extraClass || ''}>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        {print && <PrintThis />}
      </div>
      
      <ZeroLineScatterChart 
        xy={tickXY || []} 
        fade='rgba(46, 204, 113,0.2)'
        fill='rgb(39, 174, 96)'
        height={height}
        leftpad={leftpad}
      />
      
      <p className='centreText small'>Fulfill On Time</p>
      <p className='grayT small'>
        ◆ = Completed <br />
        ★ = WIP <br />
        Y-axis data is in workdays<br />
        Scroll to Zoom. Click and Drag to Pan.<br />
        Data curve is smoothed by a basis spline function<br />
      </p>
    </div>
  );
};

export default ShipScatter;