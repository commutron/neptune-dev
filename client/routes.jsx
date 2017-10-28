import React from 'react';
import {mount} from 'react-mounter';

import {BasicLayout} from './layouts/MainLayouts.jsx';
import {DashLayout} from './layouts/MainLayouts.jsx';
import {ProductionLayout} from './layouts/MainLayouts.jsx';
import {AnalyticsLayout} from './layouts/MainLayouts.jsx';

import DashData from './views/dashboard/DashData.jsx';
import ActivityData from './views/activity/ActivityData.jsx';
import ProdData from './views/production/ProdData.jsx';
import AnaData from './views/analytics/AnaData.jsx';
import AppData from './views/app/AppData.jsx';

import LandingWrap from './LandingWrap.jsx';

FlowRouter.route('/', {
  action() {
    mount(BasicLayout, {
       content: (<LandingWrap />),
       link: 'home'
    });
  }
});

FlowRouter.route('/activity', {
  action() {
    mount(BasicLayout, {
      content: (<ActivityData />),
      link: 'act'
    });
  }
});

FlowRouter.route('/dashboard', {
  action() {
    mount(DashLayout, {
      content: (<DashData />),
      link: 'dash'
    });
  }
});

FlowRouter.route('/production', {
  action() {
    mount(ProductionLayout, {
      content: (<ProdData />),
      link: 'prod'
    });
  }
});

FlowRouter.route('/analytics', {
  action() {
    mount(AnalyticsLayout, {
      content: (<AnaData />),
      link: 'ana'
    });
  }
});

FlowRouter.route('/app', {
  action() {
    mount(BasicLayout, {
       content: (<AppData />),
       link: 'app'
    });
  }
});




FlowRouter.route('/analytics/:postId', {
    // do some action for this route
    action: function(params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },
    name: "test" // optional
});
// FlowRouter.go('/analytics/my-post?comments=on&color=dark');


FlowRouter.notFound = {
  action() {
    mount(BasicLayout, {
      content: (<p>Page Not Found</p>),
      link: ''
    });
  }
};