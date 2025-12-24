# n8n-nodes-redlib

[n8n](https://n8n.io/) community node for fetching Reddit data through Redlib without OAuth authentication.

> **Disclaimer**: This project is not affiliated with, endorsed by, or connected to [Redlib](https://github.com/redlib-org/redlib) in any way. Redlib is a separate independent project. This node simply uses publicly accessible Redlib instances to fetch Reddit data.

## Why This Node?

In November 2025, Reddit introduced the [Responsible Builder Policy](https://www.reddit.com/r/redditdev/comments/1oug31u/introducing_the_responsible_builder_policy_new/), which significantly restricts the creation of new OAuth2 applications. Developers can no longer self-serve OAuth2 apps and must instead submit a support ticket with a low approval rate.

This node exists to help n8n users continue to fetch Reddit data for automation workflows without needing OAuth2 credentials. It uses [Redlib](https://github.com/redlib-org/redlib)—a private Reddit frontend—to scrape public Reddit data and return it in the same format as the Reddit API.

## What is Redlib?

Redlib is an alternative private front-end to Reddit. It provides a clean, privacy-focused interface for browsing Reddit without tracking. This node uses Redlib instances to fetch public Reddit data (posts, comments, subreddit information) and parses the HTML to return structured data compatible with the Reddit API format.

> **Note**: This project is independent from Redlib. For issues related to Redlib itself, please visit the [Redlib GitHub repository](https://github.com/redlib-org/redlib).

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

```bash
# In your n8n installation directory
npm install n8n-nodes-redlib
```

## Operations

### Post

| Operation | Description |
|-----------|-------------|
| **Search** | Search for posts in a subreddit by keyword |
| **Get** | Get a single post by ID |
| **Get Many** | Get multiple posts from a subreddit (hot/new/top/rising) |

### Post Comment

| Operation | Description |
|-----------|-------------|
| **Search** | Search for posts containing a keyword |
| **Get** | Get comments from a specific post |
| **Get Many** | Get comments from multiple posts |

### Subreddit

| Operation | Description |
|-----------|-------------|
| **Search** | Search for subreddits by keyword |
| **Get** | Get subreddit information |
| **Get Many** | Get multiple subreddits or trending subreddits |

## Credentials

**Redlib API** - Configure access to a Redlib instance.

| Property | Description |
|----------|-------------|
| **Instance URL** | URL of the Redlib instance to use (default: `https://redlib.catsarch.com`) |
| **Authentication** | None or Basic Auth (if your Redlib instance requires authentication) |
| **Username** | Username for Basic Auth (if required) |
| **Password** | Password for Basic Auth (if required) |

### Finding a Redlib Instance

You can use any public Redlib instance. A list of public instances is available at [redlibinstances.github.io](https://redlibinstances.github.io). Popular instances include:

- `https://redlib.catsarch.com`
- `https://redlib.privacydev.net`
- `https://redlib.nerdvpn.de`

> **Note**: Public instances may have rate limits. Consider hosting your own Redlib instance for production use.

## Compatibility

Minimum n8n version: **1.0.0**

Tested with n8n versions: **1.x**

## Usage

### Example: Get Posts from a Subreddit

1. Add the **Redlib** node to your workflow
2. Select **Post** > **Get Many** operation
3. Enter subreddit name (e.g., `technology`)
4. Select category (hot, new, top, or rising)
5. Set the limit for number of results

### Example: Search for Posts

1. Add the **Redlib** node to your workflow
2. Select **Post** > **Search** operation
3. Enter subreddit name (e.g., `SaaS`)
4. Enter search keyword (e.g., `marketing`)
5. Sort by relevance, hot, top, or new

### Example: Get Comments from a Post

1. Add the **Redlib** node to your workflow
2. Select **Post Comment** > **Get** operation
3. Enter subreddit name (e.g., `technology`)
4. Enter post ID (e.g., `1pudg98`)
5. Set the limit for number of comments

### Output Format

The node returns data in the same format as the Reddit API:

```json
{
  "kind": "Listing",
  "data": {
    "children": [
      {
        "kind": "t3",
        "data": {
          "id": "1pudg98",
          "title": "Post title",
          "author": "username",
          "subreddit": "SaaS",
          "selftext": "Post content",
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

## Support

If you find this node useful, please consider supporting its development:

<script type='text/javascript' src='https://storage.ko-fi.com/cdn/widget/Widget_2.js'></script><script type='text/javascript'>kofiwidget2.init('Support me on Ko-fi', '#72a4f2', 'Q5Q612M60I');kofiwidget2.draw();</script>

## Resources

* [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
* [Redlib GitHub Repository](https://github.com/redlib-org/redlib)
* [Public Redlib Instances](https://redlibinstances.github.io)
* [n8n Node Development Guide](https://docs.n8n.io/integrations/creating-nodes/)
