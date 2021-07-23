import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
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


const ShipScatter = ({ app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ toggle, toggleSet ] = useState(false);
  
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
        
        <ToggleSwitch 
          tggID='shipfillvis'
          toggleLeft='Ship'
          toggleRight='Fulfill'
          toggleVal={toggle}
          toggleSet={toggleSet}
        />
        
        <PrintThis />
      </div>
      
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 5, right: 25, bottom: 10, left: 25}}
        domainPadding={25}
        height={250}
        containerComponent={
          <VictoryZoomContainer
            zoomDimension="x"
            minimumZoom={{x: 1000/500, y: 0.1}}
          />}
      >
        <VictoryAxis
          tickFormat={(t) => moment(t).format('MMM D YYYY')}
          fixLabelOverlap={true}
          offsetY={15}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: 'transparent' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
          scale={{ x: "time" }}
        />
        <VictoryAxis
          style={ {
            axis: { stroke: '#000', strokeWidth: '3px' },
            ticks: { stroke: 'transparent' },
          } }
          tickFormat={() => ''}
        />
        <VictoryAxis 
          dependentAxis
          fixLabelOverlap={true}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '7px' }
          } }
        />
        <VictoryArea
          data={tickXY || []}
          y={toggle ? 'v' : 'y'}
          interpolation='basis'
          style={{
            data: { 
              fill: 'rgba(46, 204, 113,0.2)'
            },
          }}
        />
        <VictoryScatter
          data={tickXY || []}
          y={toggle ? 'v' : 'y'}
          style={{
            data: { 
              fill: 'rgb(39, 174, 96)',
              strokeWidth: 0
            },
            labels: { 
              padding: 2,
            } 
          }}
          size={1}
          labels={(d) => toggle ? d.w : d.z}
          labelComponent={
            <VictoryTooltip 
              style={{ fontSize: '6px' }}
            />}
        />
      </VictoryChart>
      
      <p className='lightgray fade'>
        ◆ = Completed <br />
        ★ = WIP <br />
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        Data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
        Data curve is smoothed by a basis spline function
      </p>
    </div>
  );
};

export default ShipScatter;