// methods to call with

const me = ['GET', 'POST', 'PUT', 'DELETE'];

const createNode = (el) => document.createElement(el);
const append = (parent, el) => parent.appendChild(el);
const getEl = (el) => document.getElementById(el);
const setText = (text) => document.createTextNode(text);

const getUrl = 'https://ameste.se/api/index.php';

const apiCall = async(url, info) => {
    return fetch(url + '?table=' + info)
        .then(response => response.json())
}

const educationBox = async() => {
    let educ = getEl('educ');
    await apiCall(getUrl, 'edu')
        .then(msg => msg.sort((a, b) => { return a.year - b.year }))
        .then(msg => msg.map(course => {
            educ.insertAdjacentHTML('beforeend', `
			<div class="educard">
				<h3>${course.school}</h3>
				<h3>${course.year}</h3>
				<p>${course.description}</p>
				<div class="edubottom">
					<h2>${course.title}
				</div>
			</div>
			`)
        }))
}

const projBox = async() => {
    let proj = getEl('projcards');
    await apiCall(getUrl, 'projs')
        .then(data => data.map(cor => {
            proj.insertAdjacentHTML('beforeend',
                `<div class="projcard ${cor.pos}" id="${cor.pos}">
			<div class="front" id="frontcard${cor.id}">
				<h2 class="projtitle"> ${cor.title} </h2>
			</div>
			<div class="back">
			<p>${cor.description}</p>
			<a href="${cor.github}">Github</a>
			<a href="${cor.testdrive}">Provkör</a>
			</div>
			</div>`);
            let frontdiv = getEl(`frontcard${cor.id}`);
            frontdiv.style.backgroundImage = `url(${cor.img})`;
            let flipEl = getEl(`${cor.pos}`);
            flipEl.addEventListener('click', () => {
                flipEl.classList.toggle('flipped');
            })
        }))
}

const jobBox = async() => {
    let job = getEl('jobcards');
    await apiCall(getUrl, 'job')
        .then(msg => msg.sort((a, b) => { return a.year - b.year }))
        .then(msg => msg.map(cor => {
            job.insertAdjacentHTML('beforeend',
                `
		<div class="job">
			<div class="jobinfo">
				<h3>${cor.title}</h3>
				<p>${cor.description}</h3>
			</div>
			<div class="year">
				<h3>${cor.year}</h3>
			</div>
		</div>
			`)
        }))
}

let sendcont = getEl('contform');
sendcont.addEventListener('submit', (event) => {
    event.preventDefault();
    getEl('sendcont').disabled = true;
    let dataSet = {};
    let i = 0;
    while (i < sendcont.length) {
        dataSet[contform[i].id] = contform[i].value;
        i++;
    }
    console.log(dataSet);
    fetch('https://ameste.se/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataSet)
        })
        .then(response => response.json())
        .then(data => {
            window.alert(data.message);
        })
})


let i = 0;
let txt = 'dina behov, min kod';
let speed = 100;

const typeWriter = () => {
    if (i < txt.length) {
        getEl("typetext").innerHTML += txt.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
    }
}

window.onload = educationBox();
window.onload = projBox();
window.onload = jobBox();
window.onload = typeWriter();