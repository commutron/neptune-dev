import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryScatter,
  VictoryArea,
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip
} from 'victory';
import Theme from '/client/global/themeV.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';


const OrderScatter = ({ app })=> {
  
  const mounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ tggl, tgglSet ] = useState(false);
  const [ perQty, perQtySet ] = useState(false);
  
  useEffect( ()=> {
    Meteor.call('getAllOrders', (err, re)=>{
      err && console.log(err);
      if(re && mounted.current) {
        tickXYSet(re);
        console.log(re);
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
      
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 25, bottom: 25, left: 30}}
        domainPadding={25}
        height={200}
        containerComponent={<VictoryZoomContainer />}
      >
        <VictoryAxis
          tickFormat={(t) => !tickXY ? '*' : moment(t).format('MMM D YYYY')}
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
          // scale={{ x: "time" }}
        />
        <VictoryAxis 
          dependentAxis
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryArea
          data={tickXY || []}
          x={(d)=> tggl ? d.x2 : d.x1}
          y={(d)=> tggl ? perQty ? d.y2 / (d.y1 || 1) : d.y2 : d.y1}
          interpolation='basis'
          style={{
            data: { 
              fill: 'rgba(41, 128, 185, 0.2)'
            },
          }}
        /> 
        <VictoryScatter
          data={tickXY || []}
          x={(d)=> tggl ? d.x2 : d.x1}
          y={(d)=> tggl ? perQty ? Math.round(d.y2 / (d.y1 || 1)) : d.y2 : d.y1}
          style={{
            data: {
              fill: 'rgb(41, 128, 185)'
            },
            labels: { 
              padding: 2,
            } 
          }}
          symbol={(d) => tggl ? d.s2 : d.s1}
          labels={(d)=> d.datum.z + ' Qty: '+ d.datum.y1 + '\n' 
                        + 'Workdays: ' + d.datum.y2
                        + ' (' + Math.round(d.datum.y2 / (d.datum.y1 || 1)) + ' per item)'
          }
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '6px', borderWidth: '1px' }}
            />}
        />
      </VictoryChart>
      
      <p className='centreText small'
      >{tggl ? 'Workdays Duration. From Sales Start to Completed' : 
               'Created Order Quantity'}
      </p>
      <p className='grayT small'>
        Scroll to Zoom. Click and Drag to Pan.<br />
        Data curve is smoothed by a basis spline function<br />
      </p>
    </div>
  );
};

export default OrderScatter;