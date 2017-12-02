import React from 'react';
import {mount} from 'react-mounter';

import {BasicLayout} from './layouts/MainLayouts.jsx';
import {DashLayout} from './layouts/MainLayouts.jsx';
import {ProductionLayout} from './layouts/MainLayouts.jsx';
import {ExploreLayout} from './layouts/DataExploreLayout.jsx';
import {LabelLayout} from './layouts/MainLayouts.jsx';

import DashData from './views/dashboard/DashData.jsx';
import ActivityData from './views/activity/ActivityData.jsx';
import ProdData from './views/production/ProdData.jsx';
import DataData from './views/data/DataData.jsx';
import AppData from './views/app/AppData.jsx';

import GeneralLabel from './views/paper/GeneralLabel.jsx';

import LandingWrap from './LandingWrap.jsx';

// Client Side Colllections
AppDB = new Mongo.Collection('appdb');
GroupDB = new Mongo.Collection('groupdb');
WidgetDB = new Mongo.Collection('widgetdb');
BatchDB = new Mongo.Collection('batchdb');

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

FlowRouter.route('/app', {
  action() {
    mount(BasicLayout, {
       content: (<AppData />),
       link: 'app'
    });
  }
});

/*
FlowRouter.route('/analytics/:postId', {
    // do some action for this route
    action: function(params, queryParams) {
        console.log("Params:", params);
        console.log("Query Params:", queryParams);
    },
    name: "test" // optional
});
// FlowRouter.go('/analytics/my-post?comments=on&color=dark');
*/

FlowRouter.route('/print/generallabel/:batch', {
    action: function(params, queryParams) {
      if(queryParams !== null && typeof queryParams === 'object') {
        const request = Object.keys(queryParams);
        if(
          request.includes('group') &&
          request.includes('widget') &&
          request.includes('ver') &&
          request.includes('desc') &&
          request.includes('quant') &&
          request.includes('date')
        ) {
          mount(LabelLayout, {
            content: (<GeneralLabel batch={params.batch} data={queryParams} />)
          });
        }else{
          mount(BasicLayout, {
            content: (<p>Cannot Generate this page. Incomplete information</p>),
            link: ''
          });
        }
      }else{
        mount(BasicLayout, {
          content: (<p>Page Not Found</p>),
          link: ''
        });
      }
    },
    name: 'print'
});


FlowRouter.notFound = {
  action() {
    mount(BasicLayout, {
      content: (<p>Page Not Found</p>),
      link: ''
    });
  }
};