import React, {Component} from 'react';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';
import MiniBar from '/client/components/charts/MiniBar.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
// requires 
/// batchData
/// flow
/// altflow

export default class StepsProgress extends Component	{
  
  constructor() {
    super();
    this.state = {
      countCalc: 'item'
    };
  }

  dataLoop() {
    const b = this.props.batchData;
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    
    const outScrap = (itms)=> { return ( itms.filter( x => x.history.filter( y => y.type === 'scrap' ).length === 0 ) )};
    
    const rSteps = flow.filter( x => x.type !== 'first' );
    const aSteps = flowAlt.filter( x => x.type !== 'first' );
    
    let regItems = b.items;
    let altItems = [];
    
    if(aSteps.length < 1) {
      regItems = outScrap(regItems);
    }else{
      regItems = outScrap( b.items.filter( x => x.alt === false || x.alt === 'no' ) );
      altItems = outScrap( b.items.filter( x => x.alt === 'yes' ) );
    }
    
    let totalRegUnits = 0;
    for(let i of regItems) {
      totalRegUnits += i.units;
    }
    let totalAltUnits = 0;
    for(let i of altItems) {
      totalAltUnits += i.units;
    }
    
    const scrapCount = b.items.length - regItems.length - altItems.length;
    
    function flowLoop(river, items) {
      const byKey = (t, ky)=> { return ( x => x.key === ky && x.good === true )};
      const byName = (t, nm)=> { return ( x => x.step === nm && x.type === 'first' && x.good === true )};
      let stepCounts = [];
      for(let step of river) {
        let itemCount = 0;
        let unitCount = 0;
        for(var i of items) {
          const h = i.history;
          if(i.finishedAt !== false) {
            itemCount += 1;
            unitCount += 1 * i.units;
          }else{
            if(step.type === 'inspect') {
              h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
              h.find( byName(this, step.step) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
            }else{
              h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
            }
          }
        }
        stepCounts.push({
          step: step.step,
          type: step.type,
          items: itemCount,
          units: unitCount
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
      totalRegUnits: totalRegUnits,
      totalAltUnits: totalAltUnits,
      scrapCount: scrapCount
    };
  }
    
  render() {
    
    const dt = this.dataLoop();
    const reg = dt.regStepCounts;
    const totalR = dt.regItems;
    const alt = dt.altStepCounts;
    const totalA = dt.altItems;
    const totalRU = dt.totalRegUnits;
    const totalAU = dt.totalAltUnits;
    const scrapCount = dt.scrapCount;
    
    const unitsExist = totalRU + totalAU > ( totalR + totalA ) ? true : false;
    const calcItem = this.state.countCalc === 'item' ? true : false;
    
    return (
      <div>
        <div className='numBoxRadio centreRow'>
          <input
            type='radio'
            id='calcI'
            name='calc'
            onChange={()=> this.setState({countCalc: 'item'})}
            defaultChecked={unitsExist}
            disabled={!unitsExist} />
          <label htmlFor='calcI'>
            <NumBox
              num={totalR + totalA}
              name={Pref.item + 's'}
              color='whiteT' />
          </label>
          <input type='radio' id='calcU' name='calc' onChange={()=> this.setState({countCalc: 'unit'})} />
          {unitsExist ?
            <label htmlFor='calcU'>
              <NumBox
                num={totalRU + totalAU}
                name={Pref.unit + 's'}
                color='whiteT' />
            </label>
          :null}
        </div>
        <div>
          <div className='centreRow'>
            {reg.map( (entry, index)=>{
              let count = calcItem ? entry.items : entry.units;
              let total = calcItem ? totalR : totalRU;
              return(
                <StepDisplay
                  key={index}
                  mini={this.props.mini}
                  step={entry.step}
                  type={entry.type}
                  count={count}
                  total={total} />
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
                let count = calcItem ? entry.items : entry.units;
                let total = calcItem ? totalA : totalAU;
                return(
                  <StepDisplay
                    key={index}
                    mini={this.props.mini}
                    step={entry.step}
                    type={entry.type}
                    count={count}
                    total={total} />
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

const StepDisplay = ({ mini, step, type, count, total })=> {
  const title = type === 'finish' ||
                type === 'test' ?
                step :
                step + ' ' + type;
  if(mini) {
    return(
      <MiniBar
        title={title}
        count={count}
        total={total} />
    );
  }
  return(
    <ProgPie
      title={title}
      count={count}
      total={total} />
  );
};