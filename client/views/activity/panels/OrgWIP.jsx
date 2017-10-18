import React, {Component} from 'react';
import moment from 'moment';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';
import Pref from '/client/global/pref.js';

import ProgPolar from '/client/components/charts/ProgPolar.jsx';

export default class OrgWIP extends Component	{
  
  constructor() {
    super();
    this.state = {
      wip: false,
    };
  }
  
  relevant() {
    const b = this.props.b;
    const now = moment();
    const thisWeek = (fin)=> { return ( moment(fin).isSame(now, 'week') ) };
    const live = b.filter( x => x.finishedAt === false || thisWeek(x.finishedAt) === true );
    
    Meteor.call('WIPProgress', live, (error, reply)=> {
      error ? console.log(error) : null;
      this.setState({'wip': reply});
    });
  }


  render() {
    
    const wip = this.state.wip;
    
    if(!wip) {
      return (
        <div className='centreTrue'>
          loading...
        </div>
      );
    }
    
    return (
      <AnimateWrap type='cardTrans'>
        <div className='section space' key={0}>
          <div className='wipTable'>
            {wip.map( (entry, index)=>{
              return(
                <StatusRow key={index} entry={entry} />
              )})}
          </div>
        </div>
      </AnimateWrap>
    );
  }
  componentDidMount() {
    this.relevant();
  }
}



export class StatusRow extends Component	{
  
  
  render() {
    
    let dt = this.props.entry;
    
    const countsR = Array.from(dt.stepsReg, x => x.count);
    const titlesR = Array.from(dt.stepsReg, x => x.step + ' ' + x.type);
    const countsA = Array.from(dt.stepsAlt, x => x.count);
    const titlesA = Array.from(dt.stepsAlt, x => x.step + ' ' + x.type);
    
    return(
      <section>
        <div className='wellSpacedLine blackFade'>
          <span className='big'>{dt.batch}</span>
          <span className='up'>{dt.group} {dt.widget}</span>
          <span>Total {Pref.item}s: {dt.totalR + dt.totalA}</span>
          {dt.totalA > 0 ? <span>Reg: {dt.totalR}, Alt: {dt.totalA}</span> : null}
          {dt.scrap > 0 ? <span className='redT'>Scraps: {dt.scrap}</span> : null}
          {dt.rma > 0 ? <span className='redT'>RMAs: {dt.rma}</span> : null}
          <span>
            {dt.finished ?
              <span className='greenT'>Finished {moment(dt.finishedAt).calendar()}</span>
            : null}
          </span>
        </div>
        <div className='centreRow'>
          {dt.stepsReg.length > 0 ?
            <StatusCell steps={titlesR} counts={countsR} total={dt.totalR} />
          :
            dt.totalR + dt.totalA < 1 ?
              <span className='yellowT wide centreText'>No {Pref.item}s created</span>
            :
              <span className='yellowT wide centreText'>No {Pref.flow} chosen</span>
          }
        </div>
        {dt.stepsAlt.length > 0 ?
          <div>
            <hr />
            <span className='small cap wellSpacedLine lAlign'>
              <i className='fa fa-asterisk fa-lg' aria-hidden='true'></i>
              <i>{Pref.buildFlowAlt}</i>
            </span>
            <div className='centreRow'>
              <StatusCell steps={titlesA} counts={countsA} total={dt.totalA} />
            </div>
          </div>
        :null}
      </section>
    );
  }
}


export class StatusCell extends Component	{
  
  
  render() {
    /*
    let stp = this.props.step;
    
    const title = stp.type === 'finish' ||
                  stp.type === 'test' ?
                  stp.step :
                  stp.step + ' ' + stp.type;
    */
    
    console.log(this.props.total);
    return(
      <ProgPolar
        steps={this.props.steps}
        counts={this.props.counts}
        total={this.props.total} />
    );
  }
}