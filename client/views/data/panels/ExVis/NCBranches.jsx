import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import moment from 'moment';
import { 
  VictoryZoomContainer,
  VictoryLine,
  VictoryArea,
  VictoryLegend,
  VictoryChart, 
  VictoryAxis,
  // VictoryTooltip,
  VictoryStack
} from 'victory';
// import Pref from '/client/global/pref.js';
import Theme from '/client/global/themeV.js';
import { ToggleSwitch } from '/client/components/smallUi/ToolBarTools';
import PrintThis from '/client/components/tinyUi/PrintThis';


const NCBranches = ({ brancheS, app })=> {
  
  const thingMounted = useRef(true);
  
  const [ tickXY, tickXYSet ] = useState(false);
  const [ showEvery, showEverySet ] = useState(false);
  
  useEffect( ()=> {
    let pos = ['before release'];
    for(let anc of app.ancillaryOption) {
      pos.push(anc);
    }
    for(let br of brancheS) {
      pos.push(br.branch);
    }
    for(let oth of ['after complete', 'out of route', 'wip', 'unknown']) {
      pos.push(oth);
    }
      
    Meteor.call('getAllBrNcCount', pos, (err, re)=>{
      err && console.log(err);
      if(re) {
        if(thingMounted.current) {
          tickXYSet(re);
          console.log(re);
        }
      }
    });
  }, []);
  
  const dataset = tickXY || [];

  return(
    <div className='chartNoHeightContain'>
      <div className='rowWrap noPrint'>
        {!tickXY ?
          <n-fa1><i className='fas fa-spinner fa-lg fa-spin gapR'></i>Loading</n-fa1> :
          <n-fa0><i className='fas fa-spinner fa-lg'></i></n-fa0>
        }
        <span className='flexSpace' />
        <ToggleSwitch 
          tggID='brncTick'
          toggleLeft='Stack'
          toggleRight='Separate'
          toggleVal={showEvery}
          toggleSet={showEverySet}
        />
        <PrintThis />  
      </div>
      
      {showEvery ?
      
        dataset.map( (e, ix)=>(
          <VictoryChart
            key={ix}
            theme={Theme.NeptuneVictory}
            padding={{top: 5, right: 25, bottom: 25, left: 30}}
            domainPadding={25}
            height={75}
            containerComponent={<VictoryZoomContainer zoomDimension="x" />}
          >
            <VictoryAxis
              tickFormat={(t) => moment(t).format('MMM D YYYY')}
              fixLabelOverlap={true}
              style={ {
                axis: { stroke: 'grey' },
                grid: { stroke: '#5c5c5c' },
                ticks: { stroke: '#5c5c5c' },
                tickLabels: { 
                  fontSize: '6px' }
              } }
              scale={{ x: "time" }}
            />
            <VictoryAxis 
              dependentAxis
              fixLabelOverlap={true}
              tickFormat={(t) => Math.round(t)}
              style={ {
                axis: { stroke: 'grey' },
                grid: { stroke: '#5c5c5c' },
                ticks: { stroke: '#5c5c5c' },
                tickLabels: { 
                  fontSize: '6px' }
              } }
            />
            <VictoryLine
              data={e[1]}
              style={{
                data: { 
                  stroke: 'rgb(231, 76, 60)',
                  strokeWidth: '1px'
                },
              }}
            />
          </VictoryChart>
        ))
        :
        <VictoryChart
          theme={Theme.NeptuneVictory}
          padding={{top: 5, right: 25, bottom: 25, left: 30}}
          domainPadding={25}
          height={250}
          containerComponent={<VictoryZoomContainer />}
        >
          
          <VictoryAxis
            tickFormat={(t) => moment(t).format('MMM D YYYY')}
            fixLabelOverlap={true}
            style={ {
              axis: { stroke: 'grey' },
              grid: { stroke: '#5c5c5c' },
              ticks: { stroke: '#5c5c5c' },
              tickLabels: { 
                fontSize: '6px' }
            } }
            scale={{ x: "time" }}
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
          <VictoryLegend x={10} y={0}
          	title=""
            labels={{ fontSize: 12 }}
            titleOrientation="left"
            gutter={10}
            symbolSpacer={3}
            borderPadding={{ top: 4, bottom: 3, left: 3 }}
            orientation="horizontal"
            itemsPerRow={4}
            style={{ 
              border: { stroke: "grey", fill: 'white' }, 
            }}
            data={Array.from(dataset, l =>{ return { name: l[0] } })}
          />
          <VictoryStack
            theme={Theme.NeptuneVictory}
            // colorScale={["rgb(52, 152, 219)", "rgb(149, 165, 166)", "rgb(241, 196, 15)"]}
            padding={0}
          >
          
          {dataset.map( (e, ix)=>(
            // <VictoryLine
            //   key={ix}
            //   data={e[1]}
            // />
            <VictoryArea
              key={ix}
              data={e[1]}
            />
          ))}
        </VictoryStack>
      </VictoryChart>
      }
      <p className='centreText'>Noncons by Branch</p>
      <p className='lightgray fade'>
        Scroll to Zoom <br />
        Click and Drag to Pan <br />
        Data begins {moment(app.createdAt).format('MMMM YYYY')}<br />
      </p>
    </div>
  );
};

export default NCBranches;

