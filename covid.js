$(document).ready(function(){

 $.getJSON('https://api.covid19india.org/data.json',function(data){
     var statewise=data.statewise;
     //get location based
     $.getJSON('https://geolocation-db.com/json/',function(location){
     var currcity=location.city;
     console.log(currcity);
     var currState=location.state;
      //district wise info
      $.getJSON('https://api.covid19india.org/state_district_wise.json',function(distData){
            //onsole.log(currState);
            $.each(distData,function(statename,statedata){
                //console.log(statename.toLowerCase());
                if(statename.toLowerCase()==currState.toLowerCase())
                {  //console.log(distData[statename]);
                    
                    $.each(distData[statename].districtData,function(districtName,districtData){
                        //console.log(districtName);
                        if(districtName.toLowerCase()==currcity.toLowerCase())
                        { var cityWiseData=distData[statename].districtData[districtName];
                            console.log(cityWiseData);
                            $('#cstate').append(currState);
                            $('#ccity').append(currcity);
                            $('#cactive').append(cityWiseData.active);
                            $('#crecovered').append(cityWiseData.recovered);
                            $('#cconfirmed').append(cityWiseData.confirmed);
                            console.log("inner"+currState);
                        }
                    });
                }
            });
         
      });

    }); 
  


 });
 
});
