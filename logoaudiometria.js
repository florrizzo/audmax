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

let audioElement = null;
function playAudio() {
  // Crear un contexto de audio
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Crear un elemento de audio y cargar un archivo de audio
  audioElement = new Audio(audioLogo);
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
    intensity =
      list_intensitiesLogo[baseIntensity] +
      intensityAux[(Math.abs(intensity) % 5) - 1];
  } else {
    const index = list_intensitiesdBLogo.indexOf(intensity);
    intensity = list_intensitiesLogo[index];
  }
  console.log(intensity);
  setVolume(intensity);
}

let count = 0;

function playPause() {
  if (count == 0) {
    console.log("play");
    count = 1;
    audioElement.play();
  } else {
    console.log("pausa");
    count = 0;
    audioElement.pause();
  }
}

function stop() {
  audioElement.pause();
  audioElement.currentTime = 0;
}

function maskLogo() {
  console.log("entro");
  let ele = document.getElementsByName("tipoEnmascaramientoLogo");
  let maskBandaValue;

  // volume
  let intensity = parseInt(
    document.getElementById("logoMaskIntensity").innerHTML
  );
  let maskListIntensitiesdB = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  ];
  let maskListIntensities = [
    -57.5, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -32.5, -30,
    -27.5, -25, -22.5, -20, -17.5, -15, -12.5,
  ];

  let verbalMaskListIntensities = [
    0.015, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65,
    0.7, 0.75, 0.8, 0.85, 0.9, 0.95,
  ];

  let index = maskListIntensitiesdB.indexOf(intensity);

  intensity = maskListIntensities[index];
  verbalIntensity = verbalMaskListIntensities[index];

  noise.volume.value = intensity;

  // Paneo
  let elem = document.getElementsByName("oidoLogo");
  let panValue = "";
  let maskPanValue = "";

  for (i = 0; i < elem.length; i++) {
    if (elem[i].checked) {
      panValue = document.querySelector('input[name="oidoLogo"]:checked').value;
      break;
    } else {
      panValue = 0;
    }
  }

  if (panValue == 1) {
    maskPanValue = -1;
  } else if (panValue == -1) {
    maskPanValue = 1;
  }

  panner.pan.value = maskPanValue;

  // Tipo de ruido de enmascaramiento
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      maskBandaValue = document.querySelector(
        'input[name="tipoEnmascaramientoLogo"]:checked'
      ).value;
      break;
    } else {
      maskBandaValue = 0;
    }
  }

  let maskValue;
  if (
    document.querySelector('input[id="logoaudiometria__enmascarar"]:checked')
  ) {
    maskValue = document.querySelector(
      'input[id="logoaudiometria__enmascarar"]:checked'
    ).value;
    if (maskValue == 1) {
      if (maskBandaValue == 1) {
        noise.connect(panner);
        noise.start();
      } else if (maskBandaValue == -1) {
        // Ruido verbal
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        // Crear un elemento de audio y cargar un archivo de audio
        const audioElement = new Audio("./audios/RuidoVerbal.mp3");
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
        setVolume(verbalIntensity);
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Falta seleccionar el tipo de enmascaramiento!",
        });
      }
    }
  } else {
    noise.stop("0,01");
  }
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
  element.classList.remove("bg-white");
  element.classList.add("bg-" + color);
}

function borrar() {
  if (contTabla >= 0) {
    if (contTabla > 0) {
        contTabla--;
    }
    let tableSpace = "tablaLogo" + contTabla;
    const element = document.getElementById(tableSpace);

    // Elimina las clases de fondo verde y rojo
    element.classList.remove("bg-verde");
    element.classList.remove("bg-rojo");

    // Agrega la clase de fondo blanco
    element.classList.add("bg-white");
  }
}
