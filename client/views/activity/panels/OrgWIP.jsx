import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import LeapText from '/client/components/tinyUi/LeapText.jsx';
import NumBox from '/client/components/uUi/NumBox.jsx';
import ProgPie from '/client/components/charts/ProgPie.jsx';

const OrgWIP = ({ wip })=> {

  let wipHot = false;
  let wipCold = false;

  if(!wip) {
    null;
  }else{
    wipHot = wip.filter( x => x.active === true);
    wipHot.sort((b1, b2)=> {
                  if (b1.batch < b2.batch) { return 1 }
                  if (b1.batch > b2.batch) { return -1 }
                  return 0;
                });
    wipCold = wip.filter( x => x.active === false);
    wipCold.sort((b1, b2)=> {
                  if (b1.batch < b2.batch) { return 1 }
                  if (b1.batch > b2.batch) { return -1 }
                  return 0;
                });
  }
  
  if(!wipHot || !wipCold) {
    return (
      <div className='space'>
        <i className='fas fa-circle-o-notch fa-spin fa-3x'></i>
        <span className='sr-only'>Loading...</span>
      </div>
    );
  }
  
  return (
    <div className='wipCol'>
      {wipHot.map( (entry)=>{
        let hotrndmKey = Math.random().toString(36).substr(2, 5);
        return(
          <StatusRow key={hotrndmKey} entry={entry} active={true} />
        )})}
      {wipCold.map( (entry)=>{
        let coldrndmKey = Math.random().toString(36).substr(2, 5);
        return(
          <StatusRow key={coldrndmKey} entry={entry} active={false} />
        )})}
    </div>
  );
};

export class StatusRow extends Component	{
  
  constructor() {
    super();
    this.state = {
      countCalc: 'item'
    };
  }
  
  render() {
    
    const dt = this.props.entry;
    
    const late = moment(dt.endGoal).isBefore(moment().now);
    const clss = this.props.active ? 'popBlue' : '';
    const totalAll = dt.totalR + dt.totalA;
    const totalUnits = dt.totalRU + dt.totalAU;
    
    const calcItem = this.state.countCalc === 'item' ? true : false;
    
    let rndmKey = Math.random().toString(36).substr(2, 5);

    return(
      <div className={'wipRow ' + clss}>
        <div className='wellSpacedLine blackFade'>
          <span>
            <LeapText
              title={dt.batch} 
              sty='big'
              address={'/data/batch?request=' + dt.batch} />
          </span>
          <span className='up'>{dt.group} {dt.widget} v.{dt.version}</span>
          <span className='capFL'>{Pref.item}s: {totalAll}</span>
          {totalUnits > totalAll && <span className='cap'>{Pref.unit}: {totalUnits}</span>}
          {dt.totalA > 0 && <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span>}
          {dt.scrap > 0 && <span className='redT'>Scraps: {dt.scrap}</span>}
          {dt.rma > 0 && <span className='redT'>RMAs: {dt.rma}</span>}
        </div>
        {dt.totalR + dt.totalA < 1 &&
          <div className='yellowT wide centreText'>No {Pref.item}s created</div>}
        <StatusCell steps={dt.stepsReg} total={dt.totalR} unitTotal={dt.totalRU} calc={calcItem} />
        {dt.stepsAlt.length > 0 && 
          <fieldset className='noteCard'>
            <legend className='medBig smCap centreText'>{Pref.buildFlowAlt}</legend>
            <StatusCell 
              steps={dt.stepsAlt}
              total={dt.totalA}
              unitTotal={dt.totalAU}
              calc={calcItem} />
          </fieldset>}
        {dt.finished &&
          <p className='wide greenT centreText'>Finished {moment(dt.finishedAt).calendar()}</p>}
        {/*totalUnits > totalAll &&
          <div className='functionalFooter numBoxRadio blackFade'>
            <span className='radioLabelPair'>
              <input
                type='radio'
                id={rndmKey + 'calcI'}
                name={rndmKey + 'calc'}
                onChange={()=> this.setState({countCalc: 'item'})}
                defaultChecked />
              <label htmlFor={rndmKey + 'calcI'}>Boards</label>
            </span>
            <span className='radioLabelPair'>
              <input
                type='radio'
                id={rndmKey + 'calcU'}
                name={rndmKey + 'calc'}
                onChange={()=> this.setState({countCalc: 'unit'})} />
              <label htmlFor={rndmKey + 'calcU'}>Units</label>
            </span>
          </div>*/}
        {late && 
          <i title='Late' className='fas fa-exclamation-triangle fa-2x yellowT bottomRightFloat'></i>}
      </div>
    );
  }
}

const StatusCell = ({ steps, total, unitTotal, calc })=> (
  <div className='centreRow'>
    {steps.map( (entry)=>{
      let rndmKey = Math.random().toString(36).substr(2, 5);
      const title = entry.type === 'finish' ||
                    entry.type === 'test' ?
                    entry.step :
                    entry.step + ' ' + entry.type;
      let count = calc ? entry.itemCount : entry.unitCount;
      let totalCount = calc ? total : unitTotal;
      return(
        <ProgPie
          key={rndmKey}
          title={title}
          count={count}
          total={totalCount} />
      );
    })}
  </div>
);

export default OrgWIP;