import React from 'react';
import {mount} from 'react-mounter';

import {ExploreLayout} from '/client/layouts/DataExploreLayout.jsx';
import DataData from './DataData.jsx';

FlowRouter.route('/data', {
  action() {
    mount(ExploreLayout, {
      content: (<DataData />),
      link: 'data'
    });
  }
});

// FlowRouter.go('/data/my-post?comments=on&color=dark');

FlowRouter.route('/data/:view', {
    // do some action for this route
    action: function(params, queryParams) {
      //console.log("Params:", params);
      //console.log("Query:", queryParams);
      mount(ExploreLayout, {
        content: (<DataData
                    view={params.view}
                    request={queryParams.request}
                    specify={queryParams.specify} />
                  ),
        link: 'data'
      });
    },
    name: 'explore' // optional
});