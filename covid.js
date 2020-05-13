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
                            $('#cstate').text(currState);
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
