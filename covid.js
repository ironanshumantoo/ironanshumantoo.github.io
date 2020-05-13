$(document).ready(function(){
//get ip address
var ip;
$.get('https://api.ipify.org/?format=json', function(data) {
    console.log(data.ip);
    //ip=data.ip;

});
//console.log(ip);

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
