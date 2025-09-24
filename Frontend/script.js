document.addEventListener('DOMContentLoaded', () => {

    

    let posts = []; 
    const POSTS_STORAGE_KEY = 'social-media-posts';

    
    const loadPosts = () => {
        const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
        if (storedPosts) {
            posts = JSON.parse(storedPosts);
        } else {
           
            posts = [{
                id: Date.now(),
                author: 'Admin',
                content: 'Welcome to the platform! Write your first post above.',
                likes: 0,
                isLiked: false
            }];
        }
    };

   
    const savePosts = () => {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    };


  
    const renderPosts = () => {
        const feedContainer = document.getElementById('feedContainer');
        if (!feedContainer) return; 

        feedContainer.innerHTML = ''; 
        posts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');

           
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


    
    const handleCreatePost = () => {
        const postTextarea = document.getElementById('postTextarea');
        const content = postTextarea.value.trim();

        if (content) {
            const newPost = {
                id: Date.now(), 
                author: 'You', 
                content: content,
                likes: 0,
                isLiked: false
            };

            posts.unshift(newPost); 
            postTextarea.value = ''; 
            savePosts();    
            renderPosts();  
        }
    };

  
    const handleFeedClick = (event) => {
      
        if (event.target.classList.contains('like-btn')) {
            const postId = parseInt(event.target.dataset.postId);
            const post = posts.find(p => p.id === postId);

            if (post) {
                if (post.isLiked) {
                    post.likes--;
                } else {
                    post.likes++;
                }
                post.isLiked = !post.isLiked; 
                savePosts();
                renderPosts();
            }
        }
    };


 
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

  
    document.getElementById('postButton').addEventListener('click', handleCreatePost);
    document.getElementById('feedContainer').addEventListener('click', handleFeedClick);

  
    hideAllSections();
    document.querySelector('#home').classList.remove('hidden');
    loadPosts();
    renderPosts();
});
