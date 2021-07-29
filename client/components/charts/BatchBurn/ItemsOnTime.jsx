import React, { useState, useEffect } from "react";
import moment from 'moment';
import 'moment-business-time';

import ShipScatterChart from '/client/components/charts/ShipScatterChart';
import { round1Decimal } from '/client/utility/Convert.js';

const ItemsOnTime = ({ items, salesEnd, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  
  useEffect( ()=> {
    let onset = [];
    
    const endDay = moment(salesEnd);
    const fin = endDay.isWorkingDay() ?
                  endDay.clone().endOf('day').lastWorkingTime().format() :
                  endDay.clone().lastWorkingTime().format();
    
    const doneitems = items.filter( x => x.completed )
                        .sort((a,b)=> a.completedAt > b.completedAt ? 1 : 
                                      a.completedAt < b.completedAt ? -1 : 0);
    
    for(let i of doneitems) {
      const finGap = round1Decimal( 
        moment(fin).workingDiff(i.completedAt, 'days', true) 
      );
      onset.push({
        y: finGap,
        x: moment(i.completedAt).startOf('day').format(),
        z: `${i.serial} = ${finGap}`,
        symbol: 'diamond',
        size: '2'
      });
    }
    onset.length === 0 ? seriesSet(false) : seriesSet(onset);
  }, []);
          
  isDebug && console.log({series});
    
  return(
    <div className='chartNoHeightContain'>
      {series === false ?
        <div className='centreText fade'>
          <p className='cap'>nothing complete to chart</p>
        </div>
      :
        <ShipScatterChart xy={series} />
      }
      
      <p className='centreText small cap'>Items Completed On Time</p>
      
      <details className='footnotes wide'>
        <summary>Chart Details</summary>
        <p className='footnote'>
          If no time was recorded the day is skipped 
        </p>
        <p className='footnote'>
          Y-axis is in days. Positive is days before due. Negative is after due.
        </p>
        <p className='footnote'>
          Scroll to zoom, click and drag to pan.
        </p>
        <p className='footnote'>
          If labels are overlaping, zoom in or out. The software does the best it can. 
        </p>
      </details>
    </div>
  );
};

export default ItemsOnTime;