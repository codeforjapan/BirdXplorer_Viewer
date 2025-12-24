export const birdWatchLinkFromPostId = (postId: string): string => {
  return `https://x.com/i/birdwatch/t/${postId}`;
};

export const postLinkFromPostId = (postId: string): string => {
  // X redirects to correct post url regardless of userId, so just specify `i`
  return `https://x.com/i/status/${postId}`;
};

export const buildTwitterProfileUrl = (username: string): string => {
  // Remove @ if present
  const cleanUsername = username.startsWith("@") ? username.slice(1) : username;
  return `https://x.com/${cleanUsername}`;
};
