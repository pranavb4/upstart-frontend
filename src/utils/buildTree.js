// src/utils/buildTree.js
export const buildCommentTree = (comments) => {
  const commentMap = {};
  const roots = [];

  // 1. Initialize every comment with an empty children array
  comments.forEach(comment => {
    comment.children = [];
    commentMap[comment._id] = comment;
  });

  // 2. Link children to parents
  comments.forEach(comment => {
    if (comment.parentComment) {
      if (commentMap[comment.parentComment]) {
        commentMap[comment.parentComment].children.push(comment);
      }
    } else {
      // If no parent, it is a Top-Level comment
      roots.push(comment);
    }
  });

  return roots; // Return only the top-level nodes (children are nested inside)
};