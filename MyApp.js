const apiKey="09d2abee3863323390637f565f19b91f";
const main=document.getElementById('main');
const form=document.getElementById('form');
const search=document.getElementById('search');
const ll=(name) => `http://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=5&appid=${apiKey}`;
async function getCityLatLon(name){
    const res=await fetch(ll(name),{origin:"cros"});
    const resData=await res.json();
    const lon=resData[0].lon;
    const lat=resData[0].lat;
    getWeatherByLocation(lat,lon);
}
async function getWeatherByLocation(lati,long){
    const url=(lati,long)=> `http://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=${apiKey}`;
    const re=await fetch(url(lati,long),{origin:"cros"});
    const resDat=await re.json();
    console.log(resDat);
    addWeatherToPage(resDat);
}
function addWeatherToPage(data){
    mainweather();
    function mainweather() {
        let tempw=[];
        let lw=[];
        for(let ind=0;ind<=39;ind++)
        { 
            if(!tempw.includes((data.list[ind].dt_txt).substring(0,10))){
                tempw.push((data.list[ind].dt_txt).substring(0,10));
                lw.push(ind);
            }
        }
        for(let  i of lw){
            const temp=KtoC(data.list[i].main.temp);
            const weather=document.createElement("div");
            weather.classList.add('weather');
            weather.innerHTML=`
            <small>${data.list[i].weather[0].main}</small>
            <h2>
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"/>
            ${temp}°C
            <img src="https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png"/>
            </h2>
            <small>
            ${dmy(data.list[i].dt_txt)}
              <i class="fa fa-angle-down" >
              </i>
            </small>`;
            main.appendChild(weather);
            miniweather(data.list[i].dt_txt);
            weather.onclick=function(){};
        }
    }
    function miniweather(curr){
        const mw=document.createElement('div');
        mw.classList.add('mw');
        let tempsw=[];
        let lsw=[];
        for(let ix=0;ix<=39;ix++)
        {
            if(!(tempsw.includes(data.list[ix].dt_txt)))
            {
                tempsw.push(data.list[ix].dt_txt);
            }
        }
        for(let indi=0;indi<=39;indi++)
        {
            if(tempsw[indi].startsWith((curr.substring(0,10))))
            {
                lsw.push(indi);
            }
        }
        for(let j of lsw){ 
            const subtemp=KtoC(data.list[j].main.temp);
            const subweather=document.createElement('div');
            subweather.classList.add('subweather');
            subweather.innerHTML=`
            <small>${data.list[j].weather[0].main}</small>
            <h2><img src="https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png"/> ${subtemp}°C <img src="https://openweathermap.org/img/wn/${data.list[j].weather[0].icon}@2x.png" /></h2>
            <small>${dmy(data.list[j].dt_txt)}</small>`;
            mw.appendChild(subweather);
        }
        main.appendChild(mw);
    }
}   
function KtoC(K){
    return Math.floor(K-273);
}
function dmy(date){
    const dict={01:"Jan",1:"Jan",02:"Feb",2:"Feb",03:"Mar",3:"Mar",04:"Apr",4:"Apr",05:"May",5:"May",06:"Jun",6:"Jun",
                07:"Jul",7:"Jul",08:"Aug",8:"Aug",09:"Sep",9:"Sep",10:"Oct",11:"Nov",12:"Dec"};
    let today=new Date();
    let text=date;
    let yr=text.substring(0,4);
    let mt=text.substring(5,7);
    let dt=text.substring(8,10);
    let hr=text.substring(11,13);
    let min=text.substring(14,16);
    let time;
    if(hr>=12){
        if(hr>12){
            hr=hr%12;
        }
        time=" "+hr+":"+min+" "+"PM";
    }
    else{
        if(hr=="00"){
            hr="12";
        }
        time=" "+hr+":"+min+" "+"AM";
    }
    let res=""+dt+"-"+dict[parseInt(mt)]+"-"+""+yr+time;
    if((dt==(""+today.getDate()))&&(dict[parseInt(mt)]==dict[(today.getMonth()+1)])&&(yr==(""+today.getFullYear()))){ 
        res="Today"+time;
        return res;
    }
    else if((dict[parseInt(mt)]==dict[(today.getMonth()+1)])&&(yr==(""+today.getFullYear()))){
        if(dt==(""+(today.getDate()-1))){
            res="Yesterday"+time;
            return res;
        }
        if((today.getDate()-1)=="00"||(today.getDate()-1)=="0"){
            res="Yesterday"+time;
        }
        if(dt==(""+(today.getDate()+1))){
            res="Tomorrow"+time;
        }
        if(((today.getDate()+1)=="29")&&((today.getMonth()+1)=="2")){
            res="Tomorrow"+time;
        }
        if(((today.getDate()+1)=="31")&&(((today.getMonth()+1)=="1")||((today.getMonth()+1)=="3")||((today.getMonth()+1)=="5")||((today.getMonth()+1)=="7")||((today.getMonth()+1)=="8")||((today.getMonth()+1)=="10")||((today.getMonth()+1)=="12"))) {
            res="Tomorrow"+time;
        }
        if(((today.getDate()+1)=="32")&&(((today.getMonth()+1)=="4")||((today.getMonth()+1)=="6")||((today.getMonth()+1)=="9")||((today.getMonth()+1)=="11"))) {
            res="Tomorrow"+time;
        }         
        else{
            return res;
        }
    }
    else{
        return res;
    }   
}
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    let name=search.value;
    if(name){
        getCityLatLon(name);
    }
});



