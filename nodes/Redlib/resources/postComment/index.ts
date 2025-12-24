import type { INodeProperties } from 'n8n-workflow';
import { postCommentSearchDescription } from './search';
import { postCommentGetDescription } from './get';
import { postCommentGetManyDescription } from './getAll';

const showOnlyForPostComment = { resource: ['postComment'] };

export const postCommentDescription: INodeProperties[] = [
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
  show: showOnlyForPostComment,
  },
  options: [
  {
   name: 'Search',
   value: 'search',
   description: 'Search for comments',
   action: 'Search for comments',
  },
  {
   name: 'Get',
   value: 'get',
   description: 'Get comments from a post',
   action: 'Get comments from a post',
  },
  {
   name: 'Get Many',
   value: 'getAll',
   description: 'Get multiple comments',
   action: 'Get multiple comments',
  },
  ],
  default: 'get',
 },
 ...postCommentSearchDescription,
 ...postCommentGetDescription,
 ...postCommentGetManyDescription,
];
