import type { IDataObject } from 'n8n-workflow';

// HTML Parser class (no external dependencies)
export class HTMLParser {
 private html: string;

 constructor(html: string) {
  this.html = html;
 }

 // Find all elements matching a selector (simple CSS subset)
 findAll(selector: string): HTMLElement[] {
  const results: HTMLElement[] = [];

  if (selector === '.post') {
  const regex = /<div[^>]*class="post[^"]*"[^>]*id="([^"]*)"(?:[\s\S]*?)<\/div>\s*(?=<div class="post"|<hr|<\/main>|<\/body>)/gi;
  let match;
  while ((match = regex.exec(this.html)) !== null) {
   results.push(new HTMLElement(match[0], this.html));
  }
  } else if (selector === '.comment') {
  const regex = /<div[^>]*class="comment[^"]*"(?:[\s\S]*?)<\/div>\s*(?=<div class="comment"|<\/div>\s*$)/gi;
  let match;
  while ((match = regex.exec(this.html)) !== null) {
   results.push(new HTMLElement(match[0], this.html));
  }
  } else if (selector === '#sub_title') {
  const regex = /<h1[^>]*id="sub_title"[^>]*>([^<]+)<\/h1>/i;
  const match = regex.exec(this.html);
  if (match) {
   results.push(new HTMLElement(match[0], this.html));
  }
  } else if (selector === '#sub_name') {
  const regex = /<p[^>]*id="sub_name"[^>]*>([^<]+)<\/p>/i;
  const match = regex.exec(this.html);
  if (match) {
   results.push(new HTMLElement(match[0], this.html));
  }
  } else if (selector === '#sub_description') {
  const regex = /<p[^>]*id="sub_description"[^>]*>([^<]+)<\/p>/i;
  const match = regex.exec(this.html);
  if (match) {
   results.push(new HTMLElement(match[0], this.html));
  }
  } else if (selector === '#sub_details div') {
  const regex = /<div[^>]*id="sub_details"[^>]*>[\s\S]*?<div[^>]*title="([^"]*)"[^>]*>/gi;
  let match;
  let count = 0;
  while ((match = regex.exec(this.html)) !== null && count < 2) {
   results.push(new HTMLElement(match[0], this.html));
   count++;
  }
  }

  return results;
 }

 findFirst(selector: string): HTMLElement | null {
  const results = this.findAll(selector);
  return results.length > 0 ? results[0] : null;
 }
}

class HTMLElement {
 private element: string;
 private fullHtml: string;

 constructor(element: string, fullHtml: string) {
  this.element = element;
  this.fullHtml = fullHtml;
 }

 attr(name: string): string | null {
  const regex = new RegExp(`\\s${name}="([^"]*)"`, 'i');
  const match = this.element.match(regex);
  return match ? match[1] : null;
 }

 text(): string {
  return this.element
   .replace(/<[^>]+>/g, '')
   .replace(/&nbsp;/g, ' ')
   .replace(/&amp;/g, '&')
   .replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"')
   .replace(/&#x27;/g, "'")
   .trim();
 }

 html(): string {
  return this.element;
 }

 find(selector: string): HTMLElement[] {
  // Simple descendant selector for common cases
  const results: HTMLElement[] = [];

  if (selector === '.post_title a') {
  const regex = /<h2[^>]*class="post_title"[^>]*>[\s\S]*?<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_subreddit') {
  const regex = /<a[^>]*class="post_subreddit"[^>]*>([^<]+)<\/a>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_author') {
  const regex = /<a[^>]*class="post_author[^"]*"[^>]*>([^<]*)<\/a>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.created') {
  const regex = /<span[^>]*class="created"[^>]*title="([^"]*)"[^>]*>([^<]*)<\/span>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_score') {
  const regex = /<div[^>]*class="post_score"[^>]*title="([^"]*)"[^>]*>[\s\S]*?<\/div>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_comments') {
  const regex = /<a[^>]*class="post_comments"[^>]*title="([^"]*)"[^>]*href="([^"]*)"[^>]*>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_body .md') {
  const regex = /<div[^>]*class="post_body[^"]*"[^>]*>[\s\S]*?<div[^>]*class="md"[^>]*>([\s\S]*?)<\/div>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  } else if (selector === '.post_flair span') {
  const regex = /<a[^>]*class="post_flair"[^>]*>[\s\S]*?<span>([^<]*)<\/span>/i;
  const match = this.element.match(regex);
  if (match) {
   results.push(new HTMLElement(match[0], this.fullHtml));
  }
  }

  return results;
 }

 findFirst(selector: string): HTMLElement | null {
  const results = this.find(selector);
  return results.length > 0 ? results[0] : null;
 }

 each(callback: (index: number, element: HTMLElement) => void | boolean): void {
  callback(0, this);
 }
}

// Reddit API output format
export interface RedditPost {
 kind: string;
 data: {
  id: string;
  title: string;
  author: string;
  subreddit: string;
  selftext: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  link_flair_text?: string;
 };
}

export interface RedditComment {
 kind: string;
 data: {
  id: string;
  author: string;
  body: string;
  score: number;
  created_utc: number;
  depth?: number;
  replies?: RedditCommentListing;
 };
}

export interface RedditCommentListing {
 kind: string;
 data: {
  children: RedditComment[];
 };
}

export interface RedditListing {
 kind: string;
 data: {
  children: Array<{ kind: string; data: IDataObject }>;
  after?: string;
  before?: string;
 };
}

export interface RedditSubreddit {
 kind: string;
 data: {
  display_name: string;
  title: string;
  description: string;
  subscribers: number;
  active_users: number;
  over18: boolean;
  public_description: string;
  subreddit_type: string;
  subscribers_known: number;
 };
}

// Parse timestamp string like "Dec 24 2025, 03:36:38 UTC" or "3h ago" to Unix timestamp
export function parseTimestamp(timestamp: string): number {
 // Try relative time first
 const relativeMatch = timestamp.match(/(\d+)([dhm])\s+ago/);
 if (relativeMatch) {
  const value = parseInt(relativeMatch[1], 10);
  const unit = relativeMatch[2];
  const now = Date.now() / 1000;
  switch (unit) {
  case 'd':
   return now - value * 86400;
  case 'h':
   return now - value * 3600;
  case 'm':
   return now - value * 60;
  }
 }

 // Try absolute timestamp like "Dec 24 2025, 03:36:38 UTC"
 const absoluteMatch = timestamp.match(/([A-Za-z]+ \d{2} \d{4}, \d{2}:\d{2}:\d{2}) UTC/);
 if (absoluteMatch) {
  const date = new Date(absoluteMatch[1] + ' UTC');
  return date.getTime() / 1000;
 }

 // Fallback to current time
 return Date.now() / 1000;
}

// Parse post score from HTML
export function parseScore(scoreText: string): number {
 if (scoreText === 'Hidden' || scoreText === '•') {
  return 0;
 }
 const match = scoreText.match(/(\d+)/);
 return match ? parseInt(match[1], 10) : 0;
}

// Parse number of comments
export function parseComments(commentsText: string): number {
 const match = commentsText.match(/(\d+) comments?/);
 return match ? parseInt(match[1], 10) : 0;
}

// Parse subscriber count
export function parseSubscribers(subscribersText: string): number {
 if (subscribersText.includes('k')) {
  return parseFloat(subscribersText.replace('k', '').replace(/,/g, '').trim()) * 1000;
 }
 if (subscribersText.includes('m')) {
  return parseFloat(subscribersText.replace('m', '').replace(/,/g, '').trim()) * 1000000;
 }
 return parseInt(subscribersText.replace(/,/g, ''), 10) || 0;
}

// Parse post element from Redlib HTML
export function parsePostElement($: HTMLParser, element: HTMLElement): IDataObject {
 const id = element.attr('id') || '';

 const titleElements = element.find('.post_title a');
 const titleEl = titleElements.length > 0 ? titleElements[0] : null;
 const title = titleEl ? titleEl.text().trim() : '';
 const url = titleEl ? titleEl.attr('href') || '' : '';

 const subredditElements = element.find('.post_subreddit');
 const subredditEl = subredditElements.length > 0 ? subredditElements[0] : null;
 const subreddit = subredditEl ? subredditEl.text().replace('r/', '').trim() : '';

 const authorElements = element.find('.post_author');
 const authorEl = authorElements.length > 0 ? authorElements[0] : null;
 const author = authorEl ? authorEl.text().replace('u/', '').trim() : '';

 const createdElements = element.find('.created');
 const createdEl = createdElements.length > 0 ? createdElements[0] : null;
 const createdText = createdEl ? (createdEl.attr('title') || createdEl.text() || '') : '';
 const createdUtc = parseTimestamp(createdText);

 const scoreElements = element.find('.post_score');
 const scoreEl = scoreElements.length > 0 ? scoreElements[0] : null;
 const scoreText = scoreEl ? (scoreEl.attr('title') || scoreEl.text() || '0') : '0';
 const score = parseScore(scoreText.trim());

 const commentsElements = element.find('.post_comments');
 const commentsEl = commentsElements.length > 0 ? commentsElements[0] : null;
 const commentsText = commentsEl ? commentsEl.attr('title') || commentsEl.text() || '0 comments' : '0 comments';
 const numComments = parseComments(commentsText);

 const bodyElements = element.find('.post_body .md');
 const bodyEl = bodyElements.length > 0 ? bodyElements[0] : null;
 let selftext = '';
 if (bodyEl) {
  selftext = bodyEl.html();
  // Convert HTML to plain text-ish format
  selftext = selftext
   .replace(/<p>/gi, '\n\n')
   .replace(/<\/p>/gi, '')
   .replace(/<br\s*\/?>/gi, '\n')
   .replace(/<[^>]*>/g, '')
   .replace(/&nbsp;/g, ' ')
   .replace(/&amp;/g, '&')
   .replace(/&lt;/g, '<')
   .replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"')
   .replace(/&#x27;/g, "'")
   .trim();
 }

 const flairElements = element.find('.post_flair span');
 const flairEl = flairElements.length > 0 ? flairElements[0] : null;
 const linkFlairText = flairEl ? flairEl.text().trim() : undefined;

 const commentsLink = commentsEl ? commentsEl.attr('href') || '' : '';
 const permalink = commentsLink || `/r/${subreddit}/comments/${id}/`;

 return {
  id,
  title,
  author,
  subreddit,
  selftext,
  score,
  num_comments: numComments,
  created_utc: createdUtc,
  permalink,
  url: url.startsWith('http') ? url : `https://www.reddit.com${url}`,
  ...(linkFlairText ? { link_flair_text: linkFlairText } : {}),
 };
}

// Parse comment element from Redlib HTML
export function parseCommentElement(
 $: HTMLParser,
 element: HTMLElement,
 depth = 0,
): IDataObject {
 const id = element.attr('data-id') || element.attr('id') || '';

 const authorElements = element.find('.comment_author');
 const authorEl = authorElements.length > 0 ? authorElements[0] : null;
 const author = authorEl ? authorEl.text().replace('u/', '').trim() : '';

 const bodyElements = element.find('.comment_body .md');
 const bodyEl = bodyElements.length > 0 ? bodyElements[0] : null;
 const body = bodyEl ? bodyEl.text().trim() : '';

 const scoreElements = element.find('.comment_score');
 const scoreEl = scoreElements.length > 0 ? scoreElements[0] : null;
 const scoreText = scoreEl ? scoreEl.text() || '0' : '0';
 const score = parseScore(scoreText.trim());

 const createdElements = element.find('.created');
 const createdEl = createdElements.length > 0 ? createdElements[0] : null;
 const createdText = createdEl ? (createdEl.attr('title') || createdEl.text() || '') : '';
 const createdUtc = parseTimestamp(createdText);

 return {
  id,
  author,
  body,
  score,
  created_utc: createdUtc,
  depth,
 };
}

// Parse subreddit info from sidebar
export function parseSubredditInfo($: HTMLParser): IDataObject {
 const titleEl = $.findFirst('#sub_title');
 const title = titleEl ? titleEl.text().trim() : '';

 const nameEl = $.findFirst('#sub_name');
 const name = nameEl ? nameEl.text().replace('r/', '').trim() : '';

 const descEl = $.findFirst('#sub_description');
 const description = descEl ? descEl.text().trim() : '';

 const detailsEls = $.findAll('#sub_details div');
 const membersText = detailsEls.length > 0 ? (detailsEls[0].attr('title') || detailsEls[0].text() || '0') : '0';
 const subscribers = parseSubscribers(membersText);

 const activeText = detailsEls.length > 1 ? (detailsEls[1].attr('title') || detailsEls[1].text() || '0') : '0';
 const activeUsers = parseSubscribers(activeText);

 return {
  display_name: name,
  title,
  description,
  subscribers,
  active_users: activeUsers,
  over18: false,
  public_description: description,
  subreddit_type: 'public',
  subscribers_known: subscribers,
 };
}
