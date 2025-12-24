import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPostGet = { operation: ['get'], resource: ['post'] };

export const postGetProperties: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForPostGet,
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
  show: showOnlyForPostGet,
  },
  default: '',
  required: true,
  placeholder: '1pudg98',
  description: 'The Reddit post ID (e.g., 1pudg98)',
 },
];
