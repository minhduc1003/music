const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";
const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");



const app = {
  currentIndex: 2,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Ái Nộ",
      singer: "Masew x KhoiVu",
      path: "./music/AiNo1-MasewKhoiVu-7078913.mp3",
      image: "https://i1.sndcdn.com/artworks-Zfn19xykwtjKQXGr-o3D3yQ-t500x500.jpg"
    },
    {
      name: "Cưới Thôi",
      singer: "MasewMasiu x BRay",
      path: "./music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3",
      image:
        "https://i.scdn.co/image/ab67616d0000b273354d3d04579c8ca606cee563"
    },
    {
      name: "Đau Nhất Là Lặng Im",
      singer: "ERIK",
      path: "./music/DauNhatLaLangIm-ERIK-7130326.mp3",
      image: "https://media.travelmag.vn/files/content/2022/02/14/dnlli_er-10145693.jpg"
    },
    {
      name: "Hạ Còn Vương Nắng",
      singer: "DatKaa",
      path: "./music/HaConVuongNang-DatKaa-7004769.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/d/8/0/1/d801670cd8ecdb89750bdbe8de198021.jpg"
    },
    {
      name: "Ngày Đầu Tiên",
      singer: "Đức Phúc",
      path: "./music/NgayDauTien-DucPhuc-7129810.mp3",
      image:
        "https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2022/02/faa13fe1-57f2-4333-9025-d5262a68425e-5570.jpeg?fit=660%2C20000&quality=95&ssl=1"
    },
    {
      name: "See Tình",
      singer: "Hoàng Thùy Linh",
      path: "./music/SeeTinh-HoangThuyLinh-7130526.mp3",
      image:
        "https://image.thanhnien.vn/w1024/Uploaded/2022/lxwpcqjwp/2022_03_02/anh-2-7429.jpg"
    }],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `<div class="song ${index === this.currentIndex ? 'active' : ''} "  data-index ="${index}">
            <div class="thumb" style="background-image:url(' ${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>`
    })
    playlist.innerHTML = htmls.join('')
  },
  hendleEvents: function () {
    const _this = this
    // scroll cd thumb
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      newcdWidth = cdWidth - scrollTop
      cd.style.width = newcdWidth > 60 ? newcdWidth + 'px' : 0
      cd.style.opacity = newcdWidth / cdWidth
    }
    // pause và play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause()
      }
      else {
        audio.play()
      }
    }
    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add('playing')
    }
    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove('playing')
    }
    // tua 
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const songPercent = audio.currentTime / audio.duration * 100
        progress.value = songPercent
      }
    }
    progress.oninput = function (e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }
    //nextsong
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()

      } else {
        _this.nextSong()

      }
      _this.render()
      _this.scrollInto()
      audio.play()
    }
    //presong
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.randomSong()

      } else {
        _this.prevSong()
      }
      _this.render()
      audio.play()
      _this.scrollInto()
    }
    //Random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom
      this.classList.toggle('active', _this.isRandom)

    }
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      this.classList.toggle('active', _this.isRepeat)

    }
    playlist.onclick = function (e) {
      const getElement = e.target.closest('.song:not(.active)')
      if (getElement) {
        // _this.currentIndex =  getElement.dataset.index
        _this.currentIndex = Number(getElement.getAttribute('data-index'))
        _this.loadcurrentsong()
        _this.render()
        audio.play()
      }
    }
  },
  scrollInto: function () {
    $('.song.active').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = 5
    }
    this.loadcurrentsong()
  },
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadcurrentsong()
  },
  randomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (
      newIndex === this.currentIndex
    )
    this.currentIndex = newIndex
    console.log(newIndex)
    this.loadcurrentsong()

  },
  defineProperties: function () {
    Object.defineProperty(this, 'currentsong', {
      get: function () {
        return this.songs[this.currentIndex]
      }
    })
  },
  loadcurrentsong: function () {
    heading.textContent = this.currentsong.name
    cdThumb.style.backgroundImage = `url(${this.currentsong.image})`
    audio.src = this.currentsong.path
  },

  start: function () {
    this.defineProperties()
    this.render()
    this.loadcurrentsong()
    this.hendleEvents()
  }
}
app.start()