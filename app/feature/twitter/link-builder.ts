export const birdWatchLinkFromPostId = (postId: string): string => {
  return `https://x.com/i/birdwatch/t/${postId}`;
};

export const postLinkFromPostId = (postId: string): string => {
  // X redirects to correct post url regardless of userId, so just specify `i`
  return `https://x.com/i/status/${postId}`;
};
