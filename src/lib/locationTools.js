const asin = Math.asin;
const cos = Math.cos;
const sin = Math.sin;
const sqrt = Math.sqrt;
const PI = Math.PI;

// equatorial mean radius of Earth (in meters)
const R = 6378137;

function squared(x) {
  return x * x;
}
function toRad(x) {
  return (x * PI) / 180.0;
}
function hav(x) {
  return squared(sin(x / 2));
}

export function getDistance(a, b) {
  const aLat = toRad(Array.isArray(a) ? a[1] : a.latitude || a.lat);
  const bLat = toRad(Array.isArray(b) ? b[1] : b.latitude || b.lat);
  const aLng = toRad(Array.isArray(a) ? a[0] : a.longitude || a.lng || a.lon);
  const bLng = toRad(Array.isArray(b) ? b[0] : b.longitude || b.lng || b.lon);

  const ht = hav(bLat - aLat) + cos(aLat) * cos(bLat) * hav(bLng - aLng);
  return 2 * R * asin(sqrt(ht));
}

function inside(point, vertices) {
  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];
    const xj = vertices[j][0];
    const yj = vertices[j][1];

    const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function distanceToGeoPolygon(geoPoint, geoPolygon) {
  const isInside = inside(geoPoint, geoPolygon);
  if (isInside) {
    return 0;
  }
  /*   const clockWise = isClockWise(geoPolygon);
    const param = clockWise ? "CW" : "CCW";
    console.log('param', param) */
  const distance = distanceToPolygon(geoPoint, geoPolygon);
  return distance;
}

const distanceToLine = ([px, py], [[l1x, l1y], [l2x, l2y]]) => {
  const xD = l2x - l1x;
  const yD = l2y - l1y;

  const u = ((px - l1x) * xD + (py - l1y) * yD) / (xD * xD + yD * yD);

  let closestLine;
  if (u < 0) {
    closestLine = [l1x, l1y];
  } else if (u > 1) {
    closestLine = [l2x, l2y];
  } else {
    closestLine = [l1x + u * xD, l1y + u * yD];
  }

  return getDistance([px, py], closestLine);
};

const distanceToPolygon = ([px, py], vertices) => {
  const comp = vertices.reduce(
    ({ prevPoint, dist }, currPoint) => {
      const prevPointR = prevPoint ? [prevPoint[1], prevPoint[0]] : prevPoint;
      const currPointR = currPoint ? [currPoint[1], currPoint[0]] : currPoint;
      const currDist = distanceToLine([px, py], [prevPointR, currPointR]);
      const ret = {
        prevPoint: currPointR,
        dist,
      };
      if (currDist < dist) {
        ret.dist = currDist;
      }
      return ret;
    },
    { prevPoint: vertices[vertices.length - 1], dist: Infinity },
  );
  return comp.dist;
};

function colorToRGBArray(color) {
  if (!color) return;
  if (color.toLowerCase() === 'transparent') return [0, 0, 0, 0];
  if (color[0] === '#') {
    if (color.length < 7) {
      // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
      color =
        '#' +
        color[1] +
        color[1] +
        color[2] +
        color[2] +
        color[3] +
        color[3] +
        (color.length > 4 ? color[4] + color[4] : '');
    }
    return [
      parseInt(color.substr(1, 2), 16),
      parseInt(color.substr(3, 2), 16),
      parseInt(color.substr(5, 2), 16),
      color.length > 7 ? parseInt(color.substr(7, 2), 16) / 255 : 1,
    ];
  }
  if (color.indexOf('rgb') === -1) {
    // convert named colors
    var temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
    var flag = 'rgb(1, 2, 3)'; // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
    temp_elem.style.color = flag;
    if (temp_elem.style.color !== flag) return; // color set failed - some monstrous css rule is probably taking over the color of our object
    temp_elem.style.color = color;
    if (temp_elem.style.color === flag || temp_elem.style.color === '') return; // color parse failed
    color = getComputedStyle(temp_elem).color;
    document.body.removeChild(temp_elem);
  }
  if (color.indexOf('rgb') === 0) {
    if (color.indexOf('rgba') === -1) color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
    return color.match(/[\.\d]+/g).map(function (a) {
      return +a;
    });
  }
}

export function colorToDEckFormat(str, opacity = 0.75) {
  const arr = colorToRGBArray(str);
  if (arr) {
    arr[3] = arr[3] * 255 * opacity;
  }
  return arr;
}

export const getgeoToZone = (geo, zones) => {
  let minDistance = 9999999999999999;
  let realZone;
  for (let i = 0; i < zones.length; i++) {
    const zone = zones[i];
    const distance = distanceToGeoPolygon(geo, zone.geometry.coordinates[0][0]);
    if (distance === 0) {
      return zone;
    } else {
      if (distance < minDistance) {
        minDistance = distance;
        realZone = zone;
      }
    }
  }
  return realZone;
};
