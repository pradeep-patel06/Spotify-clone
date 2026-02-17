let songs = [
    { name: "Song 1", path: "songs/song1.mp3", img: "images/img1.jpg", fav: true },
    { name: "Song 2", path: "songs/song2.mp3", img: "images/img2.jpg", fav: false },
    { name: "Song 3", path: "songs/song3.mp3", img: "images/img3.jpg", fav: true },
     { name: "Song 4", path: "songs/song4.mp3", img: "images/img4.jpg", fav: true },
    { name: "Song 5", path: "songs/song5.mp3", img: "images/img5.jpg", fav: false },
    { name: "Song 6", path: "songs/song6.mp3", img: "images/img6.jpg", fav: true },
    { name: "Song 7", path: "songs/song7.mp3", img: "images/img7.jpg", fav: true }, 





];

let audio = new Audio();
let currentSong = 0;

let playlistDiv = document.getElementById("playlist");
let searchInput = document.getElementById("search");

function renderPlaylist(filter = "all") {
    playlistDiv.innerHTML = "";

    songs.forEach((song, index) => {
        if (filter === "fav" && !song.fav) return;

        let div = document.createElement("div");
        div.className = "song";

        div.innerHTML = `
            <img src="${song.img}" class="thumb">
            <span>${song.name}</span>
        `;

        div.onclick = () => loadSong(index);

        playlistDiv.appendChild(div);
    });
}



function showPlaylist(type){
    renderPlaylist(type);
}

searchInput.addEventListener("input", () => {
    let value = searchInput.value.toLowerCase();
    playlistDiv.innerHTML = "";

    songs.forEach((song, index) => {
        if (song.name.toLowerCase().includes(value)) {

            //  Thumbnail & name auto change
            thumbnail.src = song.img;
            songName.innerText = song.name;

            let div = document.createElement("div");
            div.className = "song";

            div.innerHTML = `
                <img src="${song.img}" class="thumb">
                <span>${song.name}</span>
            `;

            div.onclick = () => loadSong(index);

            playlistDiv.appendChild(div);
        }
    });
});










let playBtn = document.getElementById("play");
let prevBtn = document.getElementById("prev");
let nextBtn = document.getElementById("next");
let progress = document.getElementById("progress");
let volume = document.getElementById("volume");
let thumbnail = document.getElementById("thumbnail");
let songName = document.getElementById("song-name");
let timeDisplay = document.getElementById("time");

function formatTime(sec) {
    let m = Math.floor(sec / 60);
    let s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
}

function loadSong(index) {
    currentSong = index;

    let song = songs[index];

    audio.src = song.path;
    thumbnail.src = song.img;
    songName.innerText = song.name;

    audio.play();
    playBtn.innerText = "⏸️";
}


playBtn.onclick = () => {
    if (audio.paused) {
        audio.play();
        playBtn.innerText = "⏸️";
    } else {
        audio.pause();
        playBtn.innerText = "▶️";
    }
};

nextBtn.onclick = () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
};

prevBtn.onclick = () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
};

audio.addEventListener("timeupdate", () => {
    progress.value = (audio.currentTime / audio.duration) * 100;
    timeDisplay.innerText = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

audio.addEventListener("ended", () => nextBtn.onclick());

progress.oninput = () => {
    audio.currentTime = (progress.value / 100) * audio.duration;
};

volume.oninput = () => {
    audio.volume = volume.value;
};

renderPlaylist();
let muteBtn = document.getElementById("mute");

muteBtn.onclick = () => {
    if (audio.muted) {
        audio.muted = false;
        muteBtn.innerText = "🔊";
    } else {
        audio.muted = true;
        muteBtn.innerText = "🔇";
    }
};

