# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an n8n community node package starter template for building custom integrations for the n8n workflow automation platform. The package uses the `@n8n/node-cli` toolchain for building, linting, and development.

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Build with watch mode and start n8n with your node loaded (opens at localhost:5678) |
| `npm run build` | Compile TypeScript to JavaScript in `dist/` directory |
| `npm run build:watch` | Build in watch mode (auto-rebuild on changes) |
| `npm run lint` | Check code using n8n's linter |
| `npm run lint:fix` | Auto-fix linting issues |
| `npm publish` | Publish package to npm |

**Important**: Node.js v22 or higher is required.

## Architecture

### Node Registration

Nodes are registered in [package.json](package.json) under the `n8n` section:
- `n8n.nodes`: Array of paths to compiled node files (from `dist/`)
- `n8n.credentials`: Array of paths to compiled credential files (from `dist/`)
- `n8n.strict`: When `true`, enables strict mode for additional validation

### Two Node Implementation Styles

**1. Imperative Style** ([Example.node.ts](nodes/Example/Example.node.ts))
- Implements a custom `execute()` method
- Suitable for complex business logic or non-HTTP operations
- You manually control the entire execution flow

**2. Declarative Style** ([GithubIssues.node.ts](nodes/GithubIssues/GithubIssues.node.ts)) - *Recommended for HTTP APIs*
- Uses the low-code declarative approach with `routing` properties
- Operations define HTTP requests declaratively; n8n handles execution
- Significantly reduces boilerplate for REST API integrations

### Declarative Pattern Structure

For HTTP API nodes using the declarative style (recommended):

```
nodes/YourNode/
├── YourNode.node.ts          # Main node entry point
├── YourNode.node.json        # Node metadata
├── resources/
│   ├── resource1/
│   │   └── index.ts          # Resource operations with routing
│   └── resource2/
│       └── index.ts
├── listSearch/
│   ├── getItems.ts           # Dynamic dropdown search functions
│   └── ...
└── shared/
    ├── descriptions.ts       # Shared property definitions
    └── transport.ts          # Shared utilities (if needed)
```

Key patterns:
- **Routing**: Operations define HTTP requests via `routing.request` with `method`, `url` (supports expressions starting with `=`), and optional `body`
- **Resources**: Group related operations (e.g., "Issue" resource with get/getAll/create operations)
- **List Search**: Implement `listSearch` functions in the node's `methods` for dynamic dropdowns
- **Display Options**: Use `displayOptions.show` to conditionally show properties based on resource/operation selection

### Credential Pattern

Support multiple authentication methods by defining separate credential types:
- [GithubIssuesApi.credentials.ts](credentials/GithubIssuesApi.credentials.ts) - Personal Access Token
- [GithubIssuesOAuth2Api.credentials.ts](credentials/GithubIssuesOAuth2Api.credentials.ts) - OAuth2

Then use `displayOptions` in the node to show the appropriate credential based on user selection.

### Icon Convention

Provide both light and dark variants in [icons/](icons/):
- `filename.svg` - Light theme
- `filename.dark.svg` - Dark theme

## n8n Node Development Workflow

### Step-by-Step Guide for Creating a New Node

**1. Create Node Directory Structure**
```
nodes/YourNode/
├── YourNode.node.ts          # Main node entry point (class implementing INodeType)
├── YourNode.node.json        # Node metadata (categories, documentation URLs)
├── resources/
│   ├── resource1/
│   │   ├── index.ts          # Resource: defines operation options
│   │   ├── getAll.ts         # Operation-specific properties
│   │   ├── get.ts
│   │   └── create.ts
│   └── resource2/
├── listSearch/
│   ├── getItems.ts           # Dynamic dropdown search functions
│   └── ...
└── shared/
    ├── descriptions.ts       # Shared property definitions
    ├── transport.ts          # HTTP request helper (optional)
    └── utils.ts              # Utility functions
```

**2. Main Node File ([YourNode.node.ts](nodes/GithubIssues/GithubIssues.node.ts))**
```typescript
import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { resourceDescription } from './resources/resource';

export class YourNode implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Your Node Name',
        name: 'yourNodeName',           // CamelCase, used in URLs
        icon: { light: 'file:../../icons/youricon.svg', dark: 'file:../../icons/youricon.dark.svg' },
        group: ['input'],                // 'input' | 'output' | 'transform'
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Node description',
        defaults: { name: 'Your Node' },
        usableAsTool: true,
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],

        // Credentials (optional)
        credentials: [
            {
                name: 'yourApi',
                required: true,
            },
        ],

        // Default request config (for declarative style)
        requestDefaults: {
            baseURL: 'https://api.example.com',
            headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        },

        // Properties: authentication selector, resource selector, operation selector, etc.
        properties: [
            { displayName: 'Authentication', name: 'authentication', type: 'options', ... },
            { displayName: 'Resource', name: 'resource', type: 'options', ... },
            ...resourceDescription,
        ],
    };

    methods = {
        listSearch: { getItems, ... },  // For dynamic dropdowns
    };
}
```

**3. Resource Definition ([resources/resource/index.ts](nodes/GithubIssues/resources/issue/index.ts))**
```typescript
import type { INodeProperties } from 'n8n-workflow';
import { getAllDescription } from './getAll';
import { getDescription } from './get';

const showOnlyForResource = { resource: ['yourResource'] };

export const resourceDescription: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: showOnlyForResource },
        options: [
            {
                name: 'Get Many',
                value: 'getAll',
                routing: {
                    request: { method: 'GET', url: '=/endpoint' },
                },
            },
            // More operations...
        ],
        default: 'getAll',
    },
    // Operation-specific properties
    ...getAllDescription,
    ...getDescription,
];
```

**4. Operation Properties ([resources/resource/getAll.ts](nodes/GithubIssues/resources/issue/getAll.ts))**
```typescript
import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetAll = { operation: ['getAll'], resource: ['yourResource'] };

export const getAllDescription: INodeProperties[] = [
    {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: { show: { ...showOnlyForGetAll, returnAll: [false] } },
        routing: {
            send: { type: 'query', property: 'limit' },
        },
    },
    // More properties...
];
```

**5. List Search Functions ([listSearch/getItems.ts](nodes/GithubIssues/listSearch/getRepositories.ts))**
```typescript
import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';

export async function getItems(
    this: ILoadOptionsFunctions,
    filter?: string,
    paginationToken?: string,
): Promise<INodeListSearchResult> {
    const results = [
        { name: 'Item 1', value: 'item1', url: 'https://example.com/1' },
        // ...
    ];
    return { results, paginationToken: undefined };  // paginationToken for next page
}
```

**6. Shared Transport ([shared/transport.ts](nodes/GithubIssues/shared/transport.ts))** - Optional helper for custom HTTP requests
```typescript
export async function apiRequest(
    this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
    method: IHttpRequestMethods,
    resource: string,
    qs?: IDataObject,
    body?: IDataObject,
) {
    const options: IHttpRequestOptions = {
        method,
        qs,
        body,
        url: `https://api.example.com${resource}`,
    };
    return this.helpers.httpRequestWithAuthentication.call(this, 'credentialName', options);
}
```

**7. Credential Definition ([credentials/YourApi.credentials.ts](credentials/GithubIssuesApi.credentials.ts))**
```typescript
export class YourApi implements ICredentialType {
    name = 'yourApi';
    displayName = 'Your API';
    properties: INodeProperties[] = [
        { displayName: 'API Key', name: 'apiKey', type: 'string', typeOptions: { password: true } },
    ];
    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: { Authorization: '={{$credentials?.apiKey}}' },
        },
    };
}
```

**8. Node Metadata ([YourNode.node.json](nodes/GithubIssues/GithubIssues.node.json))**
```json
{
    "node": "n8n-nodes-your-node",
    "nodeVersion": "1.0",
    "codexVersion": "1.0",
    "categories": ["Communication", "Miscellaneous"],
    "resources": {
        "credentialDocumentation": [{ "url": "https://..." }],
        "primaryDocumentation": [{ "url": "https://..." }]
    }
}
```

**9. Update [package.json](package.json)**
- Add node to `n8n.nodes` array
- Add credential to `n8n.credentials` array (if any)

**10. Create Icons** in `icons/` directory
- `youricon.svg` - Light theme
- `youricon.dark.svg` - Dark theme

### Key Concepts

**Property Display Options**
- `displayOptions.show`: Show property only when conditions match (e.g., specific resource/operation)
- `displayOptions.hide`: Hide property when conditions match

**Routing Configuration** (Declarative Style)
- `routing.request`: Define HTTP request (method, url, body)
- `routing.send`: Map property to request (query, body, header)
- `routing.output`: Configure output behavior (pagination)
- URL expressions starting with `=` are evaluated as n8n expressions

**Resource Locator Type**
- `type: 'resourceLocator'` with multiple modes (list, url, name)
- Supports dynamic dropdowns via `searchListMethod`
- Can extract values from URLs using regex

**For Web Scraping Nodes** (like Redlib)
Since scraping doesn't fit the HTTP API pattern, use **Imperative Style** with custom `execute()`:
1. Make HTTP request to get HTML
2. Parse HTML (using cheerio or similar)
3. Transform to structured JSON
4. Return data as `INodeExecutionData[]`

## Redlib Node Architecture

### Overview

Redlib is a web scraping node that fetches data from Redlib (a private Reddit frontend) and returns it in the same format as the Reddit API. This allows n8n workflows to access Reddit data without OAuth authentication.

### Data Structure

The `data/` directory contains reference files:
- `redlib/*.html` - Sample Redlib HTML pages to parse
- `reddit/*.json` - Target Reddit API JSON output format
- `options/options.md` - n8n Reddit node configuration reference

### Resources and Operations

| Resource | Operations | Redlib URL Pattern |
|----------|------------|-------------------|
| **Post** | Search, Get, Get Many | `/r/{subreddit}/search`, `/r/{subreddit}/comments/{id}`, `/r/{subreddit}/{sort}` |
| **Post Comment** | Search, Get, Get Many | `/r/{subreddit}/comments/{post_id}/` |
| **Subreddit** | Search, Get, Get Many | `/r/{subreddit}`, `/r/{subreddit}/search` |

### Operation Parameters

| Parameter | Used By | Description |
|-----------|---------|-------------|
| Subreddit | All operations | Target subreddit name |
| Post ID | Get post, Get comments | Reddit post ID (e.g., `1pudg98`) |
| Category | Get Many posts | `hot`, `new`, `top`, `rising` |
| Keyword | Search operations | Search query string |
| Trending | Get Many subreddits | Boolean filter |
| Limit | Get Many operations | Max results to return |

### HTML Parsing Targets

**Post Data** (from `post` class elements):
- `post_title` - Post title
- `post_body` or `.md` - Post content
- `post_score` - Upvote count
- `post_author` - Author username
- `created` - Timestamp
- `post_comments` - Comment count
- `post_flair` - Flair text (if present)

**Comment Data** (from `comment` class elements):
- `comment_author` - Author username
- `comment_body` - Comment content
- `comment_score` - Upvote count
- `created` - Timestamp
- Nested `replies` blockquote for threading

**Subreddit Data** (from sidebar/panel):
- `sub_title` - Subreddit title
- `sub_name` - Subreddit name
- `sub_description` - Description text
- `sub_details` - Member count

### Output Transformation

Parse Redlib HTML and transform to Reddit API format:
```json
{
  "kind": "Listing",
  "data": {
    "children": [
      {
        "kind": "t3",
        "data": {
          "id": "1pudg98",
          "title": "...",
          "author": "Old-Capital-4104",
          "subreddit": "SaaS",
          "selftext": "...",
          "score": 74,
          "num_comments": 52,
          "created_utc": 1766547398.0,
          "permalink": "/r/SaaS/comments/1pudg98/...",
          "url": "https://www.reddit.com/..."
        }
      }
    ]
  }
}
```

## Debugging

VSCode launch configuration is provided in [launch.json](.vscode/launch.json) for attaching to a running n8n process.

## Publishing

Before publishing:
1. Update `package.json` metadata (name, author, repository, description)
2. Replace README.md with your node's documentation
3. Ensure MIT license in [LICENSE.md](LICENSE.md)
4. Run `npm run build` to compile
5. Run `npm publish`

For n8n Cloud verification, submit through the [n8n Creator Portal](https://creators.n8n.io/nodes).
