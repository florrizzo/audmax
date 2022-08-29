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
    constructor(nombre, edad, mail, telefono, patologia) {
        this.nombre = nombre;
        this.edad   = edad;
        this.mail  = mail;
		this.telefono = telefono;
		this.patologia = patologia;
    }
	mostrarDatos(){
		console.log("Nombre: " + this.nombre + ", Edad: " + this.edad + ", Mail: " + this.mail + ", Teléfono: " + this.telefono + ", Patología: " + this.patologia);
	}
}

let basePacientes = JSON.parse(localStorage.getItem("basePacientes"));

if (basePacientes == null){
	const paciente1 = new Paciente("Hermione", 28, "hermionegranger@gmail.com", 1123344553, "No");
	const paciente2 = new Paciente("Ron", 29, "ronweasly@gmail.com", 1154323678, "Hipoacusia leve en oído izquierdo");
	const paciente3 = new Paciente("Harry", 27, "harrypotter@gmail.com", 1190473250, "Tinnitus en octava de 8000 Hz");

	basePacientes = [paciente1, paciente2, paciente3];
}

function mostrarDatos(base){
	let contenedor = "";
	if (base){
		for (const paciente of base) {
			contenedor = contenedor + `<div class="property-card">
									<h3> Nombre: ${paciente.nombre}</h3>
									<p>  Edad: ${paciente.edad}</p>
									<p>  Mail: ${paciente.mail}</p>
									<p>  Teléfono: ${paciente.telefono}</p>
									<p>  Patología: ${paciente.patologia}</p>
									</div>`;
							
		}
		document.getElementById("Pacientes").innerHTML = contenedor;
	} else {
		document.getElementById("Pacientes").innerHTML = "<p>No se encontraron resultados</p>";
	}	
}

function buscarPaciente(){
	let nombreBuscar = document.getElementById("buscadorPacientes").value;
	let pacienteCargado = basePacientes.find(el => el.nombre === nombreBuscar);
	if (pacienteCargado){
		let indexBuscar = basePacientes.indexOf(pacienteCargado);
		pacienteCargado = [basePacientes[indexBuscar]];
		mostrarDatos(pacienteCargado);
	} else{
		document.getElementById("Pacientes").innerHTML = "<p>No se encontraron resultados</p>";
	}
}

function nuevoPaciente(){
	let contenedor = `<div>
			<label for="nombre">Nombre:</label>
			<input id="nombre" type="text">
			</div>
			<div>
				<label for="edad">Edad:</label>
				<input id="edad" type="text">
			</div>
			<div>
				<label for="mail">Mail:</label>
				<input id="mail" type="text">
			</div>
			<div>
				<label for="telefono">Teléfono:</label>
				<input id="telefono" type="text">
			</div>
			<div>
				<label for="patologia">Patología:</label>
				<input id="patologia" type="text">
			</div>
			<button onclick="submitPaciente()">Submit</button>`
	document.getElementById("Pacientes").innerHTML = contenedor;
}

function submitPaciente(){
	let nombre = document.getElementById("nombre").value;
	let edad = document.getElementById("edad").value;
	let mail = document.getElementById("mail").value;
	let telefono = document.getElementById("telefono").value;
	let patologia = document.getElementById("patologia").value;

	const pacienteNuevo = new Paciente(nombre, edad, mail, telefono, patologia);
	basePacientes.push(pacienteNuevo);
	let mostrarPacienteNuevo = [basePacientes[basePacientes.length-1]];
	mostrarDatos(mostrarPacienteNuevo);
	saveStorage();
}

function saveStorage(){
	const basePacientesJSON= JSON.stringify(basePacientes);
	localStorage.setItem('basePacientes', basePacientesJSON);
}

saveStorage();

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
	if (frequency >126){
		frequency = list_frequencies[index-1];
	}
	// Devolver valor del indice
	document.getElementById("audioFrequency").innerHTML = frequency;
}

function changeFrequencyp1(){
	let frequency = parseInt(document.getElementById("audioFrequency").innerHTML);
	// Encontrar indice en frecuencies
	index = list_frequencies.indexOf(frequency);
	// Subir o bajar el indice si no estoy en los extremo
	if (frequency < 7500){
		frequency = list_frequencies[index+1];
	}
	// Devolver valor del indice
	document.getElementById("audioFrequency").innerHTML = frequency;
}

function changeIntensityn1(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremos
	if (intensity > -10){
		intensity = intensity - 1;
	}

	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp1(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	if (intensity < 95){
		intensity = intensity + 1;
	}

	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityp5(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	if (intensity < 95){
		if ((intensity % 5) != 0) {
			intensity = Math.ceil(intensity/5)*5;
		}
		else {
			intensity = intensity + 5;
		}
	}

	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
}

function changeIntensityn5(id){
	let intensity = parseInt(document.getElementById(id).innerHTML);
	// Subir o bajar la intensidad si no estoy en los extremo
	if (intensity > -10){
		if ((intensity % 5) != 0) {
			intensity = Math.ceil(intensity/5)*5 - 5;
		}
		else {
			intensity = intensity - 5;
		}
	}

	// Devolver valor del indice
	document.getElementById(id).innerHTML = intensity;
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

	if (panValue == 1){
		switch (frequency){
			case 125:
				document.getElementById("Der125").innerHTML = intensity;
				break;
			case 250:
				document.getElementById("Der250").innerHTML = intensity;
				break;
			case 500:
				document.getElementById("Der500").innerHTML = intensity;
				break;
			case 1000:
				document.getElementById("Der1000").innerHTML = intensity;
				break;
			case 1500:
				document.getElementById("Der1500").innerHTML = intensity;
				break;
			case 2000:
				document.getElementById("Der2000").innerHTML = intensity;
				break;
			case 4000:
				document.getElementById("Der4000").innerHTML = intensity;
				break;
			case 6000:
				document.getElementById("Der6000").innerHTML = intensity;
				break;
			case 8000:
				document.getElementById("Der8000").innerHTML = intensity;
				break;
		}	
	} else if (panValue == -1){
		switch (frequency){
			case 125:
				document.getElementById("Izq125").innerHTML = intensity;
				break;
			case 250:
				document.getElementById("Izq250").innerHTML = intensity;
				break;
			case 500:
				document.getElementById("Izq500").innerHTML = intensity;
				break;
			case 1000:
				document.getElementById("Izq1000").innerHTML = intensity;
				break;
			case 1500:
				document.getElementById("Izq1500").innerHTML = intensity;
				break;
			case 2000:
				document.getElementById("Izq2000").innerHTML = intensity;
				break;
			case 4000:
				document.getElementById("Izq4000").innerHTML = intensity;
				break;
			case 6000:
				document.getElementById("Izq6000").innerHTML = intensity;
				break;
			case 8000:
				document.getElementById("Izq8000").innerHTML = intensity;
				break;
		}	
	} else{
		switch (frequency){
			case 125:
				document.getElementById("Der125").innerHTML = intensity;
				document.getElementById("Izq125").innerHTML = intensity;
				break;
			case 250:
				document.getElementById("Der250").innerHTML = intensity;
				document.getElementById("Izq250").innerHTML = intensity;
				break;
			case 500:
				document.getElementById("Der500").innerHTML = intensity;
				document.getElementById("Izq500").innerHTML = intensity;
				break;
			case 1000:
				document.getElementById("Der1000").innerHTML = intensity;
				document.getElementById("Izq1000").innerHTML = intensity;
				break;
			case 1500:
				document.getElementById("Der1500").innerHTML = intensity;
				document.getElementById("Izq1500").innerHTML = intensity;
				break;
			case 2000:
				document.getElementById("Der2000").innerHTML = intensity;
				document.getElementById("Izq2000").innerHTML = intensity;
				break;
			case 4000:
				document.getElementById("Der4000").innerHTML = intensity;
				document.getElementById("Izq4000").innerHTML = intensity;
				break;
			case 6000:
				document.getElementById("Der6000").innerHTML = intensity;
				document.getElementById("Izq6000").innerHTML = intensity;
				break;
			case 8000:
				document.getElementById("Der8000").innerHTML = intensity;
				document.getElementById("Izq8000").innerHTML = intensity;
				break;
		}
	}

	let enmascarar = document.querySelector('#audiometria__enmascarar:checked').value;
	
	if (enmascarar == 1){
		if (panValue == 1){
			switch (frequency){
				case 125:
					document.getElementById("EnmIzq125").innerHTML = maskIntensity;
					break;
				case 250:
					document.getElementById("EnmIzq250").innerHTML = maskIntensity;
					break;
				case 500:
					document.getElementById("EnmIzq500").innerHTML = maskIntensity;
					break;
				case 1000:
					document.getElementById("EnmIzq1000").innerHTML = maskIntensity;
					break;
				case 1500:
					document.getElementById("EnmIzq1500").innerHTML = maskIntensity;
					break;
				case 2000:
					document.getElementById("EnmIzq2000").innerHTML = maskIntensity;
					break;
				case 4000:
					document.getElementById("EnmIzq4000").innerHTML = maskIntensity;
					break;
				case 6000:
					document.getElementById("EnmIzq6000").innerHTML = maskIntensity;
					break;
				case 8000:
					document.getElementById("EnmIzq8000").innerHTML = maskIntensity;
					break;
			}
		}else if (panValue == -1){
			switch (frequency){
				case 125:
					document.getElementById("EnmDer125").innerHTML = maskIntensity;
					break;
				case 250:
					document.getElementById("EnmDer250").innerHTML = maskIntensity;
					break;
				case 500:
					document.getElementById("EnmDer500").innerHTML = maskIntensity;
					break;
				case 1000:
					document.getElementById("EnmDer1000").innerHTML = maskIntensity;
					break;
				case 1500:
					document.getElementById("EnmDer1500").innerHTML = maskIntensity;
					break;
				case 2000:
					document.getElementById("EnmDer2000").innerHTML = maskIntensity;
					break;
				case 4000:
					document.getElementById("EnmDer4000").innerHTML = maskIntensity;
					break;
				case 6000:
					document.getElementById("EnmDer6000").innerHTML = maskIntensity;
					break;
				case 8000:
					document.getElementById("EnmDer8000").innerHTML = maskIntensity;
					break;
			}
		}else {
			switch (frequency){
				case 125:
					document.getElementById("EnmDer125").innerHTML = maskIntensity;
					document.getElementById("EnmIzq125").innerHTML = maskIntensity;
					break;
				case 250:
					document.getElementById("EnmDer250").innerHTML = maskIntensity;
					document.getElementById("EnmIzq250").innerHTML = maskIntensity;
					break;
				case 500:
					document.getElementById("EnmDer500").innerHTML = maskIntensity;
					document.getElementById("EnmIzq500").innerHTML = maskIntensity;
					break;
				case 1000:
					document.getElementById("EnmDer1000").innerHTML = maskIntensity;
					document.getElementById("EnmIzq1000").innerHTML = maskIntensity;
					break;
				case 1500:
					document.getElementById("EnmDer1500").innerHTML = maskIntensity;
					document.getElementById("EnmIzq1500").innerHTML = maskIntensity;
					break;
				case 2000:
					document.getElementById("EnmDer2000").innerHTML = maskIntensity;
					document.getElementById("EnmIzq2000").innerHTML = maskIntensity;
					break;
				case 4000:
					document.getElementById("EnmDer4000").innerHTML = maskIntensity;
					document.getElementById("EnmIzq4000").innerHTML = maskIntensity;
					break;
				case 6000:
					document.getElementById("EnmDer6000").innerHTML = maskIntensity;
					document.getElementById("EnmIzq6000").innerHTML = maskIntensity;
					break;
				case 8000:
					document.getElementById("EnmDer8000").innerHTML = maskIntensity;
					document.getElementById("EnmIzq8000").innerHTML = maskIntensity;
					break;
			}
		}
	}
}


// -----------------------------------------------------------------------------
// LOGOAUDIOMETRÍA

let logoaudio = "";

function music(audio){
	logoaudio = new Audio(audio);
}
