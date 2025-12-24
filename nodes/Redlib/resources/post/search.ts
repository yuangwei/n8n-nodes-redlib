import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostSearch = { operation: ['search'], resource: ['post'] };

export const postSearchProperties: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostSearch,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit to search in (e.g., SaaS, technology)',
 },
 {
  displayName: 'Keyword',
  name: 'keyword',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostSearch,
  },
  default: '',
  required: true,
  placeholder: 'saas marketing',
  description: 'The keyword to search for',
 },
 {
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  typeOptions: {
  minValue: 1,
  },
  displayOptions: {
  show: showOnlyForPostSearch,
  },
  default: 50,
  description: 'Max number of results to return',
 },
 {
  displayName: 'Sort By',
  name: 'sortBy',
  type: 'options',
  displayOptions: {
  show: showOnlyForPostSearch,
  },
  options: [
  {
   name: 'Comments',
   value: 'comments',
  },
  {
   name: 'Hot',
   value: 'hot',
  },
  {
   name: 'New',
   value: 'new',
  },
  {
   name: 'Relevance',
   value: 'relevance',
  },
  {
   name: 'Top',
   value: 'top',
  },
  ],
  default: 'relevance',
 },
 {
  displayName: 'Time',
  name: 'time',
  type: 'options',
  displayOptions: {
  show: {
   ...showOnlyForPostSearch,
   sortBy: ['top', 'relevance'],
  },
  },
  options: [
  {
   name: 'All Time',
   value: 'all',
  },
  {
   name: 'Day',
   value: 'day',
  },
  {
   name: 'Hour',
   value: 'hour',
  },
  {
   name: 'Month',
   value: 'month',
  },
  {
   name: 'Week',
   value: 'week',
  },
  {
   name: 'Year',
   value: 'year',
  },
  ],
  default: 'all',
 },
];
