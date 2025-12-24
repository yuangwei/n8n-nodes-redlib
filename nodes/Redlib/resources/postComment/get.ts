import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostCommentGet = { operation: ['get'], resource: ['postComment'] };

export const postCommentGetDescription: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentGet,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit containing the post',
 },
 {
  displayName: 'Post ID',
  name: 'postId',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostCommentGet,
  },
  default: '',
  required: true,
  placeholder: '1pudg98',
  description: 'The Reddit post ID',
 },
 {
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
		typeOptions: {
			minValue: 1,
		},
  displayOptions: {
  show: showOnlyForPostCommentGet,
  },
  default: 50,
  description: 'Max number of results to return',
 },
];
