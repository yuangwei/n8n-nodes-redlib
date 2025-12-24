import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubredditSearch = { operation: ['search'], resource: ['subreddit'] };

export const subredditSearchProperties: INodeProperties[] = [
  {
    displayName: 'Keyword',
    name: 'keyword',
    type: 'string',
    displayOptions: {
      show: showOnlyForSubredditSearch,
    },
    default: '',
    required: true,
    placeholder: 'technology',
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
      show: showOnlyForSubredditSearch,
    },
    default: 50,
    description: 'Max number of results to return',
  },
];
