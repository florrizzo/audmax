// AUDIOMETRÍA

// create web audio api context
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let list_frequencies = [
  125, 250, 500, 1000, 1500, 2000, 3000, 4000, 6000, 8000,
];
let offsetdBHL = [30.5, 18, 11, 5.5, 5.5, 4.5, 2.5, 9.5, 17, 17.5];


function getTableValues(querySelector) {
  const inputs = document.querySelectorAll(querySelector);
  const values = [];

  inputs.forEach((input) => {
    const parsedValue = parseFloat(input.value);
    if (isNaN(parsedValue)) {
      values.push(0);
    } else {
      values.push(parsedValue);
    }
  });
  return values;
}

let isPlaying = false;

async function playAPI() {
  console.log(isPlaying)
  if (isPlaying) return; // Si ya está reproduciendo, no hacer nada
  isPlaying = true;
  const indicador = document.getElementById('indicadorAudio');
  indicador.classList.add('activo');
  try {
    const frequency = parseInt(
      document.getElementById("audioFrequency").innerHTML
    );
    let intensity = parseInt(
      document.getElementById("audioIntensity").innerHTML
    );
    const canal = getSelectedValue("oidoAudiometria");
    const typeSignal = getSelectedValue("tipoSignal");

    //Conversion a SPL
    const indexFrequency = list_frequencies.indexOf(frequency);
    intensity += offsetdBHL[indexFrequency];
    offsetMedicion = [5, 5, 5, 5, 5, 0, 0, 5, 5, 5];
    intensity += offsetMedicion[indexFrequency];

    //Curva calibracion
    let calib;
    const calibL = getTableValues('.calibL');
    const calibR = getTableValues('.calibR');
    if (canal === "izquierda"){
      calib = calibL
    } else {
      calib = calibR
    }
    intensity += calib[indexFrequency];

    // Realizar una solicitud GET al servicio FastAPI
    const response = await fetch(
      `http://localhost:9000/generar-tono/${frequency}/${intensity}/izquierda/${typeSignal}`
    );
    const audioBlob = await response.blob();

    // Crear un objeto URL para el audio
    const audioUrl = URL.createObjectURL(audioBlob);

    // Crear un elemento de audio y reproducirlo
    const audioElement = new Audio(audioUrl);
    audioElement.play();
    // isPlaying = false;
    audioElement.onended = function() {
      isPlaying = false;
      indicador.classList.remove('activo');
  }();

  } catch (error) {
    console.error("Error al reproducir el audio:", error);
    isPlaying = false;
  }
}

function changeFrequencyn1() {
  let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
  // Encontrar indice en frecuencies
  index = list_frequencies.indexOf(frequency);
  // Subir o bajar el indice si no estoy en los extremo
  frequency > 126
    ? (frequency = list_frequencies[index - 1])
    : (frequency = frequency);
  // Devolver valor del indice
  document.getElementById("audioFrequency").innerHTML = frequency;
}

function changeFrequencyp1() {
  let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
  // Encontrar indice en frecuencies
  index = list_frequencies.indexOf(frequency);
  // Subir o bajar el indice si no estoy en los extremo
  frequency < 7500
    ? (frequency = list_frequencies[index + 1])
    : (frequency = frequency);
  // Devolver valor del indice
  document.getElementById("audioFrequency").innerHTML = frequency;
}

document.addEventListener('keydown', function(event) {
  switch(event.code) {
    case 'Space':
      event.preventDefault();
      playAPI();
      break;
    case 'Enter':
      event.preventDefault();
      umbralAudiometria();
      break;
    case 'ArrowRight':
      event.preventDefault();
      changeFrequencyp1();
      break;
    case 'ArrowLeft':
      event.preventDefault();
      changeFrequencyn1();
      break;
    case 'ArrowUp':
      event.preventDefault();
      changeIntensityp5('audioIntensity');
      break;
    case 'ArrowDown':
      event.preventDefault();
      changeIntensityn5('audioIntensity', 'audio');
      break;
  }
});



const noise = new Tone.Noise("white");
let panner = new Tone.Panner();
panner.toDestination();

function mask() {
  let ele = document.getElementsByName("tipoEnmascaramiento");
  let maskBandaValue;

  // volume
  let intensity = parseInt(document.getElementById("maskIntensity").innerHTML);
  let maskListIntensitiesdB = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
  ];
  let maskListIntensities = [
    -57.5, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -32.5, -30,
    -27.5, -25, -22.5, -20, -17.5, -15, -12.5,
  ];

  let index = maskListIntensitiesdB.indexOf(intensity);
  intensity = maskListIntensities[index];
  noise.volume.value = intensity;

  // Paneo
  let elem = document.getElementsByName("oidoAudiometria");
  let panValue = "";
  let maskPanValue = "";

  for (i = 0; i < elem.length; i++) {
    if (elem[i].checked) {
      panValue = document.querySelector(
        'input[name="oidoAudiometria"]:checked'
      ).value;
      break;
    } else {
      panValue = 0;
    }
  }

  if (panValue == "izquierda") {
    maskPanValue = 1;
  } else if (panValue == "derecha") {
    maskPanValue = -1;
  }

  panner.pan.value = maskPanValue;

  // Tipo de ruido de enmascaramiento
  for (i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      maskBandaValue = document.querySelector(
        'input[name="tipoEnmascaramiento"]:checked'
      ).value;
      break;
    } else {
      maskBandaValue = 0;
    }
  }

  let maskValue;
  if (document.querySelector('input[id="audiometria__enmascarar"]:checked')) {
    maskValue = document.querySelector(
      'input[id="audiometria__enmascarar"]:checked'
    ).value;
    if (maskValue == 1) {
      if (maskBandaValue == 1) {
        noise.connect(panner);
        noise.start();
      } else if (maskBandaValue == -1) {
        // Crear un filtro pasa altos de Tone.js
        const highpassFilter = new Tone.Filter({
          type: "highpass",
          rolloff: -12,
          frequency: 1300,
        });

        // Crear un filtro pasa bajos de Tone.js
        const lowpassFilter = new Tone.Filter({
          type: "lowpass",
          rolloff: -12,
          frequency: 1300,
        });

        // Conectar el ruido blanco al filtro pasa altos y luego al filtro pasa bajos
        noise.connect(highpassFilter);
        highpassFilter.connect(lowpassFilter);

        // Conectar el filtro pasa bajos al destino de audio
        lowpassFilter.connect(panner).toDestination();

        // Obtener la frecuencia central seleccionada
        let freqValue = parseInt(
          document.getElementById("audioFrequency").innerHTML
        );

        // Definir las frecuencias de corte inferiores y superiores según la tabla
        let frequencies = {
          125: { lower: 107, upper: 143 },
          250: { lower: 215, upper: 285 },
          500: { lower: 430, upper: 570 },
          750: { lower: 645, upper: 855 },
          1000: { lower: 860, upper: 1140 },
          1500: { lower: 1290, upper: 1710 },
          2000: { lower: 1720, upper: 2280 },
          3000: { lower: 2580, upper: 3420 },
          4000: { lower: 3440, upper: 4560 },
          6000: { lower: 5160, upper: 6840 },
          8000: { lower: 6880, upper: 9120 },
        };
        // Verificar si la frecuencia central está en la tabla
        if (frequencies[freqValue]) {
          // Ajustar las frecuencias de corte de los filtros según la tabla
          highpassFilter.frequency.value = frequencies[freqValue].lower;
          lowpassFilter.frequency.value = frequencies[freqValue].upper;

          // Iniciar la reproducción del ruido blanco con Tone.js
          noise.connect(panner);
          noise.start();
        } else {
          sweetAlert("Frecuencia central no válida");
        }
      } else {
        sweetAlert("Debe seleccionar un tipo de enmascaramiento");
      }
    }
  } else {
    noise.stop("0,01");
  }
}

let Tabla = [
  {
    freq: 125,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 250,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 500,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 1000,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 1500,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 2000,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 4000,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 6000,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
  {
    freq: 8000,
    oidoDerecho: "",
    oidoIzquierdo: "",
    enmDerecho: "",
    enmIzquierdo: "",
  },
];

// function cargar() {
//   Tabla = JSON.parse(localStorage.getItem("TablaAudiometria"));
//   for (let i = 0; i < 9; i++) {
//     try {
//       document.getElementById("Der" + list_frequencies[i]).innerHTML =
//         Tabla[i].oidoDerecho;
//       document.getElementById("Der" + list_frequencies[i] + "Ver").innerHTML =
//         Tabla[i].oidoDerecho;
//     } catch (error) {}
//     try {
//       document.getElementById("Izq" + list_frequencies[i]).innerHTML =
//         Tabla[i].oidoIzquierdo;
//       document.getElementById("Izq" + list_frequencies[i] + "Ver").innerHTML =
//         Tabla[i].oidoIzquierdo;
//     } catch (error) {}
//     try {
//       document.getElementById("EnmDer" + list_frequencies[i]).innerHTML =
//         Tabla[i].enmDerecho;
//       document.getElementById(
//         "EnmDer" + list_frequencies[i] + "Ver"
//       ).innerHTML = Tabla[i].enmDerecho;
//     } catch (error) {}
//     try {
//       document.getElementById("EnmIzq" + list_frequencies[i]).innerHTML =
//         Tabla[i].enmIzquierdo;
//       document.getElementById(
//         "EnmIzq" + list_frequencies[i] + "Ver"
//       ).innerHTML = Tabla[i].enmIzquierdo;
//     } catch (error) {}
//   }
// }

function umbralAudiometria() {
  const frequency = parseInt(
    document.getElementById("audioFrequency").innerHTML
  );
  const intensity = parseInt(
    document.getElementById("audioIntensity").innerHTML
  );
  const maskIntensity = parseInt(
    document.getElementById("maskIntensity").innerHTML
  );
  let panValue = getSelectedValue("oidoAudiometria");

  let enmascarar = "";
  try {
    enmascarar = document.querySelector(
      "#audiometria__enmascarar:checked"
    ).value;
  } catch (error) {
    enmascarar = 0;
  }

  const oidos = ["izquierda", "derecha"];
  const oidosText = ["Izq", "Der"];
  console.log(panValue)
  for (let i = 0; i < oidos.length; i++) {
    // const oido = oidos[i];
    const oidoText = oidosText[i];
    const id = oidoText + frequency;
    if (panValue == oidos[i]) {
      setIntensityAndVer(intensity, id);
      if (intensity === 100) {
        const swalWithBootstrapButtons = Swal.mixin({
          customClass: {
            confirmButton: "btn btn-success",
            cancelButton: "btn btn-danger",
          },
          buttonsStyling: false,
        });

        swalWithBootstrapButtons
          .fire({
            title: "El paciente percibió el tono?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
            reverseButtons: true,
          })
          .then((result) => {
            if (result.dismiss === Swal.DismissReason.cancel) {
              setIntensityAndVer("100 - N", id);
            }
          });
      }
      if (i == 0) {
        aux = 1;
      } else if (i == 1) {
        aux = 0;
      }
      if (enmascarar == 1) {
        setIntensityAndVer(maskIntensity, "Enm" + oidosText[aux] + frequency);
      }
    } 
  }
}

function getSelectedValue(name) {
  const elements = document.getElementsByName(name);
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].checked) {
      return elements[i].value;
    }
  }
  return 0;
}

function setIntensityAndVer(intensity, id) {
  document.getElementById(id).innerHTML = intensity;
  document.getElementById(id + "Ver").innerHTML = intensity;
}

// Graficar
let myChart;

function graphic() {
  if (myChart) {
    myChart.destroy();
  }
  const data = {
    labels: [
      "125",
      "250",
      "500",
      "1000",
      "1500",
      "2000",
      "4000",
      "6000",
      "8000",
    ],
    datasets: [
      {
        label: "Audiograma Oído Derecho",
        backgroundColor: "rgb(230, 17, 2)",
        borderColor: "rgb(230, 17, 2)",
        data: [
          document.getElementById("Der125").innerHTML,
          document.getElementById("Der125").innerHTML,
          document.getElementById("Der250").innerHTML,
          document.getElementById("Der500").innerHTML,
          document.getElementById("Der1000").innerHTML,
          document.getElementById("Der1500").innerHTML,
          document.getElementById("Der2000").innerHTML,
          document.getElementById("Der4000").innerHTML,
          document.getElementById("Der6000").innerHTML,
          document.getElementById("Der8000").innerHTML,
        ],
      },
      {
        label: "Audiograma Oído izquierdo",
        backgroundColor: "rgb(51, 61, 235)",
        borderColor: "rgb(51, 61, 235)",
        data: [
          document.getElementById("Izq125").innerHTML,
          document.getElementById("Izq125").innerHTML,
          document.getElementById("Izq250").innerHTML,
          document.getElementById("Izq500").innerHTML,
          document.getElementById("Izq1000").innerHTML,
          document.getElementById("Izq1500").innerHTML,
          document.getElementById("Izq2000").innerHTML,
          document.getElementById("Izq4000").innerHTML,
          document.getElementById("Izq6000").innerHTML,
          document.getElementById("Izq8000").innerHTML,
        ],
      },
      {
        label: "Enmascaramiento izquierdo",
        backgroundColor: "rgb(23, 232, 0)",
        borderColor: "rgb(23, 232, 0)",
        data: [
          document.getElementById("EnmIzq125").innerHTML,
          document.getElementById("EnmIzq250").innerHTML,
          document.getElementById("EnmIzq500").innerHTML,
          document.getElementById("EnmIzq1000").innerHTML,
          document.getElementById("EnmIzq1500").innerHTML,
          document.getElementById("EnmIzq2000").innerHTML,
          document.getElementById("EnmIzq4000").innerHTML,
          document.getElementById("EnmIzq6000").innerHTML,
          document.getElementById("EnmIzq8000").innerHTML,
        ],
      },
      {
        label: "Enmascaramiento Derecho",
        backgroundColor: "rgb(250, 250, 7)",
        borderColor: "rgb(250, 250, 7)",
        data: [
          document.getElementById("EnmDer125").innerHTML,
          document.getElementById("EnmDer250").innerHTML,
          document.getElementById("EnmDer500").innerHTML,
          document.getElementById("EnmDer1000").innerHTML,
          document.getElementById("EnmDer1500").innerHTML,
          document.getElementById("EnmDer2000").innerHTML,
          document.getElementById("EnmDer4000").innerHTML,
          document.getElementById("EnmDer6000").innerHTML,
          document.getElementById("EnmDer8000").innerHTML,
        ],
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {
      scales: {
        y: {
          max: 95,
          min: -10,
          ticks: {
            stepSize: 5,
          },
        },
      },
    },
  };

  myChart = new Chart(document.getElementById("myChart"), config);
}

// Guardar

function guardar() {
  // Obtener los valores de nombre, apellido y edad
  const nombre = document.getElementById("nombre").value;
  const apellido = document.getElementById("apellido").value;
  let edad = document.getElementById("edad").value;
  edad = isNaN(parseInt(edad)) ? null : parseInt(edad);

  // Crear los objetos de audiometría y logoaudiometría
  let audiometria = {
    oido_derecho: {},
    oido_izquierdo: {},
    enm_derecho: {},
    enm_izquierdo: {}
  };

  for (let i = 0; i < list_frequencies.length; i++) {
    const freq = list_frequencies[i];
    audiometria.oido_derecho[freq + "Hz"] = document.getElementById("Der" + freq).innerHTML || null;
    audiometria.oido_izquierdo[freq + "Hz"] = document.getElementById("Izq" + freq).innerHTML || null;
    audiometria.enm_derecho[freq + "Hz"] = document.getElementById("EnmDer" + freq).innerHTML || null;
    audiometria.enm_izquierdo[freq + "Hz"] = document.getElementById("EnmIzq" + freq).innerHTML || null;
  }

  // Crear el objeto para enviar a la API
  const data = {
    nombre: nombre,
    apellido: apellido,
    edad: edad,
    audiometria: audiometria,
    logoaudiometria: {}  // Suponiendo que este objeto se llena en otra parte del código
  };

  // Enviar los datos a la API
  console.log(data)
  fetch("http://127.0.0.1:9000/guardar_estudio", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log("Success:", data);
    Swal.fire({
      title: '¡Éxito!',
      text: 'Datos guardados con éxito',
      icon: 'success',
      confirmButtonText: 'OK'
    })
  })
  .catch((error) => {
    console.error("Error:", error);
    Swal.fire({
      title: 'Error',
      text: 'Hubo un error al guardar los datos',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  });
}

