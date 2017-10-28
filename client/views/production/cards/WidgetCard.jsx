import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpText from '../../../components/tinyUi/JumpText.jsx';

import BatchesList from '../lists/BatchesList.jsx';

export default class WidgetCard extends Component {

  render() {

    let g = this.props.groupData;
    let w = this.props.widgetData;
    let b = this.props.batchRelated;
    
    const v = w.versions.sort((v1, v2)=> {
                if (v1.version < v2.version) { return 1 }
                if (v1.version > v2.version) { return -1 }
                return 0;
              });

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={w.widget}>
          <div className='space'>
            <JumpText title={g.alias} link={g.alias} />
            <h2 className='cap'>{w.widget}</h2>
            <h3 className='cap'>{w.describe}</h3>
            <h3>
              {v.map( (entry)=>{
                let live = entry.live ? '' : 'fade';
                return(
                  <span key={entry.versionKey}>
                    <i className={live}>{entry.version}</i>
                    <i className='breath'></i>
                  </span>
                )})}
            </h3>
            
          </div>
            
            <hr />
            
            <BatchesList
              batchData={b}
              widgetData={[w]} />
              
        </div>
      </AnimateWrap>
    );
  }
}