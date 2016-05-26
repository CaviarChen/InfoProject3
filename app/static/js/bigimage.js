images = [
    "static/image/bg/melbourne.jpg",
    "static/image/bg/melbourne2.jpg",
    "static/image/bg/skyline.jpg"
 ]


$.backstretch(images, {duration: 4000, fade: 800});

setTimeout(function(){
    $("body").data("backstretch").options['fade'] = 2000;
}, 2000);
