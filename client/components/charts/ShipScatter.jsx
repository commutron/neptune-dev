import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import ShipScatterChart from '/client/components/charts/ShipScatterChart';
import PrintThis from '/client/components/tinyUi/PrintThis';


const ShipScatter = ({ 
  fetchFunc, idLimit, 
  print, height, leftpad, extraClass, dtStart
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
      
      <ShipScatterChart 
        xy={tickXY || []} 
        height={height}
        leftpad={leftpad}
      />
      
      <p className='centreText small'>Fulfill On Time</p>
      <p className='lightgray fade'>
        ◆ = Completed <br />
        ★ = WIP <br />
        Y-axis data is in days<br />
        Scroll to Zoom. Click and Drag to Pan.<br />
        Data curve is smoothed by a basis spline function<br />
        {dtStart && `X-axis data begins ${moment(dtStart).format('MMMM YYYY')}`}
      </p>
    </div>
  );
};

export default ShipScatter;