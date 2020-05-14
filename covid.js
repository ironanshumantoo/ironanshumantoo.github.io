//html elements



//mouse position
mouse=function(x,y){
    this.x=x;
    this.y=y;
}
window.addEventListener('mousemove',function(event){
mouse.x=event.clientX;
mouse.y=event.clientY;
});
//distance calculator
function distance(x1,y1,x2,y2){
    let a=(x1-x2)*(x1-x2);
    let b=(y1-y2)*(y1-y2);
    return Math.sqrt(a+b);
}
//canvas

var canvas=document.querySelector('canvas');
canvas.height=window.innerHeight;
canvas.width=window.innerWidth;
var c=canvas.getContext("2d");
//function to clear canvas
function clearCanvas(){
    c.clearRect(0,0,canvas.width,canvas.height);
}

//canvas objects and anime
//covid images
var covidImage = new Image();
var smallcovidImage=new Image();
covidImage.onload = function() {
 smallcovidImage.onload=function(){

     function SmallVirus(x,y,dx,dy,w,h){
        this.x=x;
        this.y=y;
        
        this.dx=dx;
        this.dy=dy;
        this.w=w;
        this.h=h;
        this.draw=function(){
            c.drawImage(smallcovidImage,this.x,this.y,this.w,this.h);
            
        }
        this.update=function(){
            //chech for corner touches
            if(this.x+this.w>=window.innerWidth||this.x<=0)
            this.dx=-this.dx;
            if(this.y+this.h>=window.innerHeight||this.y<=0)
            this.dy=-this.dy;
            
            //update x & y
            
            this.x+=this.dx;
            this.y+=this.dy;
            this.draw();
        }

      
        

    }

    function Virus(x,y,dx,dy,w,h){
        this.x=x;
        this.y=y;
        this.prevx=this.x;
        this.prevy=this.y;
        this.dx=dx;this.mindx=Math.abs(dx);
        this.dy=dy;this.mindy=Math.abs(dy);
        this.w=w;
        this.h=h;
        this.friction=0.92;
        this.draw=function(){
            c.drawImage(covidImage,this.x,this.y,this.w,this.h);
            
        }
        this.update=function(){
            if(this.x+this.w>=window.innerWidth||this.x<=0)
            this.dx=-this.dx;
            if(this.y+this.h>=window.innerHeight||this.y<=0)
            this.dy=-this.dy;
            //check for collision
            this.currentDistance=distance(this.x,this.y,mouse.x,mouse.y);
            this.prevDistance=distance(this.prevx,this.prevy,mouse.x,mouse.y);
            //console.log(this.currentDistance,"current");
            if(this.currentDistance<80 && this.currentDistance<this.prevDistance)
            {
                this.dx=-this.dx*5;
                this.dy=-this.dy*5;
            }
            this.prevx=this.x;
            this.prevy=this.y;
            this.dx*=this.friction;
            this.dy*=this.friction;
            if(Math.abs(this.dx)<this.mindx)
            {   if(this.dx<0)
                this.dx=-this.mindx;
                else
                this.dx=this.mindx;
            }
            if(Math.abs(this.dy)<this.mindy)
            {   if(this.dy<0)
                this.dy=-this.mindy;
                else
                this.dy=this.mindy;
            }
            this.x+=this.dx;
            this.y+=this.dy;
            this.draw();
        }
    }
    var viruses=[],smallViruses=[];
    for(var i=0;i<30;i++)
    {   var vx=Math.random()*(window.innerWidth);
        var vy=Math.random()*(window.innerHeight);
        var sx=Math.random()*(window.innerWidth);
        var sy=Math.random()*window.innerHeight;
        var vdx=(Math.random()-0.5)*2;
        var vdy=(Math.random()-0.5)*2;
       var vw=(Math.random())*20;
        var vh=vw;
        viruses[i]=new Virus(vx,vy,vdx,vdy,vw,vh);
        smallViruses[i]=new SmallVirus(sx,sy,vdx,vdy,vw/3,vh/3);
    }

    function animation(){
        requestAnimationFrame(animation);
        clearCanvas();
        for(var i=0;i<viruses.length;i++)
        {viruses[i].update();
            smallViruses[i].update();
        }
       
    }
  animation();
 }
}
//covid image sources
covidImage.src = 'coronavirus.svg';
smallcovidImage.src='coronavirus.svg';
//sources end


//data management
$(document).ready(function(){


 $.getJSON('https://api.covid19india.org/data.json',function(data){
     var statewise=data.statewise;
     //get location based
     var totalCases,totalRecovered,totalDeaths,totalActive;
     totalCases=statewise[0].confirmed;
     totalRecovered=statewise[0].recovered;
     totalDeaths=statewise[0].deaths;
     totalActive=statewise[0].active;
     //updating to html
     $('#tcases').text(totalCases);
     $('#trecovered').text(totalRecovered);
     $('#tdeaths').text(totalDeaths);
     $('#tactive').text(totalActive);
     $.getJSON('https://api.ipify.org/?format=json',function(ipaddress){
    var ip=ipaddress.ip;
     var locationAddress='https://ipapi.co/'+ip+'/json/';
     console.log(locationAddress);
     
     $.getJSON(locationAddress,function(location){
        
     var currcity=location.city;
     var currCountryCode=location.country;
     var currState=location.region_code;
     var currStateName=location.region;
      //district wise info
      $.getJSON('https://api.covid19india.org/state_district_wise.json',function(distData){
            //onsole.log(currState);
            $.each(distData,function(statename,statedata){
                //console.log(statename.toLowerCase());
                if(distData[statename].statecode==currState)
                {  console.log(distData[statename].statecode);
                    
                    $.each(distData[statename].districtData,function(districtName,districtData){
                        //console.log(districtName);
                        if(districtName.toLowerCase()==currcity.toLowerCase())
                        { var cityWiseData=distData[statename].districtData[districtName];
                            console.log(cityWiseData);
                            $('#cstate').text(currStateName);
                            $('#ccity').text(currcity);
                            $('#cactive').text(cityWiseData.active);
                            $('#crecovered').text(cityWiseData.recovered);
                            $('#cconfirmed').text(cityWiseData.confirmed);
                            console.log("inner"+currState);
                        }
                    });
                }
            });
         
      });

    }); 
  
});

 });
 
});

