import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';

const ExploreLanding = ({ 
  groupData, widgetData, 
  batchData, xBatchData, 
  app, isDebug
}) => (
  <section>
    <div className='centre wide'>
      
      <div className='vspace wide'>
        
        <div className='centreRow'>
          
          <TrendLine 
            title={`new ${Pref.batches}`}
            statType='newBatch'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)' />
          
          <TrendLine 
            title='new items'
            statType='newItem'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(52, 152, 219)' />
            
          <TrendLine 
            title={`discovered ${Pref.shortfall}s`}
            statType='newSH'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(230, 126, 34)' />
            
        </div>    
          
        <div className='centreRow'>
        
          <TrendBar
            title={`completed ${Pref.batches}`}
            statType='doneBatch'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week' />
            
          <TrendLine 
            title={`completed ${Pref.items}`}
            statType='doneItem'
            cycleCount={isDebug ? 26 : 4}
            cycleBracket='week'
            lineColor='rgb(46, 204, 113)' />
            
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
    
      </div>
      
    </div>
  </section>
);

export default ExploreLanding;