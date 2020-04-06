// takes a margin within which the blobbiness may work, as a css distance
// width and height are the dimensions of the safe space, given as numbers that will be interpreted in the same units as above
// TODO get padding and use it as a default blobbiness
// TODO allow separate blobbinesses for each side
// lol so we gotta figure out how we really want it to behave
// because percent seems to be the only responsive unit
const applyBlobClipPath = (element, blobbiness, width, height) => {
	let limit = blobbiness.match(/[0-9]+/)[0];
	let units = blobbiness.match(/[^0-9]+/)[0];
	let boxW = element.clientWidth;
	let boxH = element.clientHeight;
	let emSize = 1 / ~~(window.getComputedStyle(element).fontSize.match(/[0-9]+/)[0]);
	let remSize = 1 / ~~(window.getComputedStyle(document.getElementsByTagName('html')[0]).fontSize.match(/[0-9]+/)[0]);
	let emW = boxW * emSize; let emH = boxH * emSize;
	let remW = boxW * remSize; let remH = boxH * remSize;

	switch (units) {
		case '%':
			width = width || 100 - limit;
			height = height || 100 - limit;
			break;
		case 'em':
			width = width || emW - limit;
			height = height || emH - limit;
			break;
		case 'rem':
			width = width || remW - limit;
			height = height || remH - limit;
			break;
		case 'px':
			width = width || boxW - limit;
			height = height || boxH - limit;
			break;
	}
	//console.log('Width: ', width);
	//console.log('Height: ', height);

	let points = [];
	const addPoint = (x, y) => {
		points.push(`${x}${units} ${y}${units}`);
	};

	let vertices = [];
	const rnd = (lim) => Math.random() * lim;
	vertices.push({ x: rnd(limit), y: rnd(limit) });
	vertices.push({ x: width + rnd(limit), y: rnd(limit) });
	vertices.push({ x: width + rnd(limit), y: height + rnd(limit) });
	vertices.push({ x: rnd(limit), y: height + rnd(limit) });
	for (let i in vertices) {
		let v = vertices[i];
		if (v.x && v.y) {
			//console.log(v);
			addPoint(v.x, v.y);
		}
	}

//	console.log(limit, units, points, vertices);
	element.style.clipPath = `polygon(${points.join(', ')}`;
}
