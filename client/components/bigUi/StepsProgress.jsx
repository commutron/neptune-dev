import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';
import MiniBar from '/client/components/charts/MiniBar.jsx';
import MiniStack from '/client/components/charts/MiniStack.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
// requires 
/// batchData
/// flow
/// altflow
/// expand
/// soon also quotas

export default class StepsProgress extends Component	{
  
  constructor() {
    super();
    this.state = {
      countCalc: 'item'
    };
  }

  dataLoop() {
    const flow = this.props.flow;
    const flowAlt = this.props.flowAlt;
    const rSteps = flow.filter( r => r.type !== 'first' );
    const aSteps = flowAlt.filter( a => a.type !== 'first' );
    
    const allItems = this.props.batchData.items;
    
    const outScrap = (itms)=> { 
                      return ( 
                        itms.filter( 
                          o => o.history.filter( 
                            s => s.type === 'scrap' ).length === 0 )
                      )};
    
    const allLiveItems = outScrap(allItems);
    const scrapCount = allItems.length - allLiveItems.length;
    
    let regItems = allLiveItems;
    let altItems = [];
    
    if(aSteps.length > 0) {
      regItems = allLiveItems.filter( r => r.alt === 'no' || r.alt === false );
      altItems = allLiveItems.filter( a => a.alt === 'yes' );
    }else{null}
    
    let totalRegUnits = 0;
    for(let i of regItems) {
      totalRegUnits += i.units;
    }
    let totalAltUnits = 0;
    for(let i of altItems) {
      totalAltUnits += i.units;
    }
    
    function flowLoop(river, items, expand, quotaStart) {
      const now = moment().format();
      const wndw = !quotaStart ? (t)=>moment(t).isSame(now, 'day') : (t)=>moment(t).isBetween(quotaStart, now);
      const byKey = (t, ky)=> { return ( k => k.key === ky )};
      const byName = (t, nm)=> { return ( s => s.step === nm && s.type === 'first' )};
      let stepCounts = [];
      for(let step of river) {
        let itemCount = 0;
        let unitCount = 0;
        let itemCountNew = 0;
        let unitCountNew = 0;
        for(var i of items) {
          const h = i.history.filter( g => g.good === true);
          const hNew = h.filter( q => wndw(q.time) === true );
          if(i.finishedAt !== false) {
            itemCount += 1;
            unitCount += 1 * i.units;
            if(expand) {
              if(hNew.find( f => f.key === 'f1n15h1t3m5t3p' )) {
                itemCountNew += 1;
                unitCountNew += 1 * i.units;
              }
            }
          }else if(step.type === 'inspect') {
            h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
            h.find( byName(this, step.step) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
            if(expand) {
              hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
              hNew.find( byName(this, step.step) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
            }
          }else{
            h.find( byKey(this, step.key) ) ? (itemCount += 1, unitCount += 1 * i.units ) : null;
            if(expand) {
              hNew.find( byKey(this, step.key) ) ? (itemCountNew += 1, unitCountNew += 1 * i.units ) : null;
            }
          }
        }
        stepCounts.push({
          step: step.step,
          type: step.type,
          items: itemCount,
          units: unitCount,
          itemsNew: itemCountNew,
          unitsNew: unitCountNew
        });
      }   
      return stepCounts;
    }
  
    let regStepCounts = flowLoop(rSteps, regItems, this.props.expand, false);
    let altStepCounts = flowLoop(aSteps, altItems, this.props.expand, false);
    
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
          <input
            type='radio'
            id='calcU'
            name='calc'
            onChange={()=> this.setState({countCalc: 'unit'})} />
            {unitsExist ?
              <label htmlFor='calcU'>
                <NumBox
                  num={totalRU + totalAU}
                  name={Pref.unit + 's'}
                  color='whiteT' />
              </label>
            :null}
          {scrapCount > 0 ? 
          <label>
            <NumBox
              num={scrapCount}
              name={Pref.scrap}
              color='redT' />
            </label>
          :null}
        </div>
        <div>
          <div className='centreRow'>
            {reg.map( (entry)=>{
              let count = calcItem ? entry.items : entry.units;
              let countNew = calcItem ? entry.itemsNew : entry.unitsNew;
              let total = calcItem ? totalR : totalRU;
              let rndmKeyR = Math.random().toString(36).substr(2, 5);
              return(
                <StepDisplay
                  key={rndmKeyR}
                  mini={this.props.mini}
                  expand={this.props.expand}
                  step={entry.step}
                  type={entry.type}
                  count={count}
                  countNew={countNew}
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
              {alt.map( (entry)=>{
                let count = calcItem ? entry.items : entry.units;
                let countNew = calcItem ? entry.itemsNew : entry.unitsNew;
                let total = calcItem ? totalA : totalAU;
                let rndmKeyA = Math.random().toString(36).substr(2, 5);
                return(
                  <StepDisplay
                    key={rndmKeyA}
                    mini={this.props.mini}
                    expand={this.props.expand}
                    step={entry.step}
                    type={entry.type}
                    count={count}
                    countNew={countNew}
                    total={total} />
              )})}
              </div>
            </div>
          :null}
        </div>
      </div>
    );
  }
}

const StepDisplay = ({ mini, expand, step, type, count, countNew, total })=> {
  const title = type === 'finish' ||
                type === 'test' ?
                step :
                step + ' ' + type;
  if(expand) {
    return(
      <MiniStack
        title={title}
        count={count}
        countNew={countNew}
        total={total} />
    );
  }              
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
