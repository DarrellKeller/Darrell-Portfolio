import type { Post } from '../types';

export function slugifyPostTitle(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || 'star';
}

export function buildPostPath(post: Post) {
  return `/stars/${slugifyPostTitle(post.title)}/${post.id}`;
}
