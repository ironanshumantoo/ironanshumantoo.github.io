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
/*if(canvas.width<canvas.height)
alert('Please roatate your device for better experience or switch to a computer.');*/
var c=canvas.getContext("2d");
//function to clear canvas
function clearCanvas(){
    c.clearRect(0,0,canvas.width,canvas.height);
}
//canvas size update
function canvasUpdate(){
    canvas.height=window.innerHeight;
    canvas.width=window.innerWidth;

}
//canvas objects and anime
//covid images
var covidImage = new Image();
var smallcovidImage=new Image();
covidImage.onload = function() {
    console.log('covidImage');

     function SmallVirus(x,y,dx,dy,w,h){
        this.x=x;
        this.y=y;
        
        this.dx=dx;
        this.dy=dy;
        this.w=w;
        this.h=h;
        this.draw=function(){
            c.drawImage(covidImage,this.x,this.y,this.w,this.h);
            
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
                this.dx=this.dx<0?10:-10;
                this.dy=this.dy<0?10:-10;
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
        canvasUpdate();
        clearCanvas();
        for(var i=0;i<viruses.length;i++)
        {viruses[i].update();
            smallViruses[i].update();
        }
        //console.log(document.getElementById('hideshow0').offsetTop);
        
    }
  animation();
 
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
     var totalCases,totalRecovered,totalDeaths,totalActive,deltaTotalCases,deltaTotalRecovered,
     deltaTotalDeaths;
     totalCases=statewise[0].confirmed;
     totalRecovered=statewise[0].recovered;
     totalDeaths=statewise[0].deaths;
     totalActive=statewise[0].active;
     deltaTotalCases=statewise[0].deltaconfirmed;
     deltaTotalRecovered=statewise[0].deltarecovered;
     deltaTotalDeaths=statewise[0].deltadeaths;
     //updating to html
     $('#tcases').text(totalCases);
     $('#trecovered').text(totalRecovered);
     $('#tdeaths').text(totalDeaths);
     $('#tactive').text(totalActive);
     $('#del_tcases').text("+"+deltaTotalCases);
     $('#del_tdeaths').text("+"+deltaTotalDeaths);
     $('#del_trecovered').text("+"+deltaTotalRecovered);

     $.getJSON('https://api.ipify.org/?format=json',function(ipaddress){
    var ip=ipaddress.ip;
     var locationAddress='https://ipapi.co/'+ip+'/json/';
     console.log(locationAddress);
     
     $.getJSON(locationAddress,function(location){
     var stateSortedData=[];   
     var currcity=location.city;
     var currCountryCode=location.country;
     var currState=location.region_code;
     var currStateName=location.region;
        //current state info
       for(var k=0;k<data.statewise.length;k++)
       {    stateSortedData.push(data.statewise[k].confirmed);
           if(data.statewise[k].statecode==currState)
           { let sdata=data.statewise[k];
               $('#cstate').text(sdata.state);
               $('#sconfirmed').text(sdata.confirmed);
               $('#sactive').text(sdata.active);
               $('#srecovered').text(sdata.recovered);
               $('#sdeath').text(sdata.deaths);
               $('#del_scases').text("+"+sdata.deltaconfirmed);
               $('#del_sdeath').text("+"+sdata.deltadeaths);
               $('#del_srecovered').text("+"+sdata.deltarecovered);
               $('.covidLogo').css('visibility','hidden');
               $('.otherBar').css('visibility','visible');
               $('#topbar').css('visibility','visible');
               //$('#topbar2').css('visibility','visible');
               $('.toptable').css('visibility','visible');
               
            
           }
       }
       stateSortedData.sort(function(a,b){return b-a});
       var addedStateList=[];       
       for(var i=1;i<stateSortedData.length;i++)
       {
           for(var j=0;j<data.statewise.length;j++)
           {
               if(data.statewise[j].confirmed==stateSortedData[i]&&
                !addedStateList.includes(data.statewise[j].statecode))
               {
                   $('.wrapper2').append(` 
                   <div >
                       <div class='otherbar design' id="hideshow`+i+`" >
                      
                           <table class="othertables">
                             <colgroup>
                                <col span="1" style="width: 30%;">
                
                             </colgroup>
                               <tr>
                           <td><span class="tabletext">`+data.statewise[j].state+`</span></td>
                           <td><span class="tabletext">`+data.statewise[j].confirmed+`</span><span class="delta" >+`+data.statewise[j].deltaconfirmed+`</span></td>
                           <td><span class="tabletext">`+data.statewise[j].active+`</span></td>
                           <td><span class="tabletext">`+data.statewise[j].recovered+` </span><span class="deltaRecover">+`+data.statewise[j].deltarecovered+`</span></td>
                           <td><span class="tabletext">`+data.statewise[j].deaths+`</span><span class="delta" >+`+data.statewise[j].deltadeaths+`</span></td>
                           </tr> 
                           </table>
                           
                       </div>
                       
                       <div class='intergap'></div>
                        <div class='tableborderline' style="height:1px;background-color:black;"></div>
                        </div>
                     `
                   );
                    addedStateList.push(data.statewise[j].statecode);
                  // console.log(data.statewise[j]);
                   break;
               }
           }
       }
       //otherbar visibility
       $('.otherbar').css('visibility','visible');
       //sticky other bar hideshow
       //did not work



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
                            $('#cdeath').text(cityWiseData.deceased);
                            $('#del_ccases').text("+"+cityWiseData.delta.confirmed);
                            $('#del_crecovered').text("+"+cityWiseData.delta.recovered);
                            $('#del_cdeath').text("+"+cityWiseData.delta.deceased);
                            console.log("inner"+currState);
                            $('.wrapper2').append('<div>hey its me</div>');
                        }
                    });
                }
            });
         
      });

    }); 
  
});

 });
 
});

