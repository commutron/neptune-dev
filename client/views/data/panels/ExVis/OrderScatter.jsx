import React, { useState, useEffect, useRef } from "react";
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';
import ScatterCH from '/client/components/charts/ScatterCH';

const OrderScatter = ({})=> {
  
  const mounted = useRef(true);
  
  const [ cvrtData, cvrtDataSet ] = useState(false);
  const [ tickXY, tickXYSet ] = useState(false);
  const [ tggl, tgglSet ] = useState(false);
  const [ perQty, perQtySet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllOrders', (err, re)=>{
      err && console.log(err);
      if(re && mounted.current) {
        tickXYSet(re);
      }
    });
    
    return () => { mounted.current = false; };
  }, []);
  
  useEffect( ()=> {
    //   y1: b.quantity,
    //   x1: b.createdAt,
    //   y2: trnGap,
    //   x2: b.salesStart,
    //   z: `${b.batch} (so.${b.salesOrder})`,
    
    const cnvrt = (tickXY || []).map((r) => { return {
                x: tggl ? r.x2.toISOString() : r.x1.toISOString(), y: tggl ? perQty ? Math.round(r.y2 / (r.y1 || 1)) : r.y2 : r.y1
        }});
    const cnvrtS = cnvrt.sort((a,b)=> a.x > b.x ? 1 : a.x < b.x ? -1 : 0);
    cvrtDataSet(cnvrtS);
  }, [tickXY, tggl, perQty]);
  
  const title = tggl ? 'Workdays Duration. From Sales Start to Completed' : 
               'Created Order Quantity';
  
  return(
    <div className='chartNoHeightContain'>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        <ToggleSwitch 
          tggID='toggleType'
          toggleLeft='Quantity'
          toggleRight='Duration'
          toggleVal={tggl}
          toggleSet={tgglSet}
        />
        
        <ToggleSwitch 
          tggID='toggleType'
          toggleLeft='Total'
          toggleRight='Per Item'
          toggleVal={perQty}
          toggleSet={perQtySet}
          lockout={!tggl}
        />
        
        <PrintThis />
      </div>
      
      <ScatterCH
        strdata={cvrtData}
        title={title}
        fillColor='rgb(52, 152, 219, 0.5)'
      />
      
    </div>
  );
};

export default OrderScatter;