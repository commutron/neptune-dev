import { Meteor } from 'meteor/meteor';
import React from 'react';
import Pref from '/client/global/pref.js';
import NumBox from '/client/components/uUi/NumBox.jsx';
import TrendLine from '/client/components/charts/Trends/TrendLine.jsx';
import TrendBar from '/client/components/charts/Trends/TrendBar.jsx';

const ExploreLanding = ({ groupData, widgetData, batchData, xBatchData, app }) => {
  
  const total = batchData.length;
  const xTotal = xBatchData.length;
  const live = batchData.filter( x => x.live === true ).length;
  const xlive = xBatchData.filter( x => x.live === true ).length;
  const process = batchData.filter( x => x.finishedAt === false ).length;
  const xProcess = xBatchData.filter( x => x.completed === false ).length;
  const verAdd = Array.from(widgetData, x => x.versions.length).reduce((x, y) => x + y, 0);
  
  
  const isDebug = Roles.userIsInRole(Meteor.userId(), 'debug');
  
  return(
    <section>
      <div className='centre wide'>
        
        <div className='centreRow'>
          <NumBox
            num={groupData.length}
            name={Pref.group + 's'}
            color='blueT' />
          <NumBox
            num={widgetData.length}
            name={Pref.widget + 's'}
            color='blueT' />
          <NumBox
            num={verAdd}
            name={Pref.version + 's'}
            color='blueT' />
          <NumBox
            num={total + xTotal}
            name={'Total ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={live + xlive}
            name={'live ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={process + xProcess}
            name={'In Process ' + Pref.batch + 's'}
            color='blueT' />
          <NumBox
            num={(total + xTotal) - (process + xProcess)}
            name={'Finished ' + Pref.batch + 's'}
            color='greenT' />
        </div>
        
        <div className='vspace wide'>
          
          <div className='centreRow'>
            
            <TrendLine 
              title={`new ${Pref.batches}`}
              statType='newBatch'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week'
              lineColor='rgb(52, 152, 219)' />
            
            <TrendLine 
              title='new items'
              statType='newItem'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week'
              lineColor='rgb(52, 152, 219)' />
              
            <TrendLine 
              title={`discovered ${Pref.shortfall}s`}
              statType='newSH'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week'
              lineColor='rgb(230, 126, 34)' />
              
          </div>    
          
          <div className='centreRow'>
          
            <TrendBar
              title={`completed ${Pref.batches}`}
              statType='doneBatch'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week' />
              
            <TrendLine 
              title={`completed ${Pref.items}`}
              statType='doneItem'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week'
              lineColor='rgb(46, 204, 113)' />
              
            <TrendLine 
              title={`discovered ${Pref.nonCons}`}
              statType='newNC'
              cycleCount={isDebug ? 12 : 4}
              cycleBracket='week'
              lineColor='rgb(231, 76, 60)' />
            
          </div>
        
          <details className='footnotes'>
            <summary>Chart Details</summary>
            <p className='footnote'>
              Trends include {isDebug ? 12 : 4} weeks, including the current week. 
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
};

export default ExploreLanding;