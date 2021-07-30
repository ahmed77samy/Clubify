const Musical = {
    //========== INIT ANIMATE ==========//
    animate: function(el) {
        if (!(this instanceof Musical.animate)) {
          return new animate(el);
        }
        this.el = el;
    },
    //========== FADE ANIAMTE ==========//
    fade: function (ele,type,ms,display) {
        let isIn = type === 'in',
        opacity = isIn ? 0 : 1,
        interval = 50,
        duration = ms || 400,
        gap = interval / duration,
        self = new this.animate(ele);
        if(isIn) {
            self.el.style.display = display || 'block';
            self.el.style.opacity = opacity;
        }
        function func() {
            opacity = isIn ? opacity + gap : opacity - gap;
            self.el.style.opacity = opacity;
            if(opacity <= 0) self.el.style.display = 'none'
            if(opacity <= 0 || opacity >= 1) window.clearInterval(fading);
        }
        let fading = window.setInterval(func, interval);
    },
    //========== TOOLS HEADER ==========//
    toolsHeader: function (ele , target, icon) {
        if(ele.classList.contains("active")){
            ele.classList.remove('active')
            ele.querySelector('.icon').classList.add(`${icon}`)
            ele.querySelector('.icon').classList.remove(`fa-times`)
            this.fade(target,'out',400)
        }else {
            ele.classList.add('active')
            ele.querySelector('.icon').classList.remove(`${icon}`)
            ele.querySelector('.icon').classList.add(`fa-times`)
            this.fade(target,'in',400)
        }
    },
    //========== SET PROGRESS ==========//
    setProgress: function (percent , circle) {
        let radius = circle.r.baseVal.value;
        let circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;
        const offset = circumference - percent / 100 * circumference;
        circle.style.strokeDashoffset = offset;
    },
    //========== PLAY AUDIO ==========//
    playAudio:function (audio , callBack=_=>false) {
        audio.currentTime = 0
        audio.play()
        callBack()
    },
    //========== CONTINUE AUDIO ==========//
    continueAudio:function (audio , callBack=_=>false) {
        audio.play()
        callBack()
    },
    //========== PAUSE AUDIO ==========//
    pauseAudio:function (audio , callBack=_=>false) {
        audio.pause()
        callBack()
    },
    //========== SET Duration Audio ==========//
    setDurationAudio:function (ele ,secs) {
        const minutes = Math.floor(Math.ceil(secs) / 60);
        const seconds = Math.floor(Math.ceil(secs) % 60);
        const returnedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
        ele.textContent = `${minutes}:${returnedSeconds}`
    },
    //========== INCREASE SLICE COUNT ==========//
    increaseSliceCount: function (eles , data , count , duration) {
        let active_ele = [...eles].filter(e => e.classList.contains('active'))[0];
        let data_active = active_ele.getAttribute(`data-${data}`)
        let new_ele = [...eles].filter(e => e.getAttribute(`data-${data}`) == parseInt(data_active) + 1)[0];
        if(data_active == count) {
            let new_ele = [...eles].filter(e => e.getAttribute(`data-${data}`) == 1)[0];
            active_ele.classList.remove('active')
            new_ele.classList.add('active')
            Musical.fade(active_ele,'out')
            setTimeout(() => {
                Musical.fade(new_ele,'in')
            }, duration || 400);
        }else {
            active_ele.classList.remove('active')
            new_ele.classList.add('active')
            Musical.fade(active_ele,'out',duration || 400)
            setTimeout(() => {
                Musical.fade(new_ele,'in',duration || 400)
            }, duration || 400);
        }
    },
    //========== DECREASE SLICE COUNT ==========//
    decreaseSliceCount: function (eles , data , count , duration) {
        let active_ele = [...eles].filter(e => e.classList.contains('active'))[0];
        let data_active = active_ele.getAttribute(`data-${data}`)
        let new_ele = [...eles].filter(e => e.getAttribute(`data-${data}`) == parseInt(data_active) - 1)[0];
        if(data_active == 1) {
            let new_ele = [...eles].filter(e => e.getAttribute(`data-${data}`) == count)[0];
            active_ele.classList.remove('active')
            new_ele.classList.add('active')
            Musical.fade(active_ele,'out')
            setTimeout(() => {
                Musical.fade(new_ele,'in')
            }, duration || 400);
        }else {
            active_ele.classList.remove('active')
            new_ele.classList.add('active')
            Musical.fade(active_ele,'out',duration || 400)
            setTimeout(() => {
                Musical.fade(new_ele,'in',duration || 400)
            }, duration || 400);
        }
    },
    //========== CUSTIMIZE BACKGROUND PAGENATION SWIPPER ==========//
    custimizeBgPaginationSwiper: function(num = 0) {
        function bgChange (slides , bullets) {
            bullets?.forEach((e , i) => {
                e.style.background = `url("${slides[i].querySelector('img').getAttribute("src")}")`
                e.style.backgroundSize = "cover"
            })
        }
        if(swiper instanceof Array) {
            let slides = swiper[num].slides;
            let bullets = swiper[num].pagination.bullets;
            bgChange(slides , bullets)
        }else {
            let slides = swiper.slides;
            let bullets = swiper.pagination.bullets;
            bgChange(slides , bullets)
        }
    },
    //========== CHANGE COLOR THEME ==========//
    changeTheme: function(eles) {
        [...eles].forEach(e => {
            let data = e.getAttribute('data-theme');
            e.onclick = function() {
                sessionStorage.setItem("theme",data);
                document.documentElement.style.setProperty('--second-color', data);
                [...eles].filter(e => e.classList.contains('active'))[0].classList.remove("active");
                e.classList.add("active");
            }
        })
        if(sessionStorage.getItem("theme")) {
            document.documentElement.style.setProperty('--second-color', sessionStorage.getItem("theme"));
            [...eles].filter(e => e.classList.contains('active'))[0].classList.remove("active");
            [...eles].filter(e => e.getAttribute('data-theme') === sessionStorage.getItem("theme"))[0].classList.add('active')
        }
    }
}

window.onload = _ => {
    //========== TOGGLE SEARCH ==========//
    let search_ele = document.querySelector(".header__search")
    let search_target = document.querySelector(".content__search")
    search_ele.onclick = function() {
        Musical.toolsHeader(search_ele , search_target , "fa-search")
    }

    //========== TOGGLE MENU ==========//
    let menu_ele = document.querySelector(".header__menu")
    let menu_target = document.querySelector(".content__menu")
    menu_ele.onclick = function() {
        Musical.toolsHeader(menu_ele , menu_target , "fa-bars")
    }

    //========== HEADER MENU HUMBURGER==========//
    const li = document.querySelectorAll('.content__menu > ul > li')
    const li_drop = document.querySelectorAll('.content__menu .drop')
    for (const ele of [...li_drop]) {
        ele.onclick = function (e) {
            e.preventDefault();
            if(ele.querySelector('ul.drop__down').classList.contains('is-hidden')){
                Musical.fade(ele.querySelector('ul.drop__down'),'in', 400 ,'flex');
                ele.querySelector('ul.drop__down').classList.remove('is-hidden');
                ele.querySelector('.icon').classList.add('open')
                let li_not_active = [...li].filter(e => e !== this)
                li_not_active.map(e => {
                    e.style.opacity="0"
                    e.style.pointerEvents="none"
                    return false
                })
            }else {
                Musical.fade(ele.querySelector('ul.drop__down'),'out');
                ele.querySelector('.icon').classList.remove('open')
                setTimeout(() => {
                    ele.querySelector('ul.drop__down').classList.add('is-hidden');
                }, 400);
                let li_not_active = [...li].filter(e => e !== this)
                li_not_active.map(e => {
                    e.style.opacity="1"
                    e.style.pointerEvents="all"
                    return false
                })
            }
        }
    }

    //========== ASIDE TOP ==========//
    function asideTop() {
        let circle = document.querySelector('.aside__top circle');
        const ele = document.querySelector(".aside__top h2")
        let scroll = document.documentElement.getBoundingClientRect().y
        let height = document.scrollingElement.scrollHeight - window.innerHeight
        ele.textContent = `${Math.round(Math.abs(scroll * 100 ) && 0 / height)}%`
        Musical.setProgress(Math.round(Math.abs(scroll * 100 ) / height) , circle);
    }
    document.onscroll = asideTop;
    asideTop();

    //========== SCROLL TOP ==========//
    let scrolltop = document.querySelector('.aside__top .scroll-top');
    scrolltop.onclick = function (e) {
        e.preventDefault()
        window.scrollTo(0,0)
    }

    //========== GALLERY GRID ==========//
    if(document.querySelector("#gallery .gallery__wrapper--waterfall")) {
        let waterfall = new Waterfall({
            containerSelector: '#gallery .gallery__wrapper--waterfall',
            boxSelector: '#gallery .item',
            minBoxWidth: 370
        });
    }

    //========== TOGGLE SERVICES ITEMS ==========//
    let services_items = document.querySelectorAll('#services .accordion__item')
    for(ele of [...services_items]) {
        ele.addEventListener('click', function () {
            if(this.classList.contains('active')) {
                return false
            }
            let old = document.querySelector('#services .accordion__item.active')
            old.querySelector('.accordion__answer').style.display = "none"
            old.classList.remove('active')
            if(this.classList.contains('active')) {
                Musical.fade(this.querySelector('.accordion__answer'),'out');
                this.classList.remove('active')
            }else {
                Musical.fade(this.querySelector('.accordion__answer'),'in' , 400 , 'block');
                this.classList.add('active')
            }
        })
    }

    //========== PLAY AND PAUSE AUDIO MUSIC ==========//
    let music_audio = document.querySelectorAll("#music [data-audio]")
    let music_duration = document.querySelectorAll("#music li .duration")
    let music_control = document.querySelector("#music #music_control")
    music_audio.forEach(e => {
        // set duration audios
        music_duration.forEach(e => {
            let duration = e.closest("li").querySelector('audio').duration
            Musical.setDurationAudio(e , duration)
        })
        // audios on click
        e.onclick = function () {
            // callBackPause
            function callBackPause() {
                let icon = e.querySelector('.icon')
                icon.classList.remove("fa-pause")
                icon.classList.add("fa-play")
            }
            // callBackContinue
            function callBackContinue () {
                let icon = e.querySelector('.icon')
                icon.classList.remove("fa-play")
                icon.classList.add("fa-pause")
                let intreval_current_audio_continue = setInterval(() => {
                    let current = e.querySelector("audio").currentTime;
                    Musical.setDurationAudio(music_control.querySelector(".current__all") , current)
                }, 1000);
                e.querySelector("audio").addEventListener("pause",() => {
                    clearInterval(intreval_current_audio_continue);
                    callBackPause()
                })
            }
            // callBackPlay
            function callBackPlay () {
                let lis = e.closest("ul").querySelectorAll("li")
                let icon = e.querySelector('.icon');
                lis.forEach(li => {
                    let audio = li.querySelector('audio')
                    li.classList.remove("active")
                    if(e.closest('li') !== li) {
                        audio.pause()
                    }
                })
                parent_audio.classList.add('active')
                icon.classList.remove("fa-play")
                icon.classList.add("fa-pause")
                music_control.querySelector(".name").textContent = e.querySelector(".name").textContent
                music_control.querySelector(".duration__all").textContent = e.closest("li").querySelector(".duration").textContent
                clearInterval(window.intreval_current_audio_continue);
                let intreval_current_audio_play = setInterval(() => {
                    let current = audio.currentTime;
                    Musical.setDurationAudio(music_control.querySelector(".current__all") , current)
                }, 1000);
                audio.addEventListener("pause",() => {
                    clearInterval(intreval_current_audio_play);
                    callBackPause()
                })
            }
            let audio = e.querySelector('audio')
            let parent_audio = e.closest("li")
            if(parent_audio.classList.contains('active')){
                if(!audio.paused) {
                    Musical.pauseAudio(audio,callBackPause)
                }else {
                    Musical.continueAudio(audio,callBackContinue)
                }
            }else {
                Musical.playAudio(audio , callBackPlay)
            }
        }
    })

    //========== TESTIMONIALS COTROL ==========//
    let testi_control_prev = document.querySelector('#testimonials .testimonials__control .prev')
    let testi_control_next = document.querySelector('#testimonials .testimonials__control .next')
    let testi_img = document.querySelectorAll('#testimonials .items__img img')
    let testi_content = document.querySelectorAll('#testimonials .items__content')
    testi_control_next?.addEventListener('click',function () {
        Musical.increaseSliceCount(testi_img,"testi",3,400)
        Musical.increaseSliceCount(testi_content,"testi",3,400)
        let data = ([...testi_img].filter(e => e.classList.contains('active'))[0]).getAttribute("data-testi")
        document.querySelector("#testimonials .testimonials__numbers").textContent = data
    })
    testi_control_prev?.addEventListener('click',function () {
        Musical.decreaseSliceCount(testi_img,"testi",3,400)
        Musical.decreaseSliceCount(testi_content,"testi",3,400)
        let data = ([...testi_img].filter(e => e.classList.contains('active'))[0]).getAttribute("data-testi")
        document.querySelector("#testimonials .testimonials__numbers").textContent = data
    }) 

    //========== SWIPPER FUNCTIONS ==========//
    window.swiper = new Swiper('.swiper-container', {
        grabCursor: true,
        parallax:true,
        speed: 1600,
        threshold: 10,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
    });
    let pagination_current = document.createElement('div')
    let pagination_after = document.createElement('div')
    let pagination_after_icon = document.createElement('i')
    pagination_after.setAttribute("class","pagination-after")
    pagination_current.setAttribute("class","pagination-before")
    pagination_current.innerHTML = `
    <span class="current">0${window.swiper.slides.filter(e=> e.classList.contains('swiper-slide-active'))[0]?.getAttribute("aria-label").slice(0,1)}</span>`
    pagination_after_icon.setAttribute("class","fas fa-chevron-up icon")
    pagination_after.appendChild(pagination_after_icon)
    document.querySelector(".swiper-pagination")?.appendChild(pagination_after)
    document.querySelector(".swiper-pagination")?.appendChild(pagination_current)
    Musical.custimizeBgPaginationSwiper(0)
    pagination_after.addEventListener("click",() => {
        let swiper_pagination = document.querySelector(".swiper-pagination")
        if(swiper_pagination.classList.contains("active")) swiper_pagination.classList.remove("active")
        else swiper_pagination.classList.add("active")
    })
    window.swiper.on('slideChange', function () {
        setTimeout(_=>pagination_current.innerHTML = `
        <span class="current">0${window.swiper.slides.filter(e=> e.classList.contains('swiper-slide-active'))[0].getAttribute("aria-label").slice(0,1)}</span>`)
    });
    //========== CHANGE COLOR THEME ==========//
    let sp_theme = document.querySelectorAll('.aside__theme span')
    Musical.changeTheme(sp_theme)
}