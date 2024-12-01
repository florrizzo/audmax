// Tabs general
function openPage(pageName, elmnt, color) {
  let i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].style.backgroundColor = "";
  }
  document.getElementById(pageName).style.display = "block";
  elmnt.style.backgroundColor = color;
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// -----------------------------------------------------------------------------
// Funciones generales

function changeIntensityn1(id) {
  let intensity = parseInt(document.getElementById(id).innerHTML);
  // Subir o bajar la intensidad si no estoy en los extremos
  intensity > -10 ? intensity-- : (intensity = intensity);
  // Devolver valor del indice
  document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp1(id) {
  let intensity = parseInt(document.getElementById(id).innerHTML);
  // Subir o bajar la intensidad si no estoy en los extremo
  intensity < 95 ? intensity++ : (intensity = intensity);
  // Devolver valor del indice
  document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp5(id) {
  let intensity = parseInt(document.getElementById(id).innerHTML);
  // Subir o bajar la intensidad si no estoy en los extremo
  if (intensity < 120) {
    intensity % 5 != 0
      ? (intensity = Math.ceil(intensity / 5) * 5)
      : (intensity += 5);
  }
  // Devolver valor del indice
  document.getElementById(id).innerHTML = intensity;
}

function changeIntensityn5(id, type) {
  let intensity = parseInt(document.getElementById(id).innerHTML);
  // Subir o bajar la intensidad si no estoy en los extremo
  if (
    (intensity > -10 && type == "audio") ||
    (intensity > 5 && type == "mask")
  ) {
    intensity % 5 != 0
      ? (intensity = Math.ceil(intensity / 5) * 5 - 5)
      : (intensity -= 5);
  }
  // Devolver valor del indice
  document.getElementById(id).innerHTML = intensity;
}

// -------------------------------------------------------------------------------------------



