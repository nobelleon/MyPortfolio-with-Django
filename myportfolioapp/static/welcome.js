// ---------------------------------------------------------------- //
// -----------------------   INTRO LOADING  ----------------------- //  

document.addEventListener("DOMContentLoaded", (event) => {
  // Split text using SplitType
const loadingText = new SplitType(".loading-text.initial", { types: "chars" });
const completeText = new SplitType(".loading-text.complete", {
types: "chars"
});
const titleText = new SplitType(".content h1", { types: "chars" });
const paragraphText = new SplitType(".content p", { types: "chars" });

// Initial states
gsap.set(".loading-text.complete", { y: "100%" });
gsap.set(loadingText.chars, { opacity: 0, y: 100 });
gsap.set(completeText.chars, { opacity: 0, y: 100 });

// Animate in loading text
gsap.to(loadingText.chars, {
opacity: 1,
y: 0,
duration: 0.5,
stagger: 0.05,
ease: "power2.out"
});

const colorStages = [
{ bg: "rgb(60, 66, 55)", text: "rgb(230, 225, 215)" },
{ bg: "rgb(200, 180, 160)", text: "rgb(60, 66, 55)" },
{ bg: "rgb(226, 146, 247)", text: "rgb(200, 32, 241)" },
{ bg: "#021027", text: "#0e3b85" },
];

function updateColors(progress) {
const stage = Math.floor(progress / 25);
if (stage < colorStages.length) {
  document.querySelector(".preloader").style.backgroundColor =
    colorStages[stage].bg;
  document.querySelector(".progress-bar").style.backgroundColor =
    colorStages[stage].text;
  document
    .querySelectorAll(".loading-text .char, .percentage")
    .forEach((el) => {
      el.style.color = colorStages[stage].text;
    });
}
}

const tl = gsap.timeline();

tl.to(".progress-bar", {
width: "100%",
duration: 5,
ease: "power1.inOut",
onUpdate: function () {
  const progress = Math.round(this.progress() * 100);
  document.querySelector(".percentage").textContent = progress;
  updateColors(progress);
}
})
.to(".loading-text.initial", {
  y: "-100%",
  duration: 0.5,
  ease: "power2.inOut"
})
.to(
  ".loading-text.complete",
  {
    y: "0%",
    duration: 0.5,
    ease: "power2.inOut"
  },
  "<"
)
.to(
  completeText.chars,
  {
    opacity: 1,
    y: 0,
    duration: 0.3,
    stagger: 0.03,
    ease: "power2.out"
  },
  "<0.2"
)
.to(".preloader", {
  y: "-100vh",
  duration: 1,
  ease: "power2.inOut",
  delay: 0.8
})
.set(
  ".content",
  {
    visibility: "visible"
  },
  "-=1"
)
.to(
  [titleText.chars, paragraphText.chars],
  {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.02,
    ease: "power4.out"
  },
  "-=0.5"
)
.set(".preloader", {
  display: "none"
});
});

    
// -------------------------------------------------------- //
// -----------------------   AUDIO  ----------------------- //  

const bars = document.querySelectorAll(".audiobar");
const audioContainer = document.querySelector(".audio--container");
const audio = document.querySelector("audio");
let interval = null;                             // this

bars.forEach(bar =>{
      let size = Math.random();
      bar.style.transform = `scaleY(${size})`;
    });

audioContainer.addEventListener("click", ()=>{
      
  if(interval){
    clearInterval(interval);
    audio.pause();
    interval = null;
    
    bars.forEach(bar =>{
              bar.style.background = `white`;
            });   
    return 
  }else{
    audio.play();
    interval = setInterval(()=>{

    bars.forEach(bar =>{
              let size = Math.random();
              let hue = Math.floor(Math.random()*360);
              bar.style.transform = `scaleY(${size})`;
              bar.style.background = `hsl(${hue}, 90%, 60%)`;
            });

        }, 150);   
  } 
  // interval = !interval;               // this
});

audio.addEventListener("ended", ()=>{
  clearInterval(interval);
});



