import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';
import MiniBar from '/client/components/charts/MiniBar.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
import FirstsOverview from '/client/components/bigUi/FirstsOverview.jsx';
// requires 
/// batchData
/// flow
/// altflow

export default class StepsProgress extends Component	{

  dataLoop() {
    const b = this.props.batchData;
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    
    const outScrap = (itms)=> { return ( itms.filter( x => x.history.filter( y => y.type === 'scrap' ).length === 0 ) )};
    
    const rSteps = flow.filter( x => x.type !== 'first' );
    const aSteps = flowAlt.filter( x => x.type !== 'first' );
    
    let regItems = b.items;
    let altItems = [];
    
    let totalUnits = 0;
      for(let i of b.items) {
        totalUnits += i.units;
      }
    
    if(aSteps.length < 1) {
      regItems = outScrap(regItems);
    }else{
      regItems = outScrap( b.items.filter( x => x.alt === false || x.alt === 'no' ) );
      altItems = outScrap( b.items.filter( x => x.alt === 'yes' ) );
    }
    
    const scrapCount = b.items.length - regItems.length - altItems.length;
    
    function flowLoop(river, items) {
      const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
      const byName = (t, nm)=> { return ( x => x.step === nm && x.type === 'first' && x.good === true )};
      let stepCounts = [];
      for(let step of river) {
        let count = 0;
        let units = 1;
        for(var i of items) {
          units = i.units;
          const h = i.history;
          if(i.finishedAt !== false) {
            count += 1;
          }else{
            if(step.type === 'inspect') {
              h.find( byKey(this, step.key) ) ? count += 1 : null;
              h.find( byName(this, step.step) ) ? count += 1 : null;
            }else{
              h.find( byKey(this, step.key) ) ? count = count + 1 : null;
            }
          }
        }
        stepCounts.push({
          step: step.step,
          type: step.type,
          count: count,
          units: units
        });
      }   
      return stepCounts;
    }
  
    let regStepCounts = flowLoop(rSteps, regItems);
    let altStepCounts = flowLoop(aSteps, altItems);
    
    return {
      regStepCounts: regStepCounts,
      regItems: regItems.length,
      altStepCounts: altStepCounts,
      altItems: altItems.length,
      totalUnits: totalUnits,
      scrapCount: scrapCount
    };
  }
    
  render() {
    
    const dt = this.dataLoop();
    const reg = dt.regStepCounts;
    const totalR = dt.regItems;
    const alt = dt.altStepCounts;
    const totalA = dt.altItems;
    const totalU = dt.totalUnits;
    const scrapCount = dt.scrapCount;
    
    return (
      <div className='centreRow'>
        <div>
          <NumBox
            num={totalR + totalA}
            name={Pref.item + 's'}
            color='whiteT' />
          {totalU > ( totalR + totalA ) ?
            <NumBox
              num={totalU}
              name={Pref.unit}
              color='whiteT' />
          :null}
          { !this.props.doneFirsts ? null :
          <FirstsOverview
            doneFirsts={this.props.doneFirsts}
            flow={this.props.flow}
            flowAlt={this.props.flowAlt} /> }
        </div>
        <div>
          <div className='centreRow'>
            {reg.map( (entry, index)=>{
              return(
                <StepDisplay
                  key={index}
                  type={this.props.mini}
                  entry={entry}
                  total={totalR} />
            )})}
          </div>
          {totalA > 0 ?
            <div>
              <hr />
              <span className='small cap wellSpacedLine'>
                <i className='fa fa-asterisk fa-lg' aria-hidden='true'></i>
                <i>{Pref.buildFlowAlt}</i>
              </span>
              <div className='centreRow'>
              {alt.map( (entry, index)=>{
                return(
                  <StepDisplay
                    key={index}
                    type={this.props.mini}
                    entry={entry}
                    total={totalA} />
              )})}
              </div>
            </div>
          :null}
          {scrapCount > 0 ? <b className='redT cap'>{Pref.scrap}: {scrapCount}</b> : null}
        </div>
      </div>
    );
  }
}

export class StepDisplay extends Component {
  
  render() {
    
    const dt = this.props.entry;
    const title = dt.type === 'finish' ||
                  dt.type === 'test' ?
                  dt.step :
                  dt.step + ' ' + dt.type;
    
    if(this.props.type) {
      return(
        <MiniBar
          title={title}
          count={dt.count}
          total={this.props.total} />
      );
    }
    return(
      <ProgPie
        title={title}
        count={dt.count}
        total={this.props.total} />
    );
  }
}