document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DATA MANAGEMENT ---

    let posts = []; // This array will hold all our post data.
    const POSTS_STORAGE_KEY = 'social-media-posts';

    // Function to load posts from Local Storage
    const loadPosts = () => {
        const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        if (storedPosts) {
            posts = JSON.parse(storedPosts);
        } else {
            // If no posts are saved, create a default one
            posts = [{
                id: Date.now(),
                author: 'Admin',
                content: 'Welcome to the platform! Write your first post above.',
                likes: 0,
                isLiked: false
            }];
        }
    };

    // Function to save posts to Local Storage
    const savePosts = () => {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    };


    // --- 2. RENDERING ---

    // This function takes the `posts` array and renders it as HTML
    const renderPosts = () => {
        const feedContainer = document.getElementById('feedContainer');
        if (!feedContainer) return; // Exit if the container isn't on the page

        feedContainer.innerHTML = ''; // Clear the feed to prevent duplicates

        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

            // Set the inner HTML of the post element
            postDiv.innerHTML = `
                <p><strong>${post.author}:</strong> ${post.content}</p>
                <div class="post-actions">
                    <button class="like-btn ${post.isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                        Like (${post.likes})
                    </button>
                    <button>Comment</button>
                    <button>Share</button>
                </div>
            `;
            feedContainer.appendChild(postDiv);
        });
    };


    // --- 3. EVENT HANDLERS & LOGIC ---

    // Logic for creating a new post
    const handleCreatePost = () => {
        const postTextarea = document.getElementById('postTextarea');
        const content = postTextarea.value.trim();

        if (content) {
            const newPost = {
                id: Date.now(), // Use the current timestamp as a unique ID
                author: 'You', // In a real app, this would be the logged-in user
                content: content,
                likes: 0,
                isLiked: false
            };

            posts.unshift(newPost); // Add the new post to the beginning of the array
            postTextarea.value = ''; // Clear the input field

            savePosts();    // Save the updated posts array
            renderPosts();  // Re-render the feed to show the new post
        }
    };

    // Logic for liking a post using event delegation
    const handleFeedClick = (event) => {
        // Check if the clicked element is a like button
        if (event.target.classList.contains('like-btn')) {
            const postId = parseInt(event.target.dataset.postId);
            const post = posts.find(p => p.id === postId);

            if (post) {
                if (post.isLiked) {
                    post.likes--;
                } else {
                    post.likes++;
                }
                post.isLiked = !post.isLiked; // Toggle the liked status

                savePosts();
                renderPosts();
            }
        }
    };


    // --- 4. INITIALIZATION & EVENT LISTENERS ---

    // Page Navigation Logic
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('main section');
    const hideAllSections = () => sections.forEach(sec => sec.classList.add('hidden'));

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                hideAllSections();
                targetSection.classList.remove('hidden');
            }
        });
    });

    // Add event listeners for dynamic actions
    document.getElementById('postButton').addEventListener('click', handleCreatePost);
    document.getElementById('feedContainer').addEventListener('click', handleFeedClick);

    // Initial setup when the page loads
    hideAllSections();
    document.querySelector('#home').classList.remove('hidden');
    loadPosts();
    renderPosts();
});