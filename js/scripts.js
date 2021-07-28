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
    playAudio: function (ele , callBackPlay = (e) => {return false} , callBackPause = () => {return false}) {
        for(aud of [...ele]) {
            aud.onclick = function () {
                let audios = document.querySelectorAll('audio')
                if([...audios].some(e => !e.paused) ) {
                    [...audios].map(e => {
                        this.querySelector('audio') === e ? false : e.pause()
                        return false
                    })
                }
                if(this.querySelector('audio').paused) {
                    this.querySelector('audio').play()
                    callBackPlay(this)
                }else {
                    this.querySelector('audio').pause()
                    callBackPause(this)
                }
            }
        }
    },
    //========== SET DURATION AUDIO ==========//
    setDurationAudio: function (duration , ele) {
        ele.textContent = `${((parseInt(duration)) / 60).toFixed(2)}`.replace('.' , ":")
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
        ele.textContent = `${Math.round(Math.abs(scroll * 100 ) / height)}%`
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
    let waterfall = new Waterfall({ 
        containerSelector: '#gallery',
        boxSelector: '#gallery .item',
        minBoxWidth: 370
    });

    //========== TOGGLE SERVICES ITEMS ==========//
    let services_items = document.querySelectorAll('#services .accordion__item')
    for(ele of [...services_items]) {
        ele.onclick = function () {
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
        }
    }

    //========== PLAY AND PAUSE AUDIO MUSIC ==========//
    let audio_music = document.querySelectorAll("[data-audio]")
    function callBackPlayAudio (e){
        let lis = e.closest('ul').querySelectorAll('li');
        [...lis].map(e => {
            if(e.classList.contains('active')) {
                e.classList.remove('active')
                e.querySelector('.icon').classList.remove('fa-pause')
                e.querySelector('.icon').classList.add('fa-play')
            }
            return false
        })
        e.closest('li').classList.add('active')
        e.querySelector('.icon').classList.remove('fa-play')
        e.querySelector('.icon').classList.add('fa-pause')
        document.querySelector("#music_control .name").textContent = e.querySelector('.name').textContent
    }
    function callBackPauseAudio (e){
        e.closest('li').classList.remove('active')
        e.querySelector('.icon').classList.remove('fa-pause')
        e.querySelector('.icon').classList.add('fa-play')
        document.querySelector("#music_control .name").textContent = "no thing"
    }
    [...audio_music].forEach(function(e) {
        let duration = e.querySelector('audio').duration
        let ele = e.closest('li').querySelector('.duration')
        Musical.setDurationAudio(duration , ele)
    })
    Musical.playAudio(audio_music , callBackPlayAudio , callBackPauseAudio)

    //========== TESTIMONIALS COTROL ==========//
    let testi_control_prev = document.querySelector('#testimonials .testimonials__control .prev')
    let testi_control_next = document.querySelector('#testimonials .testimonials__control .next')
    let testi_img = document.querySelectorAll('#testimonials .items__img img')
    let testi_content = document.querySelectorAll('#testimonials .items__content')
    testi_control_next.onclick = function () {
        Musical.increaseSliceCount(testi_img,"testi",3,400)
        Musical.increaseSliceCount(testi_content,"testi",3,400)
        let data = ([...testi_img].filter(e => e.classList.contains('active'))[0]).getAttribute("data-testi")
        document.querySelector("#testimonials .testimonials__numbers").textContent = data
    }
    testi_control_prev.onclick = function () {
        Musical.decreaseSliceCount(testi_img,"testi",3,400)
        Musical.decreaseSliceCount(testi_content,"testi",3,400)
        let data = ([...testi_img].filter(e => e.classList.contains('active'))[0]).getAttribute("data-testi")
        document.querySelector("#testimonials .testimonials__numbers").textContent = data
    }



    // ============
    // let play = document.querySelectorAll('#gallery .play');
    // let close = document.querySelectorAll('#gallery .close');

    
    // [...play].forEach(function (e) {
    //     const over_lay = e.closest(".item").querySelector(".over__lay")
    //     const close = e.closest(".item").querySelector(".close")
    //     const wrapper_contetnt = e.closest(".item").querySelector(".wrapper__contetnt")
    //     close.style.pointerEvents = "none"
    //     console.log(e);
    //     e.onclick = function() {
    //         if(close.style.pointerEvents === "none") {
    //             close.style.pointerEvents = "all";
    //             close.style.opacity = "1";
    //             over_lay.style.opacity = "1";
    //             wrapper_contetnt.style.opacity = "0";
    //             wrapper_contetnt.style.pointerEvents = "none";
    //             over_lay.style.transform = "translateY(-50%)";
    //         }
    //     }
    // });
    // [...close].forEach(function (e) {
    //     const over_lay = e.closest(".item").querySelector(".over__lay")
    //     const close = e.closest(".item").querySelector(".close")
    //     const wrapper_contetnt = e.closest(".item").querySelector(".wrapper__contetnt")
    //     console.log(e)
    //     e.onclick = function() {
    //         if(close.style.pointerEvents !== "none") {
    //             close.style.pointerEvents = "none";
    //             close.style.opacity = "0";
    //             over_lay.style.opacity = "0";
    //             wrapper_contetnt.style.opacity = "0";
    //             wrapper_contetnt.style.pointerEvents = "all";
    //             over_lay.style.transform = "none";
    //         }
    //     }
    // });




}    





