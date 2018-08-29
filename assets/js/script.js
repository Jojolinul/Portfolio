var slideIndex = 1;
var divArray = ["cubeSlide", "potatoSlide", "towerSlide", "ssgSlide"];
for(var a = 0; a < divArray.length; a++)
{
  showDivs(slideIndex, divArray[a]);
}

function plusDivs(n, divNames) {
  showDivs(slideIndex += n, divNames);
}

function showDivs(n, divNames) {
  var i;
  var x = document.getElementsByClassName(divNames);
  if (n > x.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = x.length}
  for (i = 0; i < x.length; i++) {
     x[i].style.display = "none";  
  }
  x[slideIndex-1].style.display = "block";  
}