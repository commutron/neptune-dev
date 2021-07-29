import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import ShipScatterChart from '/client/components/charts/ShipScatterChart';
import PrintThis from '/client/components/tinyUi/PrintThis';


const ShipScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllOnTime', (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
        }
      }
    });
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
      
      <ShipScatterChart xy={tickXY || []} />
      
      <p className='lightgray fade'>
        ◆ = Completed <br />
        ★ = WIP <br />
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        X-axis data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
        Y-axis data is in days<br />
        Data curve is smoothed by a basis spline function
      </p>
    </div>
  );
};

export default ShipScatter;