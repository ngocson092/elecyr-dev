/*
 * Copied from an old project
 */

var accounting = require('./library/accounting.js');

function PowerStation() {
};

PowerStation.prototype.batteries = [
[
      [ 0, {size: 160, parallel: 1} ]
    , [ 160, {size: 160, parallel: 1} ]
    , [ 200, {size: 200, parallel: 1} ]
    , [ 260, {size: 260, parallel: 1} ]
    , [ 300, {size: 300, parallel: 1} ]
    , [ 400, {size: 400, parallel: 1} ]
    , [ 700, {size: 700, parallel: 1} ]
    , [ 1000, {size: 1000, parallel: 2} ]
    , [ 2000, {size: 1000, parallel: 3} ]
    , [ 3000, {size: 1000, parallel: 4} ]
    , [ 4000, {size: 1000, parallel: 5} ]
    , [ 5000, {size: 1000, parallel: 6} ]
 ]
,[
      [ 0, {size: 214, parallel: 1} ]
    , [ 160, {size: 214, parallel: 1} ]
    , [ 200, {size: 214, parallel: 2} ]
    , [ 260, {size: 214, parallel: 2} ]
    , [ 300, {size: 214, parallel: 2} ]
    , [ 400, {size: 214, parallel: 2} ]
    , [ 700, {size: 214, parallel: 4} ]
    , [ 1000, {size: 214, parallel: 5} ]
    , [ 2000, {size: 214, parallel: 9} ]
    , [ 3000, {size: 214, parallel: 15} ]
    , [ 4000, {size: 214, parallel: 19} ]
    , [ 5000, {size: 214, parallel: 24} ]
 ]
,[
      [ 0, {size: 160, parallel: 1} ]
    , [ 160, {size: 220, parallel: 1} ]
    , [ 200, {size: 220, parallel: 2} ]
    , [ 260, {size: 220, parallel: 2} ]
    , [ 300, {size: 220, parallel: 2} ]
    , [ 400, {size: 220, parallel: 2} ]
    , [ 700, {size: 220, parallel: 4} ]
    , [ 1000, {size: 220, parallel: 5} ]
    , [ 2000, {size: 220, parallel: 9} ]
    , [ 3000, {size: 220, parallel: 14} ]
    , [ 4000, {size: 220, parallel: 18} ]
    , [ 5000, {size: 220, parallel: 22} ]
 ]
,[
      [ 0, {size: 160, parallel: 1} ]
    , [ 160, {size: 200, parallel: 1} ]
    , [ 200, {size: 260, parallel: 1} ]
    , [ 260, {size: 300, parallel: 1} ]
    , [ 300, {size: 400, parallel: 1} ]
    , [ 400, {size: 700, parallel: 1} ]
    , [ 700, {size: 1000, parallel: 1} ]
    , [ 1000, {size: 1000, parallel: 2} ]
    , [ 2000, {size: 1000, parallel: 3} ]
    , [ 3000, {size: 1000, parallel: 4} ]
    , [ 4000, {size: 1000, parallel: 5} ]
    , [ 5000, {size: 1000, parallel: 6} ]
    ]
];

PowerStation.prototype.battCharacteristics = [
      {efficiency: .95, pricePerAmp: 1.05}
    , {efficiency: .60, pricePerAmp: 4.27}
    , {efficiency: .40, pricePerAmp: 2.76}
    , {efficiency: .35, pricePerAmp: 2.50}
    ];

PowerStation.prototype.generators = [
 [
      [ 0, { size: 6, price: 8900, name: 'Onan QD6000' } ]
    , [ 6, { size: 12, price: 9995, name: 'Kubota HDAEKB-12-EC' } ]
    , [ 12, { size: 29, price: 17066, name: 'John Deere HDHIJD-30' } ]
    , [ 29, { size: 40, price: 15062, name: 'Perkins ECO 32 3S' } ]
    , [ 40, { size: 55, price: 16220, name: 'Perkins ECO 32 3L' } ]
    , [ 55, { size: 65, price: 18065, name: 'Perkins ECO 32 3L' } ]
    , [ 65, { size: 80, price: 20099, name: 'Perkins ECO 34 1SN' } ]
    , [ 80, { size: 100, price: 21516, name: 'Perkins ECO 34 2SN' } ]
    , [ 100, { size: 140, price: 25529, name: 'Perkins 140 34 2LN' } ]
 ]
,[
     [ 0, { size: 7, price: 1999, name: 'GE 7kW #40315GE' } ]
   , [ 7, { size: 14, price: 3859, name: 'Kohler 14kW 14RESAL' } ]
   , [ 20, { size: 20, price: 17066, name: 'GE 20KW 040381' } ]
   , [ 30, { size: 30, price: 15062, name: 'Kohler 30kW 30RESAL' } ]
   , [ 38, { size: 38, price: 12999, name: 'Kohler 38kW 38RSL' } ]
   , [ 48, { size: 38, price: 14899, name: 'Kohler 48kW 48RCL' } ]
   , [ 48, { size: 38, price: 14899, name: 'Kohler 48kW 48RCL' } ]
   , [ 48, { size: 38, price: 14899, name: 'Kohler 48kW 48RCL' } ]
   , [ 100, { size: 38, price: 14899, name: 'Kohler 48kW 48RCL' } ]
 ]
,[
      [ 0, { size: 5.5, price: 6690, name: 'Kuboto HDUCM2' } ]
    , [ 8, { size: 9, price: 9186, name: 'Isuzu 3CB' } ]
    , [ 13, { size: 13, price: 10422, name: 'Isuzu 3CE' } ]
    , [ 20, { size: 20, price: 10990, name: 'Isuzu 4LE1' } ]
    , [ 30, { size: 30, price: 9618, name: 'Mitsubishi MB-30k-MRN' } ]
    , [ 40, { size: 40, price: 18065, name: 'Mitsubishi MB-40k-MRN' } ]
    , [ 60, { size: 60, price: 24985, name: 'Phasor Marine 60KW' } ]
    , [ 90, { size: 99, price: 33965, name: 'Phasor Marine 99KW' } ]
    , [ 100, { size: 99, price: 33965, name: 'Phasor Marine 99KW' } ]
    ]
];

PowerStation.prototype.ACDC = [
      [ 0, { size: 5, price: 2500 } ]
    , [ 5, { size: 10, price: 3000 } ]
    , [ 10, { size: 20, price: 3000 } ]
    , [ 20, { size: 50, price: 3000 } ]
    , [ 50, { size: 80, price: 4500 } ]
    , [ 80, { size: 110, price: 4500 } ]
    ];

PowerStation.prototype.DCAC = [
      [ 0, { size: 5, price: 700 } ]
    , [ 4, { size: 7, price: 1600 } ]
    , [ 7, { size: 20, price: 3200 } ]
    , [ 20, { size: 50, price: 3800 } ]
    , [ 50, { size: 80, price: 4900 } ]
    , [ 80, { size: 110, price: 4900 } ]
    ];

PowerStation.prototype.PanelSpecs = [
      { sqFt: 16, price: 312, power: 255 }
    , { sqFt: 17, price: 250, power: 240 }
    , { sqFt: 21, price: 302, power: 285 }
    , { sqFt: 11, price: 330, power: 140 }
    , { sqFt: 17, price: 403, power: 240 }
    , { sqFt: 18, price: 320, power: 250 }
    ];

PowerStation.prototype.lookup = function( x, arr ) {
  var r = arr[ 0 ][ 1 ];
  for( var i = 1; i < arr.length && x >= arr[ i ][ 0 ]; ++ i )
    r = arr[ i ][ 1 ];
  return r;
};

PowerStation.prototype.calc = function( data ) {
    var r = {}; 
    var p = {};
    var T = 0; var n;
    var genCapacityNeeded;
    var whichPanel;
    var battEfficiency;
    var battPricePerAmp;
    var minCellSize;
    var peakPower;
    var seriesCells;
    var parallelCells;
    var packSize;
    var battvoltage;
    var LiFePO4size;
    var nCells;

    
    whichPanel = this.PanelSpecs[data.panelType];
    peakPower = Math.max(data.peakPower, data.peakAC);
    r.solarKWH = data.dailyKWH * data.solarSupplied / 100;
    r.panelKWRequired = 1.3 * r.solarKWH / data.sunHours;
    battvoltage = 380;
    seriesCells = 112;
    packSize = 14; 
    battEfficiency = 0.95;
    battPricePerAmp = 1.02;

    r.kWHStorageRequired = data.daysOfBatteryBackup * (data.dailyKWH / battEfficiency);
    r.battCurrent = (1000 * data.dailyKWH / 24) / battvoltage;
    r.maxBattCurrent = 1000 * Math.max( data.peakPower, data.peakAC ) / battvoltage;
    minCellSize = Math.max( Math.max( r.maxBattCurrent, r.battCurrent * 3), ( 1000 * r.kWHStorageRequired / battvoltage ));
    LiFePO4size = 40;
    r.nBattGroups = Math.floor((r.kWHStorageRequired + 14) / 15);

    r.nPanels = r.panelKWRequired * 1000 / whichPanel.power;
    r.sqFtOfPanels = whichPanel.sqFt * r.nPanels;
    genCapacityNeeded = Math.min( data.dailyKWH, LiFePO4size / 2 ) / data.maxGenHrs;

    if ( data.maxGenHrs == 0 ) {
        r.generator = 'NONE';
        p.Generator = 0;
        r.generatorSize = 0;
    } else {
        r.generator = this.lookup( genCapacityNeeded, this.generators[data.dieselType] ).name;
        p.Generator = accounting.formatMoney(data.maxGenHrs == 0 ? 0 : n = this.lookup( genCapacityNeeded, this.generators[data.dieselType] ).price); T += n;
        r.generatorSize = this.lookup( genCapacityNeeded, this.generators[data.dieselType] ).size;
    }
    
    p.dailyOperating = accounting.formatMoney(365 * ((.186 * data.dailyKWH * data.maxGrid / 100) + (.578 * data.dailyKWH * (100 - data.solarSupplied - data.maxGrid) / 100)));
    p.Conversion = accounting.formatMoney(n = (this.lookup(r.generatorSize, this.ACDC).price + this.lookup(data.peakPower, this.DCAC).price)); T += n;
    p.Panels = accounting.formatMoney(n = (r.nPanels * whichPanel.price)); T += n;
    p.Cells = accounting.formatMoney(n = (r.nBattGroups * 17800)); T += n;
    p.Controller = accounting.formatMoney(n = ((r.nPanels / 2) * 300)); T += n;
    p.Total = accounting.formatMoney(T);
    
  return { results: r, prices: p };
};

module.exports = new PowerStation();
