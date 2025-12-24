import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubredditGet = { operation: ['get'], resource: ['subreddit'] };

export const subredditGetDescription: INodeProperties[] = [
 {
  displayName: 'Subreddit',
  name: 'subreddit',
  type: 'string',
  displayOptions: {
  show: showOnlyForSubredditGet,
  },
  default: '',
  required: true,
  placeholder: 'SaaS',
  description: 'The subreddit name (without r/)',
 },
];
