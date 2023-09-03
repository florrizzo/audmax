// LOGOAUDIOMETRÍA

let list_intensitiesdBLogo = [
  -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
  90, 95,
];
let list_intensitiesLogo = [
  0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13,
  0.14, 0.15, 0.16, 0.17, 0.18, 0.19, 0.2, 0.21, 0.22,
];

let audioLogo = "";
function music(audio) {
  audioLogo = audio;
}

function playAudio() {
  // Crear un contexto de audio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Crear un elemento de audio y cargar un archivo de audio
  const audioElement = new Audio(audioLogo);
  const audioSource = audioContext.createMediaElementSource(audioElement);

  // Crear un nodo de panorámico (panning) y conectarlo al nodo de salida
  const pannerLogo = audioContext.createStereoPanner();
  audioSource.connect(pannerLogo);
  pannerLogo.connect(audioContext.destination);

  // Función para controlar el panorama (de -1 a 1, donde -1 es izquierda y 1 es derecha)
  function setPan(panValue) {
    pannerLogo.pan.value = panValue;
  }

  // Función para ajustar el volumen (de 0 a 1)
  function setVolume(volumeValue) {
    audioElement.volume = volumeValue;
  }

  // Reproducir el audio
  audioElement.play();

  // Ejemplo de cómo cambiar el panorama y el volumen
  const panValue = getSelectedValue("oidoLogo");
  setPan(panValue); // Pan completamente a la izquierda

  let intensity = parseInt(document.getElementById("logoIntensity").innerHTML);
  const intensityAux = [0.001, 0.002, 0.003, 0.004];
  // Manejar la intensidad
  if (intensity % 5 !== 0 && intensity >> 0) {
    const baseIntensity = list_intensitiesdBLogo.indexOf(
      Math.ceil(intensity / 5) * 5 - 5
    );
    console.log(list_intensitiesLogo[baseIntensity]);
    console.log(intensityAux[(Math.abs(intensity) % 5) - 1]);
    intensity =
      list_intensitiesLogo[baseIntensity] + intensityAux[(Math.abs(intensity) % 5) - 1];
  } else {
    const index = list_intensitiesdBLogo.indexOf(intensity);
    intensity = list_intensitiesLogo[index];
  }
  console.log(intensity);
  setVolume(intensity);
}

function tablalogo(lista) {
  for (let i = 0; i < lista.length; i++) {
    let tableSpace = "tablaLogo" + i;
    document.getElementById(tableSpace).innerHTML = lista[i];
  }

  if (
    lista == monosilabicas_M1 ||
    lista == monosilabicas_M2 ||
    lista == monosilabicas_M3
  ) {
    for (let i = 25; i < 50; i++) {
      let tableSpace = "tablaLogo" + i;
      const element = document.getElementById(tableSpace);
      element.classList.remove("hide");
    }
  } else {
    for (let i = 25; i < 50; i++) {
      let tableSpace = "tablaLogo" + i;
      const element = document.getElementById(tableSpace);
      element.classList.add("hide");
    }
  }
}

let contTabla = 0;
function verdeRojo(color) {
  let tableSpace = "tablaLogo" + contTabla;
  contTabla++;
  const element = document.getElementById(tableSpace);
  element.classList.add("bg-" + color);
}
