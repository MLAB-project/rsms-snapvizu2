import { SimpleSlider } from "https://cdn.skypack.dev/@danchitnis/simple-slider";
import { WebglPlot, ColorRGBA, WebglLine } from "https://cdn.skypack.dev/webgl-plot";
const canvas = document.getElementById("my_canvas");
var wglp;

init();
function newFrame() {
    wglp.update();
    requestAnimationFrame(newFrame);
}
requestAnimationFrame(newFrame);

function init() {
    const devicePixelRatio = window.devicePixelRatio || 1;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    wglp = new WebglPlot(canvas);
}

function plot(data) {
    wglp.removeAllLines();

    var numX = data.length / 8;

    const colors = [
    	[0.0, 1.0, 1.0],
    	[0.3, 1.0, 0.3],
    	[1.0, 1.0, 0.0],
    	//[1.0, 0.0, 1.0],
    ];

    for (let i = 0; i < colors.length; i++) {
        const color = new ColorRGBA(colors[i][0], colors[i][1], colors[i][2], 1);
        const line = new WebglLine(color, numX);
        line.lineSpaceX(-1, 2 / numX);
        wglp.addLine(line);
    }
    var lineNo = 0;
    wglp.linesData.forEach((line) => {
    	var off;
    	if (lineNo != 2)
    		off = lineNo;
    	else
    		off = 3;

    	for (let i = 0; i < line.numPoints; i++)
    		line.setY(i, data[(8*i + off)] / 16384);
    	lineNo++;
    });

    requestAnimationFrame(newFrame);
}

function setInfotext(text) {
    document.getElementById("info").innerHTML = text;
}

function loadRec(url) {
	const xhr = new XMLHttpRequest();
    setInfotext(`${url} Loading...`);
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.onload = () => {
		var blob = xhr.response || xhr.mozResponseArrayBuffer;
		const header = new BigInt64Array(blob, 0, 5);
		const samplebytes = Number((header[2] + header[3]) * header[1]);
        const data = new Int16Array(blob, 8*5, samplebytes / 2);
		plot(data);
        setInfotext(`${url}`);

        return undefined;
    };
    xhr.send(null);
}

async function pollNext(current) {
  let resp = await fetch(`/check?cut=${current}`);

  if (resp.status == 502) {
    await pollNext(current);
  } else if (resp.status != 200) {
    setInfotext(`pollNext: ${resp.statusText}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await pollNext(current);
  } else {
    location.hash = `#${await resp.text()}`;
    location.reload(); 
  }
}

var hash = location.hash;
var current = hash.length > 1 ? location.hash.substring(1) : "";
pollNext(current);

if (current) {
    loadRec(`snaps/${current}`);
}
