// AUDIOMETRÍA

// create web audio api context
let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let list_frequencies = [125, 250, 500, 1000, 1500, 2000, 4000, 6000, 8000];
let list_intensitiesdB = [
  -10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
  90, 95,
];
let list_intensities = [
  0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, 0.011,
  0.012, 0.013, 0.014, 0.015, 0.016, 0.017, 0.018, 0.019, 0.02, 0.021, 0.022,
];

function playNote(duration) {
  const frequency = parseInt(
    document.getElementById("audioFrequency").innerHTML
  );
  const typeSignal = getSelectedValue("tipoSignal");

  const gainNode = audioCtx.createGain();
  let intensity = parseInt(document.getElementById("audioIntensity").innerHTML);

  // Manejar la intensidad
  if (intensity % 5 !== 0) {
    const intensityAux = [0.0001, 0.0002, 0.0003, 0.0004];
    const baseIntensity = list_intensitiesdB.indexOf(
      Math.ceil(intensity / 5) * 5 - 5
    );
    intensity =
      list_intensities[baseIntensity] + intensityAux[(Math.abs(intensity) % 5) - 1];
  } else {
    const index = list_intensitiesdB.indexOf(intensity);
    intensity = list_intensities[index];
  }
  gainNode.gain.value = intensity;

  // Manejar el panning
  const panValue = getSelectedValue("oidoAudiometria");
  const panner = new StereoPannerNode(audioCtx, { pan: panValue });

  // Crear el Oscillator node
  const oscillator = audioCtx.createOscillator();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;

  // Conectar nodos
  oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination);

  let isTonePlaying = false;

  oscillator.onended = function() {
    isTonePlaying = false;
  };

  if (typeSignal === "manual") {
    document.getElementById("reproducirTono").addEventListener("mousedown", function() {
      if (!isTonePlaying) {
        isTonePlaying = true;
        gainNode.gain.value = intensity;
        oscillator.start();
      }
    });

    document.getElementById("reproducirTono").addEventListener("mouseup", function() {
      if (isTonePlaying) {
        oscillator.stop();
      }
    });
  } else if (typeSignal === "pulsada") {
    // Reproducir la señal intermitente
    let isToneOn = true;

    oscillator.start();

    // Función para alternar la señal entre tono y silencio
    function toggleTone() {
      if (isToneOn) {
        gainNode.gain.value = 0;
      } else {
        gainNode.gain.value = intensity;
      }
      isToneOn = !isToneOn;
      setTimeout(toggleTone, 500);
    }

    toggleTone();

    setTimeout(function () {
      oscillator.stop();
      gainNode.gain.value = 0; // Apagar el tono al detenerse
    }, duration);
  } else if (typeSignal === "continua") {
    // Reproducir la señal continua
    oscillator.start();

    setTimeout(function () {
      oscillator.stop();
    }, duration);
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
        lowpassFilter.toDestination();

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

function cargar() {
  Tabla = JSON.parse(localStorage.getItem("TablaAudiometria"));
  for (let i = 0; i < 9; i++) {
    try {
      document.getElementById("Der" + list_frequencies[i]).innerHTML =
        Tabla[i].oidoDerecho;
      document.getElementById("Der" + list_frequencies[i] + "Ver").innerHTML =
        Tabla[i].oidoDerecho;
    } catch (error) {}
    try {
      document.getElementById("Izq" + list_frequencies[i]).innerHTML =
        Tabla[i].oidoIzquierdo;
      document.getElementById("Izq" + list_frequencies[i] + "Ver").innerHTML =
        Tabla[i].oidoIzquierdo;
    } catch (error) {}
    try {
      document.getElementById("EnmDer" + list_frequencies[i]).innerHTML =
        Tabla[i].enmDerecho;
      document.getElementById(
        "EnmDer" + list_frequencies[i] + "Ver"
      ).innerHTML = Tabla[i].enmDerecho;
    } catch (error) {}
    try {
      document.getElementById("EnmIzq" + list_frequencies[i]).innerHTML =
        Tabla[i].enmIzquierdo;
      document.getElementById(
        "EnmIzq" + list_frequencies[i] + "Ver"
      ).innerHTML = Tabla[i].enmIzquierdo;
    } catch (error) {}
  }
}

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

  const oidos = [-1, 1];
  const oidosText = ["Izq", "Der"];

  for (let i = 0; i < oidos.length; i++) {
    const oido = oidos[i];
    const oidoText = oidosText[i];
    const id = oidoText + frequency;
    if (panValue == oidos[i]) {
      setIntensityAndVer(intensity, id);
      if (intensity === 95) {
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
              setIntensityAndVer("95 - N", id);
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
      } else {
        setIntensityAndVer(0, "Enm" + oidoText + frequency);
      }
    } else {
      setIntensityAndVer(0, id);
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
  for (let i = 0; i < 9; i++) {
    try {
      Tabla[i].oidoDerecho = document.getElementById(
        "Der" + list_frequencies[i]
      ).innerHTML;
    } catch (error) {}
    try {
      Tabla[i].oidoIzquierdo = document.getElementById(
        "Izq" + list_frequencies[i]
      ).innerHTML;
    } catch (error) {}
    try {
      Tabla[i].enmDerecho = document.getElementById(
        "EnmDer" + list_frequencies[i]
      ).innerHTML;
    } catch (error) {}
    try {
      Tabla[i].enmIzquierdo = document.getElementById(
        "EnmIzq" + list_frequencies[i]
      ).innerHTML;
    } catch (error) {}
  }
  saveStorage();
}

function saveStorage() {
  const TablaJSON = JSON.stringify(Tabla);
  localStorage.setItem("TablaAudiometria", TablaJSON);
  console.log(TablaJSON);
}
