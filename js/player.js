class MusicPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.currentSongId = null;
        this.setupAudioEvents();
        this.init();
    }

    init() {
        this.playBtn = document.querySelector('.play-pause');
        this.progressFill = document.querySelector('.progress-bar .progress-fill');
        this.progressContainer = document.querySelector('.progress-bar');
        this.volumeFill = document.querySelector('.volume-fill');
        this.volumeContainer = document.querySelector('.volume-bar-container');
        this.currentTimeEl = document.querySelector('.current-time');
        this.durationEl = document.querySelector('.total-time');
        this.songTitle = document.querySelector('.current-song h4');
        this.songArtist = document.querySelector('.current-song p');
        this.songCover = document.querySelector('.current-song img');

        // Handle song progress clicks
        if (this.progressContainer) {
            this.progressContainer.addEventListener('click', (e) => {
                if (!this.audio.duration) return;
                const rect = this.progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = pos * this.audio.duration;
            });
        }

        // Handle volume clicks
        if (this.volumeContainer) {
            this.volumeContainer.addEventListener('click', (e) => {
                const rect = this.volumeContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                const volume = Math.max(0, Math.min(1, pos));
                this.audio.volume = volume;
                if (this.volumeFill) this.volumeFill.style.width = `${volume * 100}%`;
            });
        }
    }

    setupAudioEvents() {
        this.audio.addEventListener('timeupdate', () => {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            if (this.progressFill) this.progressFill.style.width = `${percent}%`;
            if (this.currentTimeEl) this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        });

        this.audio.addEventListener('loadedmetadata', () => {
            if (this.durationEl) this.durationEl.textContent = this.formatTime(this.audio.duration);
        });

        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateIcons();
        });
    }

    playSong(songId) {
        if (!window.app || !window.app.songs) return;
        const song = window.app.songs.find(s => s.id === songId);
        if (!song) return;

        if (this.currentSongId !== songId) {
            this.audio.src = song.path;
            this.currentSongId = songId;
            
            // Update UI
            if (this.songTitle) this.songTitle.textContent = song.title;
            if (this.songArtist) this.songArtist.textContent = song.artist;
            if (this.songCover) {
                this.songCover.src = song.cover;
                this.songCover.onerror = () => { 
                    const fallbackId = (song.id.charCodeAt(song.id.length - 1) % 9) + 1;
                    this.songCover.onerror = null; 
                    this.songCover.src = `images/cover${fallbackId}.jpg`; 
                };
            }
        }

        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updateIcons();
        }).catch(e => {
            console.error("Playback failed. Please interact with the page first.", e);
            alert("Please click anywhere on the page first to enable audio playback (browser security).");
        });
    }

    togglePlay() {
        if (!this.currentSongId && window.app.songs.length > 0) {
            this.playSong(window.app.songs[0].id);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
        } else {
            this.audio.play();
        }
        this.isPlaying = !this.isPlaying;
        this.updateIcons();
    }

    updateIcons() {
        if (!this.playBtn) return;
        this.playBtn.innerHTML = this.isPlaying ? 
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : 
            '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }

    formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }
}

// Initialization handled in main.js
