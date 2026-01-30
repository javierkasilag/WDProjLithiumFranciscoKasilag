
function saveComment(event) {
    event.preventDefault();

    const username = document.getElementById('usernameInput').value;
    const commentBody = document.getElementById('commentTextArea').value;

    if (!username || !commentBody) return;

    const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];

    const newComment = {
        user: username,
        text: commentBody,
        timestamp: new Date().toLocaleDateString()
    };

    existingComments.push(newComment);
    localStorage.setItem('twr_comments', JSON.stringify(existingComments));


    window.location.href = 'commentboard_page.html';
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
                <span style="font-size: 0.8rem; color: #666; margin-left: auto;">${comment.timestamp}</span>
            </div>
            <div class="comment-box">
                [USER TRANSMISSION] ${comment.text}
            </div>
        `;
        feed.prepend(card);
    });
}

document.addEventListener('DOMContentLoaded', loadComments);