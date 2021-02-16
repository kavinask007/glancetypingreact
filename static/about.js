var i =0;
gsap.registerPlugin(ScrollTrigger);
const tl = gsap.timeline({defaults:{ease:'back.out',onComplete:bodyvisible}});
tl.to('h1',{y:'0%',duration:0.5,stagger:0.25,ease:"power2.out"});
tl.to(".slider",{y:'-100%',duration:0.75,delay:1,ease:"power2.out"});
tl.to(".loadingscreen",{y:'-100%',ease:"power2.out"},"-=0.6");
tl.fromTo("nav",{y:"-100%"},{y:"0%",duration:0.5,ease:"power2.out"});
document.getElementById("main1").style.display="flex";
tl.fromTo(".welcome",{y:"100%",display:"none"},{y:"0%",duration:0.5,display:"flex"});
tl.fromTo(".wrapper",{y:"45%",display:"none"},{y:"0%",duration:0.5,display:"flex"});
tl.fromTo(".why",{y:"45%",display:"none"},{y:"0%",duration:0.5,display:"flex"},"-=0.5");
tl.fromTo(".imgdiv",{y:"45%"},{y:"0%",duration:0.5},"-=0.5");

function bodyvisible(){
    i=i+1; 
    if(i==21){  
        setInterval(bodyvisible2,900);
    }
    
}
function bodyvisible2(){
    document.getElementsByTagName('body')[0].style.overflow='visible';
}

gsap.to("#female",{
    scrollTrigger:{
        trigger:".svgcontainer",
        toggleActions:"restart none none none",
        start:'center center',
        scrub:true, 
        endTrigger:'.thirdstep',
        end:"center center",
       pin:".firstholder",
       onUpdate: ({progress,direction}) => changecolor(progress,direction),
    },
    x:650,

});
gsap.from(".wpm1",{
    scrollTrigger:{
        trigger:".wpm-wrapper",
        toggleActions:"restart none none none",
        start:"top 90%",
    },
    x:400,

    }

);
gsap.from(".wpm2",{
    scrollTrigger:{
        trigger:".wpm-wrapper",
        toggleActions:"restart none none none",
        start:"top 90%",
    },
    x:-700,

    }

);
gsap.from(".acc1",{
    scrollTrigger:{
        trigger:".accuracy-wrapper",
        toggleActions:"restart none none none",
        start:"top 90%",
    },
    x:400,

    }

);
gsap.from(".acc2",{
    scrollTrigger:{
        trigger:".accuracy-wrapper",
        toggleActions:"restart none none none",
        start:'top 90%',
    },
    x:-700,

    }

);

function changecolor(progress,direction){
    var roundedNumber = Math.round(progress * 10) / 10;
    if(roundedNumber==0.1&direction==1){
        document.getElementsByClassName("progress")[0].style.width="30%";  
    }
    if(roundedNumber==0.1&direction==-1){
        document.getElementsByClassName("progress")[0].style.width="0%";  
    }
    if(roundedNumber==0.3&direction==1){ 
       document.getElementById("secondcircle").style.fill="#6C63FF";
       document.getElementsByClassName("progress")[0].style.width="60%";
       document.getElementById("instruct").innerHTML=" Step:2 <br>Read the sentence before the timer runs out";
    
    }
    if(roundedNumber==0.3 &direction==-1){ 
        document.getElementById("secondcircle").style.fill="#6C63FF";
        document.getElementsByClassName("progress")[0].style.width="30%";
        document.getElementById("instruct").innerHTML="Step:1<br>The game starts when <br>you press enter";
        document.getElementById("secondcircle").style.fill="#EFEDED";
    
     }
    if(roundedNumber==0.8&direction==1){
        document.getElementById("thirdcircle").style.fill="#6C63FF";
        document.getElementById("secondcircle").style.fill="#6C63FF";
        document.getElementsByClassName("progress")[0].style.width="100%";
        document.getElementById("instruct").innerHTML="Step:3<br>Type the sentence from your memory";
    
     }
     if(roundedNumber==0.8&direction==-1){
        document.getElementById("thirdcircle").style.fill="#EFEDED";
        document.getElementsByClassName("progress")[0].style.width="60%";
        document.getElementById("instruct").innerHTML="Step:2<br>Read the sentence before the timer runs out";
    
     }

}
window.onbeforeunload = function () {
    window.scrollTo(0,0);
};
let r=document.getElementById("backtotop");
r.addEventListener("click",backtotop);
function backtotop(){
    window.scrollTo(0,0);
}