import type { INodeProperties } from 'n8n-workflow';
import { subredditSearchDescription } from './search';
import { subredditGetDescription } from './get';
import { subredditGetManyDescription } from './getAll';

const showOnlyForSubreddit = { resource: ['subreddit'] };

export const subredditDescription: INodeProperties[] = [
 {
  displayName: 'Resource',
  name: 'resource',
  type: 'options',
  noDataExpression: true,
  options: [
  {
   name: 'Post',
   value: 'post',
   description: 'Reddit posts',
  },
  {
   name: 'Post Comment',
   value: 'postComment',
   description: 'Comments on posts',
  },
  {
   name: 'Subreddit',
   value: 'subreddit',
   description: 'Subreddit information',
  },
  ],
  default: 'post',
 },
 {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
  show: showOnlyForSubreddit,
  },
  options: [
  {
   name: 'Search',
   value: 'search',
   description: 'Search for subreddits',
   action: 'Search for subreddits',
  },
  {
   name: 'Get',
   value: 'get',
   description: 'Get subreddit info',
   action: 'Get subreddit info',
  },
  {
   name: 'Get Many',
   value: 'getAll',
   description: 'Get multiple subreddits',
   action: 'Get multiple subreddits',
  },
  ],
  default: 'get',
 },
 ...subredditSearchDescription,
 ...subredditGetDescription,
 ...subredditGetManyDescription,
];
