import React, {Component} from 'react';
import moment from 'moment';
import Pref from '/client/global/pref.js';

import ProgPie from '/client/components/charts/ProgPie.jsx';

export default class OrgWIP extends Component	{

  render() {
    
    let wip = this.props.wip;
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
          <i className='fa fa-circle-o-notch fa-spin fa-3x' aria-hidden='true'></i>
          <span className='sr-only'>Loading...</span>
        </div>
      );
    }
    
    return (
      <div className='wipCol'>
        {wipHot.map( (entry, index)=>{
          return(
            <StatusRow key={index} entry={entry} active={true} />
          )})}
        {wipCold.map( (entry, index)=>{
          return(
            <StatusRow key={index} entry={entry} active={false} />
          )})}
      </div>
    );
  }
}

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

    return(
      <section className={clss}>
        <div className='wellSpacedLine blackFade'>
          <span className='big'>{dt.batch}</span>
          <span className='up'>{dt.group} {dt.widget} v.{dt.version}</span>
          <span className='capFL'>{Pref.item}s: {totalAll}</span>
          {totalUnits > totalAll ? <span className='cap'>{Pref.unit}: {totalUnits}</span> : null}
          {dt.totalA > 0 ? <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span> : null}
          {dt.scrap > 0 ? <span className='redT'>Scraps: {dt.scrap}</span> : null}
          {dt.rma > 0 ? <span className='redT'>RMAs: {dt.rma}</span> : null}
        </div>
        {dt.totalR + dt.totalA < 1 ?
          <div className='yellowT wide centreText'>No {Pref.item}s created</div>
        : dt.stepsReg.length > 0 ?
          <div className='fillHeight'>
            <StatusCell steps={dt.stepsReg} total={dt.totalR} unitTotal={dt.totalRU} calc={calcItem} />
            {dt.stepsAlt.length > 0 ?
              <div>
                <hr className='fade'/>
                <span className='small cap'>
                  <i className='fa fa-asterisk fa-lg' aria-hidden='true'></i>
                  <i>{Pref.buildFlowAlt}</i>
                </span>
                <div>
                  <StatusCell steps={dt.stepsAlt} total={dt.totalA} unitTotal={dt.totalAU} calc={calcItem} />
                </div>
              </div>
            :null}
          </div>
        :
          <div className='yellowT wide centreText'>No {Pref.flow} chosen</div>
        }
        {dt.finished ?
          <div className='wide greenT centreText'>
            <i>Finished {moment(dt.finishedAt).calendar()}</i>
          </div>
        : null}
        {totalUnits > totalAll ?
          <div className='functionalFooter numBoxRadio blackFade'>
            <input type='radio' id='calcI' name='calc' onChange={()=> this.setState({countCalc: 'item'})} defaultChecked />
            <label htmlFor='calcI'>Boards</label>
            <input type='radio' id='calcU' name='calc' onChange={()=> this.setState({countCalc: 'unit'})} />
            <label htmlFor='calcU'>Units</label>
          </div>
        : null}
        {late ?
          <i
            title='Late'
            className='fa fa-exclamation-triangle fa-2x yellowT bottomRightFloat'
            aria-hidden='true'>
          </i>
        :null}
      </section>
    );
  }
}


export class StatusCell extends Component	{
  
  render() {
    return(
      <div className='centreRow'>
        {this.props.steps.map( (entry)=>{
          let rndmKey = Math.random().toString(36).substr(2, 5);
          const title = entry.type === 'finish' ||
                        entry.type === 'test' ?
                        entry.step :
                        entry.step + ' ' + entry.type;
          let count = this.props.calc ? entry.itemCount : entry.unitCount;
          let total = this.props.calc ? this.props.total : this.props.unitTotal;
          return(
            <ProgPie
              key={rndmKey}
              title={title}
              count={count}
              total={total} />
            );
        })}
      </div>
    );
  }
}