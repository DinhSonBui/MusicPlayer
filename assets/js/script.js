const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd .cd-thumb");
const audio = $("audio");
const btnPlay = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRandom = $(".btn-random");
const btnRepeat = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,

  songs: [
    {
      name: "Con Đường Tôi",
      singer: "Trọng Hiếu",
      path: "./assets/music/song1.mp3",
      image: "./assets/image/song1.png",
    },
    {
      name: "Making My Way",
      singer: "Sơn Tùng MTP",
      path: "./assets/music/song2.mp3",
      image: "./assets/image/song2.png",
    },
    {
      name: "Summertime",
      singer: "Sadness",
      path: "./assets/music/song3.mp3",
      image: "./assets/image/song3.png",
    },
    {
      name: "Qúa Lâu",
      singer: "Vinh Khuất",
      path: "./assets/music/song4.mp3",
      image: "./assets/image/song4.png",
    },
    {
      name: "Nothing Like Them",
      singer: "Loving Caliber",
      path: "./assets/music/song5.mp3",
      image: "./assets/image/song5.png",
    },
    {
      name: "Cô Gái Nông Thôn",
      singer: "Lynk Lee",
      path: "./assets/music/song6.mp3",
      image: "./assets/image/song6.png",
    },
    {
      name: "Nothin' On Me",
      singer: "Leah Marie Perez",
      path: "./assets/music/song7.mp3",
      image: "./assets/image/song7.png",
    },
    {
      name: "Người Âm Phủ",
      singer: "Leah Marie Perez",
      path: "./assets/music/song8.mp3",
      image: "./assets/image/song8.png",
    },
    {
      name: "Em Có Thể",
      singer: "Leah Marie Perez",
      path: "./assets/music/song9.mp3",
      image: "./assets/image/song9.png",
    },
    {
      name: "Yêu Sắc Yếu",
      singer: "Leah Marie Perez",
      path: "./assets/music/song10.mp3",
      image: "./assets/image/song10.png",
    },
  ],

  render() {
    var html = this.songs.map((song, index) => {
      return ` 
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index ="${index}" >
                <div
                    class="thumb"
                    style="background-image: url(${song.image})"
                ></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
    });
    $(".playlist").innerHTML = html.join("");
  },

  defineProperties() {
    Object.defineProperty(this, "currentSong", {
      get() {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvents() {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xu ly CD quay
    const cdThumbAnimate = cdThumb.animate(
      [
        { transform: "rotate(360deg)" }, // End rotation at 360 degrees
      ],
      {
        duration: 10000, // Animation duration in milliseconds
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();

    // Xu ly phong to/ thu nho CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xu ly khi click Play
    btnPlay.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song duoc play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song duoc pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tien do bai hat thay doi
    audio.ontimeupdate = function () {
      if (audio.currentTime) {
        progress.value = Math.floor((audio.currentTime / audio.duration) * 100);
      }
    };

    // Xu ly khi tua song
    progress.onchange = function (e) {
      console.log(e.target.value);

      audio.currentTime = (e.target.value / 100) * audio.duration;
    };

    // Xu ly khi click next song
    btnNext.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.isRepeat = false;
        _this.nextSong();
      }
      audio.play();
      btnRepeat.classList.remove("active");
      _this.scrollActiveSong();
    };

    // Xu ly khi click prev song
    btnPrev.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.isRepeat = false;
        _this.prevSong();
      }
      audio.play();
      btnRepeat.classList.remove("active");
    };

    // Xu ly khi click random song
    btnRandom.onclick = function () {
      _this.isRandom = !_this.isRandom;
      btnRandom.classList.toggle("active");
      btnRepeat.classList.remove("active");
      _this.isRepeat = false;
    };

    //Xu ly next song khi ket thuc bai
    audio.onended = function () {
      if (_this.isRepeat) {
        _this.repeatSong();
      } else if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
    };

    // Xu ly khi click repeat song
    btnRepeat.onclick = function () {
      _this.isRandom = false;
      _this.isRepeat = !_this.isRepeat;

      btnRepeat.classList.toggle("active");
      btnRandom.classList.remove("active");
    };

    //Xu ly khi play list bi click
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          audio.play();
        }

        // Lam viec xu ly khi an vao option
        else {
        }
      }
    };
  },

  loadCurrentSong() {
    heading.innerText = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
    this.render();
  },

  // Xu ly next song
  nextSong() {
    this.currentIndex++;
    if (this.songs.length <= this.currentIndex) {
      this.currentIndex = 0;
    }
    console.log(this.currentIndex);
    this.loadCurrentSong();
  },

  // Xu ly prev song
  prevSong() {
    this.currentIndex--;

    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    console.log(this.currentIndex);
    this.loadCurrentSong();
  },

  //Xu ly random song
  randomSong() {
    do {
      var randomCurrentIndex = Math.floor(Math.random() * this.songs.length);
      console.log(randomCurrentIndex);
    } while (this.currentIndex == randomCurrentIndex);
    this.currentIndex = randomCurrentIndex;
    this.loadCurrentSong();
  },

  // Xu ly repeat song
  repeatSong() {
    if (audio.currentTime == audio.duration) {
      console.log(this.currentIndex);
      this.loadCurrentSong();
    }
  },

  // Scroll to active SOng
  scrollActiveSong() {
    const activeSong = $(".song.active");
    if (activeSong && this.currentIndex == 0) {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "center",
      });
    } else {
      activeSong.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  },

  // PLay song when click
  playSongClick() {},

  start() {
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
