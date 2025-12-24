import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostGetAll = { operation: ['getAll'], resource: ['post'] };

export const postGetManyDescription: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostGetAll,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit to get posts from',
 },
 {
  displayName: 'Category',
  name: 'category',
  type: 'options',
  displayOptions: {
  show: showOnlyForPostGetAll,
  },
  options: [
  {
   name: 'Hot Posts',
   value: 'hot',
  },
  {
   name: 'New Posts',
   value: 'new',
  },
  {
   name: 'Top Posts',
   value: 'top',
  },
  {
   name: 'Rising Posts',
   value: 'rising',
  },
  ],
  default: 'hot',
  description: 'The category of posts to retrieve',
 },
 {
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
		typeOptions: {
			minValue: 1,
		},
  displayOptions: {
  show: showOnlyForPostGetAll,
  },
  default: 50,
  description: 'Max number of results to return',
 },
];
