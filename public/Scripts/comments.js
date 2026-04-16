// ============================================================
// STORAGE KEYS — centralised so they're easy to swap out
// ============================================================
const STORAGE_COMMENTS = 'twr_comments';
const STORAGE_USERS    = 'twr_users';    // { username, password }[]
const STORAGE_SESSION  = 'twr_session';  // string (username) | null
const STORAGE_REDIRECT = 'twr_redirect'; // URL to return to after login
 
// ============================================================
// SESSION HELPERS
// ============================================================
 
// Returns the currently logged-in username, or null
function getSession() {
    return localStorage.getItem(STORAGE_SESSION);
}
 
// Redirects to login if not authenticated; saves current URL so
// login can bounce the user back afterward
function requireLogin() {
    if (!getSession()) {
        localStorage.setItem(STORAGE_REDIRECT, window.location.href);
        window.location.href = 'login_page.html';
    }
}
 
// Clears session and goes back to login
function logout() {
    localStorage.removeItem(STORAGE_SESSION);
    window.location.href = 'login_page.html';
}
 
// ============================================================
// TOPBAR SESSION DISPLAY
// Called on every protected page to show username + logout btn
// ============================================================
function renderSessionBar() {
    const bar = document.getElementById('topbarSession');
    if (!bar) return;
    const user = getSession();
    if (user) {
        bar.innerHTML = `
            <span class="session-username">> ${user}</span>
            <button class="logout-btn" onclick="logout()">LOG OUT</button>
        `;
    }
}
 
// ============================================================
// SIGNUP
// Writes a new { username, password } record to twr_users
// ============================================================
function signup(event) {
    event.preventDefault();
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
 
    if (!username || !password) {
        showTerminalNotification("ALL FIELDS REQUIRED.", "error");
        return;
    }
 
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
 
    // Reject duplicate usernames
    if (users.find(u => u.username === username)) {
        showTerminalNotification("USERNAME ALREADY REGISTERED.", "error");
        return;
    }
 
    users.push({ username, password });
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
 
    showTerminalNotification("ACCOUNT CREATED. REDIRECTING TO LOGIN.", "success", () => {
        window.location.href = 'login_page.html';
    });
}
 
// ============================================================
// LOGIN
// Validates credentials and sets twr_session on success
// ============================================================
function login(event) {
    event.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
 
    const users = JSON.parse(localStorage.getItem(STORAGE_USERS)) || [];
    const match  = users.find(u => u.username === username && u.password === password);
 
    if (!match) {
        showTerminalNotification("INVALID CREDENTIALS.", "error");
        return;
    }
 
    localStorage.setItem(STORAGE_SESSION, username);
 
    // Return to whichever page triggered the login redirect, or default to board
    const redirect = localStorage.getItem(STORAGE_REDIRECT) || 'commentboard_page.html';
    localStorage.removeItem(STORAGE_REDIRECT);
 
    showTerminalNotification("ACCESS GRANTED.", "success", () => {
        window.location.href = redirect;
    });
}
 
// ============================================================
// EMOJI LIST
// ============================================================
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
 
// ============================================================
// PASSWORD VISIBILITY TOGGLE
// inputId / iconId are optional — defaults match the creator page
// ============================================================
function togglePasswordVisibility(inputId, iconId) {
    const passInput = document.getElementById(inputId || 'userPassword');
    const eyeIcon   = document.getElementById(iconId   || 'eyeIcon');
    if (!passInput || !eyeIcon) return;
 
    if (passInput.type === 'password') {
        passInput.type  = 'text';
        eyeIcon.src     = 'assets/open.png';
    } else {
        passInput.type  = 'password';
        eyeIcon.src     = 'assets/closed.png';
    }
}
 
// ============================================================
// TERMINAL MODAL
// ============================================================
let notificationCallback = null;
 
function showTerminalNotification(message, type, callback = null) {
    const modal    = document.getElementById('terminalModal');
    const msgBox   = document.getElementById('modalMessage');
    const titleBox = document.getElementById('modalTitle');
    const inputField = document.getElementById('modalInput');
    const actionBtn  = document.getElementById('modalActionBtn');
    const emojiBtn   = document.getElementById('emojiToggleModal');
 
    modal.style.display = 'flex';
    msgBox.innerText     = message;
    notificationCallback = callback;
 
    modal.classList.remove('modal-error', 'modal-success', 'modal-prompt');
    inputField.style.display = 'none';
    inputField.value = '';
    if (emojiBtn) emojiBtn.style.display = 'none';
 
    if (type === 'error') {
        modal.classList.add('modal-error');
        titleBox.innerText  = ">> SYSTEM ERROR";
        actionBtn.innerText = "ACKNOWLEDGE";
    } else if (type === 'success') {
        modal.classList.add('modal-success');
        titleBox.innerText  = ">> SUCCESS";
        actionBtn.innerText = "PROCEED";
    } else if (type === 'prompt') {
        modal.classList.add('modal-prompt');
        titleBox.innerText       = ">> INPUT REQUIRED";
        inputField.style.display = 'block';
        inputField.focus();
        actionBtn.innerText = "SUBMIT";
 
        // Show emoji picker only on the content-edit prompt
        if (message === "ENTER NEW CONTENT:") {
            if (emojiBtn) emojiBtn.style.display = 'block';
        }
    }
}
 
function handleModalAction() {
    const modal    = document.getElementById('terminalModal');
    const inputVal = document.getElementById('modalInput').value;
 
    if (notificationCallback) {
        notificationCallback(inputVal);
    } else {
        modal.style.display = 'none';
    }
}
 
// ============================================================
// EMOJI PICKER
// ============================================================
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
                span.onclick   = () => insertEmoji(emoji, gridId);
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
        const end   = targetInput.selectionEnd;
        const text  = targetInput.value;
        targetInput.value = text.substring(0, start) + emoji + text.substring(end);
        targetInput.selectionStart = targetInput.selectionEnd = start + emoji.length;
        targetInput.focus();
    }
    document.getElementById(gridId).style.display = 'none';
}
 
// ============================================================
// COMMENTS — CREATE
// Identity comes from session; no ID/password fields on form
// ============================================================
function saveComment(event) {
    event.preventDefault();
 
    const user = getSession();
    if (!user) { requireLogin(); return; }
 
    const tag         = document.getElementById('commentTag').value;
    const commentBody = document.getElementById('commentTextArea').value.trim();
 
    if (!commentBody) {
        showTerminalNotification("MESSAGE PACKET EMPTY. CANNOT SEND.", "error");
        return;
    }
 
    const existingComments = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
    existingComments.push({
        id:   Date.now(),
        user: user,
        tag:  tag,
        text: commentBody
    });
    localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(existingComments));
 
    showTerminalNotification("COMMENT UPLOADED SUCCESSFULLY.", "success", () => {
        window.location.href = 'commentboard_page.html';
    });
}
 
// ============================================================
// COMMENTS — DELETE
// Ownership verified by session; no password prompt needed
// ============================================================
function performDeletion(id) {
    const existingComments = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
    const updatedComments  = existingComments.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(updatedComments));
 
    document.getElementById('terminalModal').style.display = 'none';
    setTimeout(() => location.reload(), 100);
}
 
function deleteComment(commentId) {
    const user     = getSession();
    const comments = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
    const comment  = comments.find(c => c.id === commentId);
    if (!comment) return;
 
    // Block deletion of other users' comments
    if (comment.user !== user) {
        showTerminalNotification("ACCESS DENIED: NOT YOUR COMMENT.", "error");
        return;
    }
 
    // Require typing DELETE to confirm — prevents accidental clicks
    showTerminalNotification("TYPE 'DELETE' TO CONFIRM:", "prompt", (input) => {
        if (input.trim().toUpperCase() === 'DELETE') {
            performDeletion(commentId);
        } else {
            showTerminalNotification("DELETION CANCELLED.", "error");
        }
    });
}
 
// ============================================================
// COMMENTS — EDIT
// Ownership verified by session; no password prompt needed
// ============================================================
function editComment(commentId) {
    const user     = getSession();
    const comments = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
    const index    = comments.findIndex(c => c.id === commentId);
    if (index === -1) return;
 
    // Block editing of other users' comments
    if (comments[index].user !== user) {
        showTerminalNotification("ACCESS DENIED: NOT YOUR COMMENT.", "error");
        return;
    }
 
    document.getElementById('terminalModal').style.display = 'none';
    setTimeout(() => {
        showTerminalNotification("ENTER NEW CONTENT:", "prompt", (newText) => {
            if (newText && newText.trim()) {
                comments[index].text = newText.trim();
                localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(comments));
                location.reload();
            }
        });
        // Pre-fill the input with the existing text so user can edit in-place
        document.getElementById('modalInput').value = comments[index].text;
    }, 200);
}
 
// ============================================================
// COMMENTS — READ (render to board)
// Edit/delete buttons only appear on the current user's own cards
// ============================================================
function loadComments() {
    const feed = document.getElementById('commentFeed');
    if (!feed) return;
 
    const currentUser = getSession();
    const comments    = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
 
    comments.forEach(comment => {
        const card = document.createElement('div');
        card.className = 'comment-card';
 
        let tagClass = 'tag-misc';
        if      (comment.tag === 'BUG/ERROR')   tagClass = 'tag-bug';
        else if (comment.tag === 'QUESTION')     tagClass = 'tag-question';
        else if (comment.tag === 'SUGGESTION')   tagClass = 'tag-suggestion';
 
        const displayTag = comment.tag
            ? `<span class="tag-badge ${tagClass}">${comment.tag}</span>`
            : '';
 
        // Only render EDIT/DELETE on the logged-in user's own comments
        const ownActions = (currentUser && comment.user === currentUser)
            ? `<div class="comment-actions">
                   <button class="edit-btn"   onclick="editComment(${comment.id})">EDIT</button>
                   <button class="delete-btn" onclick="deleteComment(${comment.id})">DELETE</button>
               </div>`
            : '';
 
        card.innerHTML = `
            <div class="user-info">
                <div class="profile-circle"></div>
                <span class="username-text">${comment.user}</span>
                ${displayTag}
            </div>
            <div class="comment-box">
                ${ownActions}
                ${comment.text}
            </div>
        `;
        feed.prepend(card);
    });
}
 
// ============================================================
// STATISTICS
// ============================================================
function updateStatistics() {
    const totalEl = document.getElementById('totalComments');
    if (!totalEl) return;
 
    const comments = JSON.parse(localStorage.getItem(STORAGE_COMMENTS)) || [];
 
    const stats = { total: comments.length, bug: 0, question: 0, suggestion: 0, misc: 0 };
 
    comments.forEach(c => {
        if      (c.tag === 'BUG/ERROR')   stats.bug++;
        else if (c.tag === 'QUESTION')    stats.question++;
        else if (c.tag === 'SUGGESTION')  stats.suggestion++;
        else                              stats.misc++;
    });
 
    document.getElementById('totalComments').innerText  = stats.total;
    document.getElementById('tagBug').innerText         = stats.bug;
    document.getElementById('tagQuestion').innerText    = stats.question;
    document.getElementById('tagSuggestion').innerText  = stats.suggestion;
    document.getElementById('tagMisc').innerText        = stats.misc;
}
 
// ============================================================
// INIT
// renderSessionBar + loadComments run on every page load;
// each page's own inline script handles any extra init (e.g. requireLogin)
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    renderSessionBar();
    loadComments();
});