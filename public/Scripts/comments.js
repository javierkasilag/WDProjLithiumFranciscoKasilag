function saveComment(event) {
    event.preventDefault();
    const username = document.getElementById('usernameInput').value;
    const commentBody = document.getElementById('commentTextArea').value;
    if (!username || !commentBody) return;
    const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
    const newComment = {
        id: Date.now(),
        user: username,
        text: commentBody
    };
    existingComments.push(newComment);
    localStorage.setItem('twr_comments', JSON.stringify(existingComments));
    window.location.href = 'commentboard_page.html';
}

function deleteComment(commentId) {
    let existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
    existingComments = existingComments.filter(comment => comment.id !== commentId);
    localStorage.setItem('twr_comments', JSON.stringify(existingComments));
    location.reload();
}

function loadComments() {
    const feed = document.getElementById('commentFeed');
    if (!feed) return;
    const storedComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
    storedComments.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'comment-card';
        card.innerHTML = `
            <div class="user-info">
                <div class="profile-circle"></div>
                <span class="username-text">${comment.user}</span>
            </div>
            <div class="comment-box">
                <button class="delete-btn" onclick="deleteComment(${comment.id})">DELETE</button>
                [USER TRANSMISSION] ${comment.text}
            </div>
        `;
        feed.prepend(card);
    });
}

document.addEventListener('DOMContentLoaded', loadComments);