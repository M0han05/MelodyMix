# MelodyMix - Music Playlist Website
---------------------------------------------------
 live link : https://m0han05.github.io/MelodyMix/ 
----------------------------------------------------
A premium, fully functional music platform built from scratch using HTML5, CSS3, JavaScript, and XML.

## Features
- **Dynamic Content**: Songs are fetched and rendered from an `xml/songs.xml` file using Vanilla JavaScript.
- **Filtering & Search**: Explore music by 4 genres (Phonk, Motivation, Feel Good, Melancholic) and 5 languages (English, Hindi, Japanese, Tamil, Telugu).
- **Interactive Player**: A custom-designed audio player bar that manages playback across the site.
- **Premium Design**: Dark mode aesthetic with glassmorphism, responsive grid layouts, and smooth animations.
- **Form Validation**: Contact form with real-time feedback and validation logic.

## Folder Structure
- `/project`
    - `index.html`: Home page with trending songs.
    - `explore.html`: Advanced filtering and discovery.
    - `about.html`: Information about the project.
    - `contact.html`: Contact form with JS validation.
    - `faq.html`: Frequent questions and support.
    - `css/style.css`: All site styling (no frameworks).
    - `js/main.js`: XML parsing, filtering, and search logic.
    - `js/player.js`: Audio playback and UI synchronization.
    - `xml/songs.xml`: Centralized data storage.
    - `images/`: Generated album cover arts.
    - `audio/`: Local music files organized by genre and language.

## How to Run
1. Open the `/project` folder.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, etc.).
3. Browse music and enjoy!

*Note: Due to browser security policies (CORS), some browsers may block XML fetching if you open the file directly (file://). If songs do not appear, please run the project through a local server (e.g., VS Code Live Server or `python -m http.server`).*
