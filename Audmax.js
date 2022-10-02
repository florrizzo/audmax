// Tabs general
function openPage(pageName,elmnt,color) {
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

// -------------------------------------------------------------------------------------------------------
// Base de datos de pacientes

class Paciente{
    constructor(nombre, apellido, edad, mail, telefono, patologia) {
        this.nombre = nombre;
		this.apellido = apellido;
        this.edad   = edad;
        this.mail  = mail;
		this.telefono = telefono;
		this.patologia = patologia;
    }
}

let basePacientes = [];

fetch('/pacientes.json')
    .then( (res) => res.json())
    .then( (json) => {
		basePacientes = json;
    })
	.catch( (e) => {
		console.log(e);
	})


function mostrarDatos(base){
	let contenedor = "";
	if (base){
		for (const paciente of base) {
			contenedor +=`<div class="property-card">
									<h3> Nombre: ${paciente.nombre}</h3>
									<h3> Apellido: ${paciente.apellido}</h3>
									<p>  Edad: ${paciente.edad}</p>
									<p>  Mail: ${paciente.mail}</p>
									<p>  Teléfono: ${paciente.telefono}</p>
									<p>  Patología: ${paciente.patologia}</p>
									</div>`;
							
		}
		document.getElementById("Pacientes").innerHTML = contenedor;
		let num = base.length / 3;
		document.querySelector('body').style.height = 100 + num*30 + '%';
	} else {
		document.getElementById("Pacientes").innerHTML = "<p>No se encontraron resultados</p>";
	}	
}

function buscarPaciente(){
	let nombreBuscar = document.getElementById("buscadorPacientes").value;
	nombreBuscar.toLowerCase();
	let pacienteCargado = basePacientes.find(el => el.nombre.toLowerCase() === nombreBuscar);
	if (pacienteCargado){
		let indexBuscar = basePacientes.indexOf(pacienteCargado);
		pacienteCargado = [basePacientes[indexBuscar]];
		mostrarDatos(pacienteCargado);
	} else{
		document.getElementById("Pacientes").innerHTML = "<p>No se encontraron resultados</p>";
	}
}

function nuevoPaciente(){
	let contenedor = `
	<fieldset class="container mt-3 p-4">
		<form name="myForm">
			<div class="containers">			
				<div class="row">
					<div class="col">
						<div class="mb-3">
							<label for="nombre" class="form-label">Nombre</label>
							<input type="input" class="form-control" id="nombre" name="nombre" placeholder="Arya" required>
						</div>
					</div>
					<div class="col">
						<div class="mb-3">
							<label for="apellido" class="form-label">Apellido</label>
							<input type="input" class="form-control" id="apellido" name="apellido" placeholder="Stark" required>
						</div>
					</div>
				</div>

				<div class="row">
					<div class="col">
						<div class="mb-3">
							<label for="edad" class="form-label">Edad</label>
							<input type="input" class="form-control" id="edad" name="edad" placeholder="20">
						</div>
					</div>
					<div class="col">
						<div class="mb-3">
							<label for="telefono" class="form-label">Teléfono</label>
							<input type="input" class="form-control" id="telefono" name="telefono">
						</div>
					</div>
					<div class="col">
						<div class="mb-3">
							<label for="mail" class="form-label">Mail</label>
							<input type="email" class="form-control" id="mail" name="email" placeholder="aryastark@gmail.com" pattern=".+@globex\.com">
						</div>
					</div>
				</div>

				
				<div class="mb-3">
					<label for="patologia" class="form-label">Patología</label>
					<textarea class="form-control" id="patologia" name="patologia" rows="4"></textarea>
				</div>

				<div>
					<button type="submit" onclick="submitPaciente()" class="btn btn-light">Submit</button>
				</div> 
			</div>
		</form>
	</fieldset>
		`
	document.getElementById("Pacientes").innerHTML = contenedor;
}

function sweetAlert(mensaje){
	Swal.fire({
		title: 'Error!',
		text: mensaje,
		icon: 'error',
		confirmButtonText: 'Ok'
	})
	
}

function submitPaciente(){
	let x = document.forms["myForm"]["nombre"].value;
	let y = document.forms["myForm"]["apellido"].value;
	let z = parseInt(document.forms["myForm"]["edad"].value);
	let j = document.forms["myForm"]["telefono"].value;
	let k = document.forms["myForm"]["email"].value;
	let numbers = /^[0-9]+$/;
  	if (x == "") {
    	sweetAlert('El campo "Nombre" debe completarse');
    return false;
	} else if (y == "") {
		sweetAlert('El campo "Apellido" debe completarse');
		return false;
	} else if (isNaN(z)){
		sweetAlert('El campo "Edad" solo debe contener números');
		return false;	
	} else if (!(j.match(numbers))){
		sweetAlert('El campo "Telefono" solo debe contener números');
		return false;
	} else if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)+$/.test(k))){
		sweetAlert('El campo "Email" no coincide con el formato');
		return false;
	} else {
		const pacienteNuevo = new Paciente(document.getElementById("nombre").value, document.getElementById("apellido").value, document.getElementById("edad").value, document.getElementById("mail").value, document.getElementById("telefono").value, document.getElementById("patologia").value);
		basePacientes = [...basePacientes, pacienteNuevo];
		const {nombre} = pacienteNuevo; 
		document.getElementById("textoBaseDeDatos").innerHTML = `<p>Se agrego al paciente ${nombre} a la base de datos<p/>`;
		let mostrarPacienteNuevo = [basePacientes[basePacientes.length-1]];
		mostrarDatos(mostrarPacienteNuevo);
	}
}

// -----------------------------------------------------------------------------
// AUDIOMETRÍA

// create web audio api context
let audioCtx = new(window.AudioContext || window.webkitAudioContext)();

function playNote(duration) {
	let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);

	// volume
	const gainNode = audioCtx.createGain();
	let intensity = parseInt(document.getElementById("audioIntensity").innerHTML);
	if ((intensity % 5) != 0) {
		let intensityAux = [0.0001, 0.0002, 0.0003, 0.0004];
		intensity = list_intensities[list_intensitiesdB.indexOf(Math.ceil(intensity/5)*5 - 5 )] + intensityAux[(intensity % 5)-1];
	} else {
		let index = list_intensitiesdB.indexOf(intensity);
		intensity = list_intensities[index];
	}
	gainNode.gain.value = intensity;

	// panning
	const pannerOptions = {pan: 0};
	const panner = new StereoPannerNode(audioCtx, pannerOptions);
	let ele = document.getElementsByName('oidoAudiometria');
	let panValue = "";
              
	for(i = 0; i < ele.length; i++) {
		// Si lo escribo en ternario no anda (creo que porque uso ":checked")
		// (ele[i].checked) ? panValue = document.querySelector('input[name="oidoAudiometria"]:checked').value: panValue = 0;
		if(ele[i].checked){
			panValue = document.querySelector('input[name="oidoAudiometria"]:checked').value;
			break;
		} else {
			panValue = 0;
		}
	}

	panner.pan.value = panValue;	

 	// create Oscillator node
	let oscillator = audioCtx.createOscillator();

	oscillator.type = 'sine';
	oscillator.frequency.value = frequency; // value in hertz
	oscillator.connect(gainNode).connect(panner).connect(audioCtx.destination);
	oscillator.start();

	setTimeout(
	function() {
	  oscillator.stop();
	
	}, duration);
}

let list_frequencies = [125, 250, 500, 1000, 1500, 2000, 4000, 6000, 8000];
let list_intensitiesdB = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
let list_intensities = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006, 0.007, 0.008, 0.009, 0.01, 0.011, 0.012, 0.013, 0.014, 0.015, 0.016, 0.017, 0.018, 0.019, 0.02, 0.021, 0.022];

function changeFrequencyn1(){
	let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
	// Encontrar indice en frecuencies
	index = list_frequencies.indexOf(frequency);
	// Subir o bajar el indice si no estoy en los extremo
	(frequency >126) ? frequency = list_frequencies[index-1] : frequency = frequency;
	// Devolver valor del indice
	document.getElementById("audioFrequency").innerHTML = frequency;
}

function changeFrequencyp1(){
	let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
	// Encontrar indice en frecuencies
	index = list_frequencies.indexOf(frequency);
	// Subir o bajar el indice si no estoy en los extremo
	(frequency < 7500) ? frequency = list_frequencies[index+1] : frequency = frequency;
	// Devolver valor del indice
	document.getElementById("audioFrequency").innerHTML = frequency;
}

function changeIntensityn1(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremos
	(intensity > -10) ? intensity -- : intensity = intensity;
	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp1(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	(intensity < 95) ? intensity++ : intensity = intensity;
	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp5(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	if (intensity < 95){
		(intensity % 5) != 0 ? intensity = Math.ceil(intensity/5)*5 : intensity += 5;
	}
	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityn5(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	if (intensity > -10){
		(intensity % 5) != 0 ? intensity = Math.ceil(intensity/5)*5 - 5: intensity -= 5;
	}
	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

const noise = new Tone.Noise("pink");
let panner = new Tone.Panner();
panner.toDestination();

function mask(){
	let ele = document.getElementsByName('tipoEnmascaramiento');
	let maskBandaValue;

	// volume	
	let intensity = parseInt(document.getElementById("maskIntensity").innerHTML);
	let maskListIntensitiesdB = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95];
	let maskListIntensities = [-65, -62.5, -60, -57.5, -55, -52.5, -50, -47.5, -45, -42.5, -40, -37.5, -35, -32.5, -30, -27.5, -25, -22.5, -20, -17.5, -15, -12.5];

	let index = maskListIntensitiesdB.indexOf(intensity);
	intensity = maskListIntensities[index];
	noise.volume.value = intensity;

	// Paneo
	let elem = document.getElementsByName('oidoAudiometria');
	let panValue = "";
	let maskPanValue = "";
              
	for(i = 0; i < elem.length; i++) {
		if(elem[i].checked){
			panValue = document.querySelector('input[name="oidoAudiometria"]:checked').value;
			break;
		} else {
			panValue = 0;
		}
	}
	
	if (panValue == 1){
		maskPanValue = -1;
	} else if (panValue == -1){
		maskPanValue = 1;
	}

	panner.pan.value = maskPanValue;	

    // Tipo de ruido de enmascaramiento   
	for(i = 0; i < ele.length; i++) {
		if(ele[i].checked){
			maskBandaValue = document.querySelector('input[name="tipoEnmascaramiento"]:checked').value;
			break;
		} else {
			maskBandaValue = 0;
		}
	}

	let maskValue; 
	if(document.querySelector('input[id="audiometria__enmascarar"]:checked')){
		maskValue = document.querySelector('input[id="audiometria__enmascarar"]:checked').value;
		if (maskValue == 1){
			if (maskBandaValue == 1){
				noise.type = "white";
				noise.connect(panner);
				noise.start();
			}else if (maskBandaValue == -1){	
				noise.type = "pink";
				noise.connect(panner);			
				noise.start();			
			} else {
				sweetAlert('Debe seleccionar un tipo de enmascaramiento');
			}
		}		
	} else {
		noise.stop("0,01");
	};
}

let Tabla = [{freq: 125, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 250, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 500, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 1000, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 1500, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 2000, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 4000, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 6000, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
	{freq: 8000, oidoDerecho: "", oidoIzquierdo: "", enmDerecho: "", enmIzquierdo: ""},
]

function cargar(){
	Tabla = JSON.parse(localStorage.getItem("TablaAudiometria"));
	for (let i = 0; i < 9; i++){
		try {
			document.getElementById("Der"+list_frequencies[i]).innerHTML = Tabla[i].oidoDerecho;
			document.getElementById("Der"+list_frequencies[i]+"Ver").innerHTML = Tabla[i].oidoDerecho;
		} catch(error){}
		try {
			document.getElementById("Izq"+list_frequencies[i]).innerHTML = Tabla[i].oidoIzquierdo;
			document.getElementById("Izq"+list_frequencies[i]+"Ver").innerHTML = Tabla[i].oidoIzquierdo;
		} catch(error){}
		try {
			document.getElementById("EnmDer"+list_frequencies[i]).innerHTML = Tabla[i].enmDerecho;
			document.getElementById("EnmDer"+list_frequencies[i]+"Ver").innerHTML = Tabla[i].enmDerecho;
		} catch(error){}
		try {
			document.getElementById("EnmIzq"+list_frequencies[i]).innerHTML = Tabla[i].enmIzquierdo;
			document.getElementById("EnmIzq"+list_frequencies[i]+"Ver").innerHTML = Tabla[i].enmIzquierdo;
		} catch(error){}
	}
}

function umbralAudiometria(){
	let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
	let intensity = parseInt(document.getElementById("audioIntensity").innerHTML);
	let maskIntensity = parseInt(document.getElementById("maskIntensity").innerHTML);
	let ele = document.getElementsByName('oidoAudiometria');
	let panValue = "";
              
	for(i = 0; i < ele.length; i++) {
		if(ele[i].checked){
			panValue = document.querySelector('input[name="oidoAudiometria"]:checked').value;
			break;
		} else {
			panValue = 0;
		}
	}

	let id = "";
	let oido = "";
	if (panValue == 1){
		oido = "Der"
		id = oido + frequency;
		document.getElementById(id).innerHTML = intensity;
		document.getElementById(id+"Ver").innerHTML = intensity;	
	} else if (panValue == -1){
		oido = "Izq";
		id = oido + frequency;
		document.getElementById(id).innerHTML = intensity;
		document.getElementById(id+"Ver").innerHTML = intensity;	
	} else{
		oido = "Der"
		id = oido + frequency;
		document.getElementById(id).innerHTML = intensity;
		document.getElementById(id+"Ver").innerHTML = intensity;
		oido = "Izq"
		id = oido + frequency;
		document.getElementById(id).innerHTML = intensity;
		document.getElementById(id+"Ver").innerHTML = intensity;		
	}

	let enmascarar = "";
	try {
		enmascarar = document.querySelector('#audiometria__enmascarar:checked').value;
	} catch (error) {
		enmascarar = 0;
	}

	if (enmascarar  == 1){
		if (panValue == 1){
			oido = "Izq";
			id = "Enm" + oido + frequency;
			document.getElementById(id).innerHTML = maskIntensity;
			document.getElementById(id+"Ver").innerHTML = maskIntensity;
			
		}else if (panValue == -1){
			oido = "Der";
			id = "Enm" + oido + frequency;
			document.getElementById(id).innerHTML = maskIntensity;
			document.getElementById(id+"Ver").innerHTML = maskIntensity;
			
		}else {
			oido = "Izq";
			id = "Enm" + oido + frequency;
			document.getElementById(id).innerHTML = maskIntensity;
			document.getElementById(id+"Ver").innerHTML = maskIntensity;
			oido = "Der";
			id = "Enm" + oido + frequency;
			document.getElementById(id).innerHTML = maskIntensity;
			document.getElementById(id+"Ver").innerHTML = maskIntensity;
		}
	} else {
		oido = "Izq";
		id = "Enm" + oido + frequency;
		document.getElementById(id).innerHTML = 0;
		document.getElementById(id+"Ver").innerHTML = 0;
		oido = "Der";
		id = "Enm" + oido + frequency;
		document.getElementById(id).innerHTML = 0;
		document.getElementById(id+"Ver").innerHTML = 0;
	}
}


// Graficar
let myChart;

function graphic(){
	if (myChart) {
        myChart.destroy();
    }
	const data = {
		labels: ['125', '250', '500', '1000', '1500', '2000', '4000', '6000', '8000'],
		datasets: [{
			label: 'Audiograma Oído Derecho',
			backgroundColor: 'rgb(230, 17, 2)',
			borderColor: 'rgb(230, 17, 2)',
			data: [document.getElementById("Der125").innerHTML, 
			document.getElementById("Der125").innerHTML,
			document.getElementById("Der250").innerHTML,
			document.getElementById("Der500").innerHTML,
			document.getElementById("Der1000").innerHTML,
			document.getElementById("Der1500").innerHTML,
			document.getElementById("Der2000").innerHTML,
			document.getElementById("Der4000").innerHTML,
			document.getElementById("Der6000").innerHTML,
			document.getElementById("Der8000").innerHTML],
		},
		{
			label: 'Audiograma Oído izquierdo',
			backgroundColor: 'rgb(51, 61, 235)',
			borderColor: 'rgb(51, 61, 235)',
			data: [document.getElementById("Izq125").innerHTML, 
			document.getElementById("Izq125").innerHTML,
			document.getElementById("Izq250").innerHTML,
			document.getElementById("Izq500").innerHTML,
			document.getElementById("Izq1000").innerHTML,
			document.getElementById("Izq1500").innerHTML,
			document.getElementById("Izq2000").innerHTML,
			document.getElementById("Izq4000").innerHTML,
			document.getElementById("Izq6000").innerHTML,
			document.getElementById("Izq8000").innerHTML],
		},
		{
			label: 'Enmascaramiento izquierdo',
			backgroundColor: 'rgb(23, 232, 0)',
			borderColor: 'rgb(23, 232, 0)',
			data: [document.getElementById("EnmIzq125").innerHTML, 
			document.getElementById("EnmIzq250").innerHTML,
			document.getElementById("EnmIzq500").innerHTML,
			document.getElementById("EnmIzq1000").innerHTML,
			document.getElementById("EnmIzq1500").innerHTML,
			document.getElementById("EnmIzq2000").innerHTML,
			document.getElementById("EnmIzq4000").innerHTML,
			document.getElementById("EnmIzq6000").innerHTML,
			document.getElementById("EnmIzq8000").innerHTML],
		},
		{
			label: 'Enmascaramiento Derecho',
			backgroundColor: 'rgb(250, 250, 7)',
			borderColor: 'rgb(250, 250, 7)',
			data: [document.getElementById("EnmDer125").innerHTML, 
			document.getElementById("EnmDer250").innerHTML,
			document.getElementById("EnmDer500").innerHTML,
			document.getElementById("EnmDer1000").innerHTML,
			document.getElementById("EnmDer1500").innerHTML,
			document.getElementById("EnmDer2000").innerHTML,
			document.getElementById("EnmDer4000").innerHTML,
			document.getElementById("EnmDer6000").innerHTML,
			document.getElementById("EnmDer8000").innerHTML],
		}]
	};
	
	const config = {
		type: 'line',
		data: data,
		options: {
			scales: {
				y: {
					max: 95,
					min: -10,
					ticks: {
						stepSize: 5
					}
				}
		}}
	};
	  
	myChart = new Chart(
		document.getElementById('myChart'),
		config
	);
}


// Guardar

function guardar(){
	for (let i = 0; i < 9; i++){
		try {
			Tabla[i].oidoDerecho = document.getElementById("Der"+list_frequencies[i]).innerHTML;
		} catch(error){}
		try {
			Tabla[i].oidoIzquierdo = document.getElementById("Izq"+list_frequencies[i]).innerHTML;
		} catch(error){}
		try {
			Tabla[i].enmDerecho = document.getElementById("EnmDer"+list_frequencies[i]).innerHTML;
		} catch(error){}
		try {
			Tabla[i].enmIzquierdo = document.getElementById("EnmIzq"+list_frequencies[i]).innerHTML;
		} catch(error){}
	}
	saveStorage();	
}

function saveStorage(){
	const TablaJSON= JSON.stringify(Tabla);
	localStorage.setItem('TablaAudiometria', TablaJSON);
	console.log(TablaJSON)
}


// -------------------------------------------------------------------------------------------
// LOGOAUDIOMETRÍA

let logoaudio = "";

function music(audio){
	logoaudio = new Audio(audio);
}


