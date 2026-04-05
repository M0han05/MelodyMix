class MusicApp {
    constructor() {
        this.songs = [];
        this.filteredSongs = [];
        this.currentFilter = { genre: 'all', language: 'all' };
        this.init();
    }

    async init() {
        await this.loadSongsFromXML();
        this.checkUrlParams();
        this.renderSongs(this.songs);
        this.setupEventListeners();
        this.checkPageAndInitialize();
    }

    checkUrlParams() {
        const params = new URLSearchParams(window.location.search);
        const genre = params.get('genre');
        const lang = params.get('lang');
        if (genre) this.currentFilter.genre = genre;
        if (lang) this.currentFilter.language = lang;
    }

    async loadSongsFromXML() {
        try {
            const response = await fetch('xml/songs.xml');
            const str = await response.text();
            const data = new window.DOMParser().parseFromString(str, "text/xml");
            const songNodes = data.querySelectorAll('song');

            this.songs = Array.from(songNodes).map(node => ({
                id: node.getAttribute('id'),
                title: node.querySelector('title').textContent,
                artist: node.querySelector('artist').textContent,
                genre: node.querySelector('genre').textContent,
                language: node.querySelector('language').textContent,
                duration: node.querySelector('duration').textContent,
                path: node.querySelector('path').textContent,
                cover: node.querySelector('cover').textContent
            }));
            this.filteredSongs = [...this.songs];
        } catch (error) {
            console.error("Error loading XML:", error);
        }
    }

    renderSongs(songsToRender) {
        const featuredGrid = document.getElementById('featuredGrid');
        if (featuredGrid) {
            // Home Page: Only show first 6 songs
            this.renderToGrid(featuredGrid, this.songs.slice(0, 6));
            return;
        }

        const songGrid = document.getElementById('songGrid');
        if (songGrid) {
            // Explore Page: Show all songs based on filters
            this.renderToGrid(songGrid, songsToRender);
        }
    }

    renderToGrid(grid, songs) {
        grid.innerHTML = songs.map((song, index) => {
            const fallbackId = (song.id.charCodeAt(song.id.length - 1) % 9) + 1;
            return `
                <div class="song-card" style="animation-delay: ${index * 0.1}s" onclick="window.player.playSong('${song.id}')">
                    <img src="${song.cover}" alt="${song.title}" onerror="this.onerror=null; this.src='images/cover${fallbackId}.jpg'">
                    <div class="play-btn-overlay">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="black">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </div>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                </div>
            `;
        }).join('');
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filtered = this.songs.filter(song =>
                    song.title.toLowerCase().includes(query) ||
                    song.artist.toLowerCase().includes(query)
                );
                this.renderSongs(filtered);
            });
        }

        // Genre/Language Filter
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filterType = e.target.dataset.type; // 'genre' or 'language'
                const filterValue = e.target.dataset.value;

                document.querySelectorAll(`.filter-chip[data-type="${filterType}"]`).forEach(c => c.classList.remove('active'));
                e.target.classList.add('active');

                this.currentFilter[filterType] = filterValue;
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        let filtered = this.songs;

        if (this.currentFilter.genre !== 'all') {
            filtered = filtered.filter(s => s.genre.toLowerCase() === this.currentFilter.genre.toLowerCase());
        }

        if (this.currentFilter.language !== 'all') {
            filtered = filtered.filter(s => s.language.toLowerCase() === this.currentFilter.language.toLowerCase());
        }

        this.renderSongs(filtered);
    }

    checkPageAndInitialize() {
        const currentPath = window.location.pathname;
        if (currentPath.includes('contact.html')) {
            this.initContactForm();
        }
    }

    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');

            // Reset errors
            document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

            if (name.value.trim().length < 2) {
                document.getElementById('nameError').style.display = 'block';
                isValid = false;
            }

            if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                document.getElementById('emailError').style.display = 'block';
                isValid = false;
            }

            if (message.value.trim().length < 10) {
                document.getElementById('messageError').style.display = 'block';
                isValid = false;
            }

            if (isValid) {
                alert('Thank you for your message! We will get back to you soon.');
                form.reset();
            }
        });
    }
}

// Initialize App and Player in correct order
document.addEventListener('DOMContentLoaded', () => {
    window.player = new MusicPlayer();
    window.app = new MusicApp();
});
