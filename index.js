$(document).ready(() => {



    let slides = [];
    let slide;

    //Do the thing
    loadImages();


    //testing only
    function loadImages() {
      $.ajax({
        type:"GET",
        url:"https://api.unsplash.com/photos/random/?count=5&client_id=565F9btxebBSkZbmvf23lLimTa9_6SvSDwigOMGvVHc",
        success: function(data) {
          makeSlides(data);
          bindListeners();
        },
        dataType: 'json',
      });
    }

    function makeSlides(data) { //and menu, temporarily
      for(let i=0; i<data.length; i++) {
        slides.push({
          "index": i,
          "id": data[i].id,
          "src": data[i].urls.regular,
          "tnSrc": data[i].urls.thumb,
          "alt": data[i].alt_description,
          "width": data[i].width,
          "height": data[i].height,
          "angle":  0,
        });
        if(i != 0) {          
          $(".img-menu-item:first").clone().appendTo($(".img-menu")); //Testing only
          $(".slide:first").clone().appendTo($(".doc-modal-content"));
        }
        $(".img-menu-item:last").attr("id", slides[i].id); //Testing only
        $(".img-menu-img:last").attr("src", slides[i].tnSrc); //Testing only

        $(".slide:last").attr("id", "slide-" + slides[i].id);

        $(".doc:last").attr("src", slides[i].src);
        $(".doc:last").attr("alt", slides[i].alt);
      }
      $(".img-menu").show();
    }

    function setSlide(k, v) {
      if(slide){
        $("#slide-"+slide.id).css("transform", "rotate("+slide.angle+"deg)");
      }
      slide = slides.find(item => item[k] === v);
      slideX = slide.index;
      scaleSlides();
    }

    //Important that this happens AFTER all the elements are loaded and cloned.
    function bindListeners() {
      $(".img-menu-item").click(() => {
        if(!slides) {
          makeSlides();
        }
        setSlideById($(this).attr("id"));
        openModal();
      });
      $(".close").click(() => {
        closeModal()
      });
      $(".rotate").click(() => {
        rotateSlide();
      });
      $(".next").click(() => {
        nextSlide();
      });
      $(".prev").click(() => {
        prevSlide();
      });
      $(window).resize(debounced(100, () => {
        scaleSlides();
      }));
    }

    function nextSlide() {
      $("#slide-"+slide.id).addClass("hide left");

      setSlideByIndex( (slide.index + 1) % slides.length );
      $("#slide-"+slide.id).removeClass("hide right");
    }

    function prevSlide() {
      $("#slide-"+slide.id).addClass("hide");
      setSlideByIndex( (slide.index + slides.length - 1) % slides.length );
      $("#slide-"+slide.id).removeClass("hide");
    }


    function setSlideById(id) {
      setSlide("id", id);
    }

    function setSlideByIndex(i) {
      setSlide("index", i);
    }
    
    function openModal() {
      $(".doc-modal, #slide-"+slide.id).removeClass("hide");
    }

    function closeModal() {
      $(".doc-modal, #slide-"+slide.id).addClass("hide");
    }

    function scaleSlides(bleed = 0.995) {
      if($(".doc-modal").is(":visible")) {
        let Xo = $(".doc-modal-content").width();
        let Yo = $(".doc-modal-content").height();
        for(let s of slides){
          scaleSlide(s, Xo, Yo);
        }
      }
    }

    function rotateSlide() {
      slide.angle += 90;
      let Xo = $(".doc-modal-content").width();
      let Yo = $(".doc-modal-content").height();
      scaleSlide(slide, Xo, Yo);
    }

    function scaleSlide(s, Xo, Yo, bleed = 0.995) {
      let Xi = $("#slide-"+s.id).width();
      let Yi = $("#slide-"+s.id).height();
      if(s.angle % 180 !== 0) {
        [Xi, Yi] = [Yi, Xi];
      }
      s.scale = Xo / Xi;
      if(Xo/Yo > Xi/Yi) {
        s.scale = Yo / Yi;
      }
      $("#slide-"+slide.id).css("transform", "rotate("+s.angle+"deg) scale("+s.scale/bleed+")");
    }

    // This keeps the callback that is passed to it from running until 
    // a number of milliseconds (specified by delay) have passed
    function debounced(delay, fn) {
      let timerId;
      return function (...args) {
        if (timerId) {
          clearTimeout(timerId);
        }
        timerId = setTimeout(() => {
          fn(...args);
          timerId = null;
        }, delay);
      }
    }

  });//document.ready() end