import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostCommentSearch = { operation: ['search'], resource: ['postComment'] };

export const postCommentSearchDescription: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentSearch,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit to search in',
 },
 {
  displayName: 'Keyword',
  name: 'keyword',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentSearch,
  },
  default: '',
  required: true,
  placeholder: 'marketing',
  description: 'The keyword to search for in comments',
 },
 {
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
		typeOptions: {
			minValue: 1,
		},
  displayOptions: {
  show: showOnlyForPostCommentSearch,
  },
  default: 50,
  description: 'Max number of results to return',
 },
];
