import type { INodeProperties } from 'n8n-workflow';
import { postSearchDescription } from './search';
import { postGetDescription } from './get';
import { postGetManyDescription } from './getAll';

const showOnlyForPost = { resource: ['post'] };

export const postDescription: INodeProperties[] = [
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
  show: showOnlyForPost,
  },
  options: [
  {
   name: 'Search',
   value: 'search',
   description: 'Search for posts',
   action: 'Search for posts',
  },
  {
   name: 'Get',
   value: 'get',
   description: 'Get a single post',
   action: 'Get a single post',
  },
  {
   name: 'Get Many',
   value: 'getAll',
   description: 'Get multiple posts',
   action: 'Get multiple posts',
  },
  ],
  default: 'search',
 },
 ...postSearchDescription,
 ...postGetDescription,
 ...postGetManyDescription,
];
