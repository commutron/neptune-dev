import React, { useState, useEffect } from "react";
import { 
  VictoryBar, 
  VictoryChart, 
  VictoryAxis,
  VictoryTooltip,
  VictoryStack
} from 'victory';
import Theme from '/client/global/themeV.js';
import { countMulti } from '/client/utility/Arrays';

const NonConBar = ({ ncOp, nonCons, app, isDebug })=> {
  
  const [ series, seriesSet ] = useState([]);
  const [ typeNum, typeNumSet ] = useState(1);
  
  useEffect( ()=> {
    const nonConOptions = ncOp || [];
    
    function ncCounter(ncArray, ncOptions, splitBy) {
    
      const splitOut = splitBy.map( (where, index)=> {
        let match = ncArray.filter( y => y.where === where );
        return{
          'where': where,
          'pNC': match
        };
      });
      
      isDebug && console.log(splitOut);

      let ncCounts = [];
      let typeSet = new Set();
      for(let ncSet of splitOut) {
        let ncWhere = [];
        for(let ncType of ncOptions) {
          const typeCount = countMulti( ncSet.pNC.filter( x => x.type === ncType ) || [] );
          if(typeCount > 0) {
            typeSet.add(ncType);
            ncWhere.push({
              y: typeCount,
              x: ncType,
              label: ncSet.where
            });
          }
        }
        ncCounts.push(ncWhere);
      }
      typeNumSet([...typeSet].length);
      return ncCounts;
    }
    
    try{
      const splitByWhere = [...new Set( Array.from(nonCons, n => n.where ) ) ];
      let calc = ncCounter(nonCons, nonConOptions, splitByWhere);
      seriesSet( calc );
    }catch(err) {
      console.log(err);
    }
  }, []);
          
    
    Roles.userIsInRole(Meteor.userId(), 'debug') && console.log({series, typeNum});
  
  return(
    <div className='chartNoHeightContain'>
      <VictoryChart
        theme={Theme.NeptuneVictory}
        padding={{top: 10, right: 20, bottom: 20, left: 100}}
        domainPadding={20}
        height={50 + ( typeNum * 15 )}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(t) => Math.round(t)}
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryAxis 
          style={ {
            axis: { stroke: 'grey' },
            grid: { stroke: '#5c5c5c' },
            ticks: { stroke: '#5c5c5c' },
            tickLabels: { 
              fontSize: '6px' }
          } }
        />
        <VictoryStack
          theme={Theme.NeptuneVictory}
          colorScale='heatmap'
          horizontal={true}
          padding={0}
        >
        
        {series.map( (entry, index)=>{
          if(entry.length > 0) {
            return(
              <VictoryBar
                key={index+entry.label}
                data={entry}
                labels={(l) => `${l.datum.label}`}
                labelComponent={
                  <VictoryTooltip
                    orientation='top'
                    style={{ fontSize: '7px', padding: 4 }}
                  />}
              />
          )}
        })}
        </VictoryStack>
      </VictoryChart>
      
      <p className='centreText small cap'>Defect Type and recorded location as Bars</p>
      
    </div>
  );
};

export default NonConBar;