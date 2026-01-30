let notificationCallback = null;

const emojiList = [
    "😀","😃","😄","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😋","😛","😜","🤪","😎",
    "🥳","😏","😒","😞","😔","😟","😕","☹️","😣","😖","😫","😩","🥺","😢","😭","😤","😠","😡","🤬","🤯",
    "😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🤭","🤫","🤥","😶","😐","😑","😬","🙄","😯","😦",
    "😧","😮","😲","🥱","😴","🤤","😪","😵","🤐","🥴","🤢","🤮","🤧","😷","🤒","🤕","🤑","🤠","😈","👿",
    "🤡","💩","👻","💀","☠️","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","👋","🤚","🖐",
    "✋","🖖","👌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","👇","👍","👎","✊","👊","🤛","🤜","👏",
    "🙌","👐","🤲","🤝","🙏","💪","🧠","👀","👁️","💋","👄","🦷","👅","❤","🧡","💛","💚","💙","💜","🤎",
    "🖤","🤍","💔","❣","💕","💞","💓","💗","💖","💘","💝","🔥","✨","🌟","⭐","🎵","🎶","❗","❓","💤"
];

function togglePasswordVisibility() {
    const passInput = document.getElementById('userPassword');
    passInput.type = passInput.type === 'password' ? 'text' : 'password';
}

function showTerminalNotification(message, type, callback = null) {
    const modal = document.getElementById('terminalModal');
    const msgBox = document.getElementById('modalMessage');
    const titleBox = document.getElementById('modalTitle');
    const inputField = document.getElementById('modalInput');
    const actionBtn = document.getElementById('modalActionBtn');
    const emojiBtn = document.getElementById('emojiToggleModal');

    modal.style.display = 'flex';
    msgBox.innerText = message;
    notificationCallback = callback;

    modal.classList.remove('modal-error', 'modal-success', 'modal-prompt');
    inputField.style.display = 'none';
    inputField.value = '';
    if(emojiBtn) emojiBtn.style.display = 'none';

    if (type === 'error') {
        modal.classList.add('modal-error');
        titleBox.innerText = ">> SYSTEM ERROR";
        actionBtn.innerText = "ACKNOWLEDGE";
    } else if (type === 'success') {
        modal.classList.add('modal-success');
        titleBox.innerText = ">> SUCCESS";
        actionBtn.innerText = "PROCEED";
    } else if (type === 'prompt') {
        modal.classList.add('modal-prompt');
        titleBox.innerText = ">> AUTHENTICATION REQUIRED";
        inputField.style.display = 'block';
        inputField.focus();
        actionBtn.innerText = "SUBMIT";
        
        if (message === "ENTER NEW CONTENT:") {
             if(emojiBtn) emojiBtn.style.display = 'block';
        }
    }
}

function handleModalAction() {
    const modal = document.getElementById('terminalModal');
    const inputVal = document.getElementById('modalInput').value;

    if (notificationCallback) {
        notificationCallback(inputVal);
    } else {
        modal.style.display = 'none';
    }
}

function toggleEmojiPicker(gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    if (grid.style.display === 'grid') {
        grid.style.display = 'none';
    } else {
        if (grid.innerHTML === '') {
            emojiList.forEach(emoji => {
                const span = document.createElement('span');
                span.className = 'emoji-item';
                span.innerText = emoji;
                span.onclick = () => insertEmoji(emoji, gridId);
                grid.appendChild(span);
            });
        }
        grid.style.display = 'grid';
    }
}

function insertEmoji(emoji, gridId) {
    let targetInput;
    if (gridId === 'creatorEmojiGrid') {
        targetInput = document.getElementById('commentTextArea');
    } else if (gridId === 'modalEmojiGrid') {
        targetInput = document.getElementById('modalInput');
    }

    if (targetInput) {
        const start = targetInput.selectionStart;
        const end = targetInput.selectionEnd;
        const text = targetInput.value;
        targetInput.value = text.substring(0, start) + emoji + text.substring(end);
        targetInput.selectionStart = targetInput.selectionEnd = start + emoji.length;
        targetInput.focus();
    }
    document.getElementById(gridId).style.display = 'none';
}

function saveComment(event) {
    event.preventDefault();
    const identifier = document.getElementById('userIdentifier').value;
    const password = document.getElementById('userPassword').value;
    const commentBody = document.getElementById('commentTextArea').value;

    if (!identifier || !password || !commentBody) {
        showTerminalNotification("DATA PACKET INCOMPLETE. ALL FIELDS REQUIRED.", "error");
        return;
    }

    const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
    const userMatch = existingComments.find(c => c.user === identifier);
    if (userMatch && userMatch.pass !== password) {
        showTerminalNotification("IDENTITY CONFLICT: INCORRECT PASSWORD FOR THIS USER ID.", "error");
        return;
    }

    const newComment = {
        id: Date.now(),
        user: identifier,
        pass: password,
        text: commentBody
    };

    existingComments.push(newComment);
    localStorage.setItem('twr_comments', JSON.stringify(existingComments));
    
    showTerminalNotification("TRANSMISSION UPLOADED SUCCESSFULLY.", "success", () => {
        window.location.href = 'commentboard_page.html';
    });
}

function performDeletion(id) {
    const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
    const updatedComments = existingComments.filter(c => c.id !== id);
    localStorage.setItem('twr_comments', JSON.stringify(updatedComments));
    
    document.getElementById('terminalModal').style.display = 'none';
    setTimeout(() => location.reload(), 100);
}

function deleteComment(commentId) {
    showTerminalNotification("ENTER ACCESS KEY TO DELETE:", "prompt", (inputPass) => {
        const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
        const commentToDelete = existingComments.find(c => c.id === commentId);

        if (!commentToDelete) return;

        if (inputPass === commentToDelete.pass) {
            performDeletion(commentId);
        } else if (inputPass === "password1") {
            document.getElementById('terminalModal').style.display = 'none';
            setTimeout(() => {
                showTerminalNotification("ENTER ADMIN IDENTIFICATION:", "prompt", (adminId) => {
                    if (adminId === "noahconnorcfrancisco@gmail.com") {
                        performDeletion(commentId);
                    } else {
                        showTerminalNotification("ADMIN VERIFICATION FAILED.", "error");
                    }
                });
            }, 200);
        } else {
            showTerminalNotification("ACCESS DENIED: INVALID KEY", "error");
        }
    });
}

function editComment(commentId) {
    showTerminalNotification("ENTER ACCESS KEY TO EDIT:", "prompt", (inputPass) => {
        const existingComments = JSON.parse(localStorage.getItem('twr_comments')) || [];
        const index = existingComments.findIndex(c => c.id === commentId);

        if (index !== -1 && inputPass === existingComments[index].pass) {
            document.getElementById('terminalModal').style.display = 'none';
            setTimeout(() => {
                showTerminalNotification("ENTER NEW CONTENT:", "prompt", (newText) => {
                    if (newText) {
                        existingComments[index].text = newText;
                        localStorage.setItem('twr_comments', JSON.stringify(existingComments));
                        location.reload();
                    }
                });
                document.getElementById('modalInput').value = existingComments[index].text; 
            }, 200);
        } else {
             showTerminalNotification("ACCESS DENIED: INVALID KEY", "error", () => {
                 document.getElementById('terminalModal').style.display = 'none';
             });
        }
    });
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
                <div class="comment-actions">
                    <button class="edit-btn" onclick="editComment(${comment.id})">EDIT</button>
                    <button class="delete-btn" onclick="deleteComment(${comment.id})">DELETE</button>
                </div>
                [USER TRANSMISSION] ${comment.text}
            </div>
        `;
        feed.prepend(card);
    });
}

document.addEventListener('DOMContentLoaded', loadComments);