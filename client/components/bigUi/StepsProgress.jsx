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
      countCalc: 'item',
    };
  }
    
  render() {
    
    const dt = this.props.progCounts;
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
