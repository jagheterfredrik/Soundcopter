/*
Stolen from Neville Li, thx!
*/

// 'use strict';

sp = getSpotifyApi(1);

// multi-band presets
var BAND10 = [
  31, 63, 125, 250, 500,
  1000, 2000, 4000, 8000, 16000,
];

var BAND31 = [
  20, 25, 31, 40, 50, 63, 80, 100, 126, 160,
  201, 253, 320, 403, 507, 640, 806, 1000, 1300, 1600,
  2000, 2500, 3200, 4000, 5100, 6400, 8100, 10000, 13000, 16000,
  20000,
];

// bands registered
var _bands = [];

// spectrum setting
var _base = 0.0;
var _lower = [];

function init(callback, bands) {
  // initialize bands
  _bands = [];
  if (bands !== undefined) {
    for (var i = 0, l = bands.length; i < l; i++) {
      if (i === 0 && bands[i] <= 0)
        continue;
      if (i > 0 && bands[i] <= bands[i - 1])
        continue;
      _bands.push(bands[i]);
    }
  }

  // register callback
  sp.trackPlayer.addEventListener("audioSpectrumChanged", function(s) {
    var data = transform(s);
    callback(data);
    delete s, data;
  });
}

function calibrate(base, len) {
  // use all bands, no need to calibrate
  if (_bands.length === 0) {
    return;
  }

  _base = base;
  _lower = [];

  // find lower bound frequency bin of each band
  var k = 0;
  var lfreq, rfreq;
  for (var i = 0; i < len; i++) {
    lfreq = (i) * _base;
    rfreq = (i+1.0) * _base;
    if (k < _bands.length && lfreq <= _bands[k]) {
      while (k < _bands.length && _bands[k] <= rfreq) {
        _lower.push(i);
        k+= 1;
      }
    }
  }
}

function transform(s) {
  // new base frequency, calibrate bands
  if (_base !== s.data.base) {
    calibrate(s.data.base, s.data.spectruml.length);
  }

  var left = [];
  var right = [];

  // no bands defined, return all available
  if (_bands.length === 0) {
    left = s.data.spectruml;
    right = s.data.spectrumr;

    // band 0 is minimal, disgard
    left.shift();
    right.shift();
    return {
      spectruml: left,
      spectrumr: right,
      wavel: s.data.wavel,
      waver: s.data.waver,
    };
  }

  var f, fl, fh, lo, hi;
  for (var i = 0, l = _bands.length; i < l; i++) {
    f = _bands[i];      // target freq
    lo = _lower[i];     // lower bin
    hi = lo + 1;        // higher bin
    fl = _base * lo;    // lower bound
    fh = fl + _base;    // higher bound

    // linear interpolation
    var dbl, dbh, db;

    dbl = s.data.spectruml[lo];
    dbh = s.data.spectruml[hi];
    db = dbl + (f - fl) * (dbh - dbl) / (fh - fl);
    left.push(db);

    dbl = s.data.spectrumr[lo];
    dbh = s.data.spectrumr[hi];
    db = dbl + (f - fl) * (dbh - dbl) / (fh - fl);
    right.push(db);
  }
  return {
    spectruml: left,
    spectrumr: right,
    wavel: s.data.wavel,
    waver: s.data.waver,
  };
}

function normalize(data, max) {
  // normalize decibel levels to 0 - max
  if (max === undefined) max = 100;
  for (var i = 0, len = data.spectruml.length; i < len; i++) {
    var l = Math.floor(data.spectruml[i] + 60);
    l = Math.max(Math.min(l, 72), 0);
    data.spectruml[i] = l / 72 * max;

    var r = Math.floor(data.spectrumr[i] + 60);
    r = Math.max(Math.min(r, 72), 0);
    data.spectrumr[i] = r / 72 * max;
  }
  return data;
}

function color(f) {
  // audio frequency to wave length
  var s = Math.log(f - 19) / Math.log(22500 - 19);
  var w = (1 - s) * 370 + 380;

  // wave length to RGB
  var r, g, b;
  if (w >= 380 && w < 440) {
    r = -(w - 440.) / (440. - 380.);
    g = 0.0;
    b = 1.0;
  } else if(w >= 440 && w < 490) {
    r = 0.0;
    g = (w - 440.) / (490. - 440.);
    b = 1.0;
  } else if(w >= 490 && w < 510) {
    r = 0.0;
    g = 1.0;
    b = -(w - 510.) / (510. - 490.);
  } else if(w >= 510 && w < 580) {
    r = (w - 510.) / (580. - 510.);
    g = 1.0;
    b = 0.0;
  } else if(w >= 580 && w < 645) {
    r = 1.0;
    g = -(w - 645.) / (645. - 580.);
    b = 0.0;
  } else if(w >= 645 && w <= 750) {
    r = 1.0;
    g = 0.0;
    b = 0.0;
  } else {
    r = 0.0;
    g = 0.0;
    b = 0.0;
  }
  r = Math.floor(r * 255).toString(16);
  g = Math.floor(g * 255).toString(16);
  b = Math.floor(b * 255).toString(16);
  if (r.length == 1) r = '0' + r;
  if (g.length == 1) g = '0' + g;
  if (b.length == 1) b = '0' + b;
  return '#' + r + g + b;
}

// exports
exports.init = init;
exports.normalize = normalize;
exports.color = color;
exports.BAND10 = BAND10;
exports.BAND31 = BAND31;
