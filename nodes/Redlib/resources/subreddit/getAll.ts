import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubredditGetAll = { operation: ['getAll'], resource: ['subreddit'] };

export const subredditGetAllProperties: INodeProperties[] = [
  {
    displayName: 'Subreddits',
    name: 'subreddits',
    type: 'string',
    displayOptions: {
      show: showOnlyForSubredditGetAll,
    },
    default: '',
    required: true,
    placeholder: 'SaaS, technology, startups',
    description: 'Comma-separated list of subreddit names (without r/)',
  },
  {
    displayName: 'Trending Only',
    name: 'trending',
    type: 'boolean',
    displayOptions: {
      show: showOnlyForSubredditGetAll,
    },
    default: false,
    description: 'Whether filter to only trending subreddits',
  },
];
