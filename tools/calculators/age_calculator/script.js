/* ==========================================
   ELEMENTS
========================================== */

const dob = document.getElementById("dob");

const calculateBtn = document.getElementById("calculateBtn");

const resetBtn = document.getElementById("resetBtn");

/* ========= RESULT ========= */

const years = document.getElementById("years");
const months = document.getElementById("months");
const days = document.getElementById("days");

const totalMonths = document.getElementById("totalMonths");
const totalWeeks = document.getElementById("totalWeeks");
const totalDays = document.getElementById("totalDays");

/* ==========================================
   TODAY
========================================== */

const today = new Date();

document.getElementById("todayDate").textContent =
today.toLocaleDateString("en-GB",{

day:"numeric",

month:"long",

year:"numeric"

});

/* ==========================================
   EVENTS
========================================== */

calculateBtn.addEventListener("click",calculateAge);

resetBtn.addEventListener("click",resetCalculator);

/* ==========================================
   AGE CALCULATION
========================================== */

function calculateAge(){

if(dob.value===""){

alert("Please select your Date of Birth.");

return;

}

const birthDate=new Date(dob.value);

const currentDate=new Date();

/* Future Date */

if(birthDate>currentDate){

alert("Date of Birth cannot be in the future.");

return;

}

/* ===== Exact Age ===== */

let year=currentDate.getFullYear()-birthDate.getFullYear();

let month=currentDate.getMonth()-birthDate.getMonth();

let day=currentDate.getDate()-birthDate.getDate();

if(day<0){

month--;

const previousMonthDays=new Date(

currentDate.getFullYear(),

currentDate.getMonth(),

0

).getDate();

day+=previousMonthDays;

}

if(month<0){

year--;

month+=12;

}

/* ===== Result ===== */

years.textContent=year;

months.textContent=month;

days.textContent=day;

/* ===== Totals ===== */

const diff=currentDate-birthDate;

const totalDay=Math.floor(

diff/(1000*60*60*24)

);

const totalMonth=(year*12)+month;

const totalWeek=Math.floor(

totalDay/7

);

totalMonths.textContent=

totalMonth.toLocaleString();

totalWeeks.textContent=

totalWeek.toLocaleString();

totalDays.textContent=

totalDay.toLocaleString();

/* ===== Other Functions ===== */

birthInformation(birthDate,currentDate);

birthdayCountdown(birthDate,currentDate);

}
/* ==========================================
   BIRTH INFORMATION
========================================== */

function birthInformation(birthDate, currentDate){

/* ===== Day of Birth ===== */

const weekDays=[

"Sunday",
"Monday",
"Tuesday",
"Wednesday",
"Thursday",
"Friday",
"Saturday"

];

document.getElementById("birthDay").textContent=

weekDays[birthDate.getDay()];

/* ===== Leap Year ===== */

const year=birthDate.getFullYear();

const leap=(year%4===0 && year%100!==0) || (year%400===0);

document.getElementById("leapYear").textContent=

leap ? "Yes" : "No";

/* ===== Western Zodiac ===== */

const month=birthDate.getMonth()+1;

const day=birthDate.getDate();

let zodiac="";

if((month==1&&day>=20)||(month==2&&day<=18))
zodiac="Aquarius";

else if((month==2&&day>=19)||(month==3&&day<=20))
zodiac="Pisces";

else if((month==3&&day>=21)||(month==4&&day<=19))
zodiac="Aries";

else if((month==4&&day>=20)||(month==5&&day<=20))
zodiac="Taurus";

else if((month==5&&day>=21)||(month==6&&day<=20))
zodiac="Gemini";

else if((month==6&&day>=21)||(month==7&&day<=22))
zodiac="Cancer";

else if((month==7&&day>=23)||(month==8&&day<=22))
zodiac="Leo";

else if((month==8&&day>=23)||(month==9&&day<=22))
zodiac="Virgo";

else if((month==9&&day>=23)||(month==10&&day<=22))
zodiac="Libra";

else if((month==10&&day>=23)||(month==11&&day<=21))
zodiac="Scorpio";

else if((month==11&&day>=22)||(month==12&&day<=21))
zodiac="Sagittarius";

else
zodiac="Capricorn";

document.getElementById("zodiac").textContent=zodiac;

}

/* ==========================================
   NEXT BIRTHDAY
========================================== */

function birthdayCountdown(birthDate,currentDate){

let nextBirthday=new Date(

currentDate.getFullYear(),

birthDate.getMonth(),

birthDate.getDate()

);

/* Handle 29 February */

if(

birthDate.getMonth()==1 &&

birthDate.getDate()==29

){

const leapYear=

(nextBirthday.getFullYear()%4===0 &&
nextBirthday.getFullYear()%100!==0) ||

(nextBirthday.getFullYear()%400===0);

if(!leapYear){

nextBirthday=new Date(

nextBirthday.getFullYear(),

2,

1

);

}

}

if(nextBirthday<currentDate){

nextBirthday.setFullYear(

nextBirthday.getFullYear()+1

);

}

document.getElementById("nextBirthday").textContent=

nextBirthday.toLocaleDateString("en-GB",{

day:"numeric",

month:"long",

year:"numeric"

});

/* Countdown */

const difference=

nextBirthday-currentDate;

const daysLeft=Math.ceil(

difference/(1000*60*60*24)

);

const monthsLeft=Math.floor(daysLeft/30);

const remainingDays=daysLeft%30;

document.getElementById("countdown").textContent=

monthsLeft+" Months "+remainingDays+" Days";

}

/* ==========================================
   RESET
========================================== */

function resetCalculator(){

dob.value="";

years.textContent="0";
months.textContent="0";
days.textContent="0";

totalMonths.textContent="0";
totalWeeks.textContent="0";
totalDays.textContent="0";

document.getElementById("birthDay").textContent="--";
document.getElementById("zodiac").textContent="--";
document.getElementById("leapYear").textContent="--";

document.getElementById("nextBirthday").textContent="--";
document.getElementById("countdown").textContent="--";

document.getElementById("todayDate").textContent=

new Date().toLocaleDateString("en-GB",{

day:"numeric",

month:"long",

year:"numeric"

});

}

/* ==========================================
   AUTO CALCULATE
========================================== */

dob.addEventListener("change",function(){

if(dob.value){

calculateAge();

}

});