
let songs = [
{name:"Song 1",path:"songs/song1.mp3",img:"images/img1.jpg"},
{name:"Song 2",path:"songs/song2.mp3",img:"images/img2.jpg"},
{name:"Song 3",path:"songs/song3.mp3",img:"images/img3.jpg"},
{name:"Song 4",path:"songs/song4.mp3",img:"images/img4.jpg"},
{name:"Song 5",path:"songs/song5.mp3",img:"images/img5.jpg"},
{name:"Song 6",path:"songs/song6.mp3",img:"images/img6.jpg"},
{name:"Song 7",path:"songs/song7.mp3",img:"images/img7.jpg"}
]


let audio = new Audio()

let playlistDiv = document.getElementById("playlist")
let playBtn = document.getElementById("play")
let prevBtn = document.getElementById("prev")
let nextBtn = document.getElementById("next")

let progress = document.getElementById("progress")
let volume = document.getElementById("volume")

let muteBtn = document.getElementById("mute")
let shuffleBtn = document.getElementById("shuffle")
let repeatBtn = document.getElementById("repeat")

let thumbnail = document.getElementById("thumbnail")
let songName = document.getElementById("songName")

let search = document.getElementById("search")
let clearSearch = document.getElementById("clearSearch")

let notFound = document.getElementById("notFound")
let time = document.getElementById("time")


let favourites = JSON.parse(localStorage.getItem("favourites")) || []
let recentlyPlayed = []

let userPlaylists = JSON.parse(localStorage.getItem("playlists")) || []

let currentSong = 0
let shuffle = false
let repeat = false


function renderPlaylist(list = songs) {
    playlistDiv.innerHTML = ""

    if (list.length === 0) {
        notFound.style.display = "block"
        return
    } else {
        notFound.style.display = "none"
    }

    list.forEach(song => {
        let div = document.createElement("div")
        div.className = "song"

        div.innerHTML = `
        <img src="${song.img}">
        <span>${song.name}</span>
        <button>${favourites.includes(song.name) ? "💚" : "🤍"}</button>
        `

        div.onclick = () => loadSong(songs.indexOf(song))

        div.querySelector("button").onclick = (e) => {
            e.stopPropagation()

            if (favourites.includes(song.name)) {
                favourites = favourites.filter(s => s !== song.name)
            } else {
                if (favourites.length >= 3) {
                    alert("Only 3 favourites allowed")
                    return
                }
                favourites.push(song.name)
            }

            localStorage.setItem("favourites", JSON.stringify(favourites))
            renderPlaylist(list)
        }

        playlistDiv.appendChild(div)
    })
}

renderPlaylist()


function loadSong(index) {
    currentSong = index
    let song = songs[index]

    audio.src = song.path
    thumbnail.src = song.img
    songName.innerText = song.name

    audio.play()
    playBtn.innerText = "⏸"

    recentlyPlayed.unshift(song)
}


playBtn.onclick = () => {
    if (audio.paused) {
        audio.play()
        playBtn.innerText = "⏸"
    } else {
        audio.pause()
        playBtn.innerText = "▶"
    }
}

nextBtn.onclick = () => {
    if (shuffle) {
        currentSong = Math.floor(Math.random() * songs.length)
    } else {
        currentSong = (currentSong + 1) % songs.length
    }
    loadSong(currentSong)
}

prevBtn.onclick = () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length
    loadSong(currentSong)
}

volume.oninput = () => audio.volume = volume.value

muteBtn.onclick = () => {
    audio.muted = !audio.muted
    muteBtn.innerText = audio.muted ? "🔇" : "🔊"
}

shuffleBtn.onclick = () => {
    shuffle = !shuffle
    shuffleBtn.style.color = shuffle ? "green" : "white"
}

repeatBtn.onclick = () => {
    repeat = !repeat
    repeatBtn.style.color = repeat ? "green" : "white"
}


audio.addEventListener("ended", () => {
    if (repeat) loadSong(currentSong)
    else nextBtn.onclick()
})

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100

        let m = Math.floor(audio.currentTime / 60)
        let s = Math.floor(audio.currentTime % 60)
        if (s < 10) s = "0" + s

        time.innerText = m + ":" + s
    }
})

progress.onclick = (e) => {
    audio.currentTime = (e.offsetX / progress.clientWidth) * audio.duration
}


search.addEventListener("input", () => {
    let value = search.value.toLowerCase()
    let filtered = songs.filter(song =>
        song.name.toLowerCase().includes(value)
    )
    renderPlaylist(filtered)
})

clearSearch.onclick = () => {
    search.value = ""
    renderPlaylist(songs)
}


function showPlaylist(type) {
    if (type === "all") renderPlaylist(songs)

    if (type === "fav") {
        let favSongs = songs.filter(s => favourites.includes(s.name))
        renderPlaylist(favSongs)
    }

    if (type === "recent") renderPlaylist(recentlyPlayed)
}


document.getElementById("toggleTheme").onclick = () => {
    document.body.classList.toggle("light")
}


document.getElementById("createPlaylist").onclick = () => {
    let name = prompt("Enter Playlist Name")
    if (!name) return

    userPlaylists.push(name)
    localStorage.setItem("playlists", JSON.stringify(userPlaylists))

    renderUserPlaylists()
}

function renderUserPlaylists() {
    let container = document.getElementById("userPlaylists")
    container.innerHTML = ""

    userPlaylists.forEach((name, index) => {

        let div = document.createElement("div")
        div.className = "playlistItem"

        div.innerHTML = `
            <span>🎵 ${name}</span>
            <div>
                <button class="renameBtn">✏️</button>
                <button class="deleteBtn">❌</button>
            </div>
        `

        
        div.querySelector(".renameBtn").onclick = (e) => {
            e.stopPropagation()

            let newName = prompt("Rename Playlist", name)
            if (!newName) return

            userPlaylists[index] = newName.trim()
            localStorage.setItem("playlists", JSON.stringify(userPlaylists))
            renderUserPlaylists()
        }

        
        div.querySelector(".deleteBtn").onclick = (e) => {
            e.stopPropagation()

            if (confirm("Delete playlist?")) {
                userPlaylists.splice(index, 1)
                localStorage.setItem("playlists", JSON.stringify(userPlaylists))
                renderUserPlaylists()
            }
        }

        container.appendChild(div)
    })
}


renderUserPlaylists()