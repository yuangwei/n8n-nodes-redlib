import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostCommentGetAll = { operation: ['getAll'], resource: ['postComment'] };

export const postCommentGetManyDescription: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentGetAll,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit containing the posts',
 },
 {
  displayName: 'Post IDs',
  name: 'postIds',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentGetAll,
  },
  default: '',
  required: true,
  placeholder: '1pudg98, 1puf3qa, 1pu8mi9',
  description: 'Comma-separated list of Reddit post IDs',
 },
 {
  displayName: 'Limit per Post',
  name: 'limit',
  type: 'number',
		typeOptions: {
			minValue: 1,
		},
  displayOptions: {
  show: showOnlyForPostCommentGetAll,
  },
  default: 50,
  description: 'Max number of results to return',
 },
];
