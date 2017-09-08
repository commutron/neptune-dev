import React, {Component} from 'react';
import AnimateWrap from '/client/components/tinyUi/AnimateWrap.jsx';

import JumpButton from '../../../components/tinyUi/JumpButton.jsx';

export default class BatchesList extends Component	{

  render() {

    return (
      <AnimateWrap type='cardTrans'>
        <div className='section sidebar' key={1}>
          { this.props.batchData.map( (entry, index)=> {
          const style = entry.finishedAt === false ? 'jumpBar gMark' : 'jumpBar';
          const subW = this.props.widgetData.find( x => x._id === entry.widgetId);
          const subV = subW.versions.find( x => x.versionKey === entry.versionKey);
            return (
              <JumpButton
                key={index}
                title={entry.batch} 
                sub={subW.widget + ' v.' + subV.version}
                sty={style}
              />
            )})}
  			</div>
			</AnimateWrap>
    );
  }
}