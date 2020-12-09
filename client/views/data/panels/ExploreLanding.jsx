import { Meteor } from 'meteor/meteor';
import React, { useState } from 'react';
import Pref from '/client/global/pref.js';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';
// import NumBox from '/client/components/tinyUi/NumBox.jsx';
import NumStatRing from '/client/components/charts/Dash/NumStatRing.jsx';

import ToggleSearch from '/client/components/bigUi/MultiSearch/ToggleSearch';
import SerialResult from '/client/components/bigUi/MultiSearch/SerialResult';


import BatchesListWide from '../lists/BatchesListWide.jsx';

const ExploreLanding = ({ 
  groupData, widgetData, variantData, 
  batchData, xBatchData, 
  app, isDebug
}) => {
  
  const [ queryState, querySet ] = useState( null );
	const [ resultState, resultSet ] = useState( null );
	
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  
  const locked = batchData.filter( x => x.lock === true ).length;
  const xlocked = xBatchData.filter( x => x.lock === true ).length;
  
  return(
    
  <section>
    <div className='autoGrid wide'>
    
    <div className='vspace wide'>
        
        <ToggleSearch
          queryUP={(v)=>querySet(v)}
          resultUP={(r)=>resultSet(r)} />
        
        
        <SerialResult
          queryState={queryState}
          resultState={resultState}
          app={app} />
        
        
        
        <BatchesListWide
          batchData={[...batchData, ...xBatchData]}
          widgetData={widgetData}
          variantData={variantData}
          groupData={groupData}
          app={app} />
        
        
        
          
      
    </div>
        
        
      <div className='centreRow'>
        <NumStatRing
          total={live + xlive}
          nums={[ 1 ]}
          name='WIP'
          colour='blueBi'
          maxSize='chart15Contain'
        />
        
        <NumStatRing
          total={( (live + xlive) - (process + xProcess) )}
          nums={[ 1 ]}
          name='RMA'
          colour='redTri'
          maxSize='chart15Contain'
        />
      
        <NumStatRing
          total={(total + xTotal) - (process + xProcess)}
          nums={[ 1 ]}
          name='Completed'
          colour='greenBi'
          maxSize='chart15Contain med'
        />
        
        <NumStatRing
          total={(total + xTotal)}
          nums={[ 1 ]}
          name='Total'
          maxSize='chart15Contain'
        />
      
        <NumStatRing
          total={locked + xlocked}
          nums={[ 1 ]}
          name='Locked'
          colour={['rgb(155, 89, 182)']}
          maxSize='chart15Contain'
        />
        
        <div className='centreRow'>
          
          <TrendLine 
            title={`new ${Pref.batches}`}
            statType='newBatch'
            cycleCount={6}
            cycleBracket='month'
            lineColor='rgb(52, 152, 219)' />
          
          <TrendLine 
            title='new items'
            statType='newItem'
            cycleCount={6}
            cycleBracket='month'
            lineColor='rgb(52, 152, 219)' />
          
          <TrendBar
            title={`completed ${Pref.batches}`}
            statType='doneBatch'
            cycleCount={6}
            cycleBracket='month' />
          
        </div>
        
      </div>
      
      
        
      </div>
    </section>
  );
};

export default ExploreLanding;


/*  
  <div className='centreRow'>
      
    <TrendLine 
      title={`completed ${Pref.items}`}
      statType='doneItem'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(46, 204, 113)' />
    
    <TrendLine 
      title={`discovered ${Pref.shortfall}s`}
      statType='newSH'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(230, 126, 34)' />
      
    <TrendLine 
      title={`discovered ${Pref.nonCons}`}
      statType='newNC'
      cycleCount={isDebug ? 26 : 4}
      cycleBracket='week'
      lineColor='rgb(231, 76, 60)' />
    
  </div>
  
  
  <details className='footnotes'>
            <summary>Chart Details</summary>
            <p className='footnote'>
              Trends include {isDebug ? 26 : 4} weeks, including the current week. 
              Read left to right as past to current.
            </p>
            <p className='footnote'>
              Completed on time {Pref.batches} are indicated in green.
              Completed late {Pref.batches} are indicated in yellow.
            </p>
          </details>
  */