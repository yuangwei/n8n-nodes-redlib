import {
 NodeConnectionTypes,
 type IExecuteFunctions,
 type INodeType,
 type INodeTypeDescription,
 type INodeExecutionData,
 type IHttpRequestOptions,
 type IHttpRequestMethods,
 type IDataObject,
} from 'n8n-workflow';
import { postDescription } from './resources/post';
import { postCommentDescription } from './resources/postComment';
import { subredditDescription } from './resources/subreddit';
import {
 parsePostElement,
 parseCommentElement,
 parseSubredditInfo,
 HTMLParser,
} from './shared/utils';

export class Redlib implements INodeType {
 description: INodeTypeDescription = {
  displayName: 'Redlib',
  name: 'redlib',
  icon: {
   light: 'file:../../icons/redlib.svg',
   dark: 'file:../../icons/redlib.dark.svg',
  },
  group: ['input'],
  version: 1,
  subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
  description: 'Fetch Reddit data through Redlib without OAuth',
  defaults: {
   name: 'Redlib',
  },
  usableAsTool: true,
  inputs: [NodeConnectionTypes.Main],
  outputs: [NodeConnectionTypes.Main],
  credentials: [
  {
   name: 'redlibApi',
   required: true,
  },
  ],
  requestDefaults: {
   baseURL: '={{$credentials.instanceUrl}}',
   headers: {
   Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
   'User-Agent': 'n8n-redlib-node/1.0',
   },
  },
  properties: [
  ...postDescription,
  ...postCommentDescription,
  ...subredditDescription,
  ],
 };

 async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const returnData: INodeExecutionData[] = [];
  const resource = this.getNodeParameter('resource', 0) as string;
  const operation = this.getNodeParameter('operation', 0) as string;

  // Get credentials
  const credentials = await this.getCredentials('redlibApi');
  const instanceUrl = credentials.instanceUrl as string;

  // HTTP request helper
  const makeRequest = async (url: string): Promise<string> => {
  const options: IHttpRequestOptions = {
   method: 'GET' as IHttpRequestMethods,
   url,
   headers: {
   Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
   'User-Agent': 'n8n-redlib-node/1.0',
   },
  };

  if (credentials.authType === 'basicAuth') {
   options.auth = {
   username: credentials.username as string,
   password: credentials.password as string,
   };
  }

  const response = await this.helpers.httpRequest(options);
  return response as string;
  };

  // POST operations
  if (resource === 'post') {
  if (operation === 'search') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const keyword = this.getNodeParameter('keyword', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;
   const sortBy = this.getNodeParameter('sortBy', 0) as string;
   const time = this.getNodeParameter('time', 0) as string;

   const url = `${instanceUrl}/r/${subreddit}/search?q=${encodeURIComponent(keyword)}&restrict_sr=on&sort=${sortBy}&t=${time}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const posts = $.findAll('.post');
   for (let i = 0; i < Math.min(posts.length, limit); i++) {
   const postData = parsePostElement($, posts[i]);
   children.push({
    kind: 't3',
    data: postData,
   });
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
  } else if (operation === 'get') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const postId = this.getNodeParameter('postId', 0) as string;

   const url = `${instanceUrl}/r/${subreddit}/comments/${postId}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const posts = $.findAll('.post');
   const postData = posts.length > 0 ? parsePostElement($, posts[0]) : {};

   returnData.push({
    json: {
    kind: 't3',
    data: postData,
    },
   });
  } else if (operation === 'getAll') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const category = this.getNodeParameter('category', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;

   const url = `${instanceUrl}/r/${subreddit}/${category}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const posts = $.findAll('.post');
   for (let i = 0; i < Math.min(posts.length, limit); i++) {
   const postData = parsePostElement($, posts[i]);
   children.push({
    kind: 't3',
    data: postData,
   });
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
  }
  }

  // POST_COMMENT operations
  if (resource === 'postComment') {
  if (operation === 'search') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const keyword = this.getNodeParameter('keyword', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;

   const url = `${instanceUrl}/r/${subreddit}/search?q=${encodeURIComponent(keyword)}&restrict_sr=on&sort=relevance`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const posts = $.findAll('.post');
   for (let i = 0; i < Math.min(posts.length, limit); i++) {
   const postData = parsePostElement($, posts[i]);
   children.push({
    kind: 't3',
    data: postData,
   });
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
  } else if (operation === 'get') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const postId = this.getNodeParameter('postId', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;

   const url = `${instanceUrl}/r/${subreddit}/comments/${postId}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const comments = $.findAll('.comment');
   for (let i = 0; i < Math.min(comments.length, limit); i++) {
   const commentData = parseCommentElement($, comments[i], 0);
   children.push({
    kind: 't1',
    data: commentData,
   });
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
  } else if (operation === 'getAll') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;
   const postIdsStr = this.getNodeParameter('postIds', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;
   const postIds = postIdsStr.split(',').map((id: string) => id.trim());

   for (const postId of postIds) {
   const url = `${instanceUrl}/r/${subreddit}/comments/${postId}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const comments = $.findAll('.comment');
   for (let i = 0; i < Math.min(comments.length, limit); i++) {
   const commentData = parseCommentElement($, comments[i], 0);
   children.push({
    kind: 't1',
    data: commentData,
   });
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
     postId,
    },
    },
   });
   }
  }
  }

  // SUBREDDIT operations
  if (resource === 'subreddit') {
  if (operation === 'search') {
   const keyword = this.getNodeParameter('keyword', 0) as string;
   const limit = this.getNodeParameter('limit', 0) as number;

   const url = `${instanceUrl}/search?q=${encodeURIComponent(keyword)}&type=sr&restrict_sr=`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const seenSubs = new Set<string>();
   const posts = $.findAll('.post');
   for (let i = 0; i < posts.length && children.length < limit; i++) {
   const subredditEls = posts[i].find('.post_subreddit');
   const subredditEl = subredditEls.length > 0 ? subredditEls[0] : null;
   const subreddit = subredditEl ? subredditEl.text().replace('r/', '').trim() : '';
   if (subreddit && !seenSubs.has(subreddit)) {
    seenSubs.add(subreddit);
    children.push({
     kind: 't5',
     data: {
      display_name: subreddit,
     },
    });
   }
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
  } else if (operation === 'get') {
   const subreddit = this.getNodeParameter('subreddit', 0) as string;

   const url = `${instanceUrl}/r/${subreddit}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const subredditData = parseSubredditInfo($);

   returnData.push({
    json: {
    kind: 't5',
    data: subredditData,
    },
   });
  } else if (operation === 'getAll') {
   const subredditsStr = this.getNodeParameter('subreddits', 0) as string;
   const trending = this.getNodeParameter('trending', 0) as boolean;
   const subreddits = subredditsStr.split(',').map((s: string) => s.trim());

   if (trending) {
   const url = `${instanceUrl}/r/popular`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const children: IDataObject[] = [];
   const seenSubs = new Set<string>();
   const posts = $.findAll('.post');
   for (const post of posts) {
   const subredditEls = post.find('.post_subreddit');
   const subredditEl = subredditEls.length > 0 ? subredditEls[0] : null;
   const subreddit = subredditEl ? subredditEl.text().replace('r/', '').trim() : '';
   if (subreddit && !seenSubs.has(subreddit)) {
    seenSubs.add(subreddit);
    children.push({
     kind: 't5',
     data: {
      display_name: subreddit,
     },
    });
   }
   }

   returnData.push({
    json: {
    kind: 'Listing',
    data: {
     children,
    },
    },
   });
   } else {
   for (const subreddit of subreddits) {
   const url = `${instanceUrl}/r/${subreddit}`;
   const html = await makeRequest(url);
   const $ = new HTMLParser(html);

   const subredditData = parseSubredditInfo($);
   returnData.push({
    json: {
    kind: 't5',
    data: subredditData,
    },
   });
   }
   }
  }
  }

  return [returnData];
 }
}
