/*
 * The WebSocket service source code.
 * Mostly copied from http://hybridpropulsion.com/calculations.html
 */

var accounting = require('./library/accounting.js');

function Calculator() {
};

Calculator.prototype.batteries = [
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

Calculator.prototype.battCharacteristics = [
      {efficiency: .95, pricePerAmp: 1.10}
      , {efficiency: .60, pricePerAmp: 4.27}
      , {efficiency: .40, pricePerAmp: 2.76}
      , {efficiency: .35, pricePerAmp: 2.50}
      ];

Calculator.prototype.generators = [
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

Calculator.prototype.ACDC = [
       [ 0, { size: 5, price: 2500 } ]
       , [ 5, { size: 10, price: 3000 } ]
       , [ 10, { size: 20, price: 3000 } ]
       , [ 20, { size: 50, price: 3000 } ]
       , [ 50, { size: 80, price: 4500 } ]
       , [ 80, { size: 110, price: 4500 } ]
       ];

Calculator.prototype.DCAC = [
       [ 0, { size: 5, price: 700 } ]
       , [ 4, { size: 7, price: 1600 } ]
       , [ 7, { size: 20, price: 3200 } ]
       , [ 20, { size: 50, price: 3800 } ]
       , [ 50, { size: 80, price: 4900 } ]
       , [ 80, { size: 110, price: 4900 } ]
       ];

Calculator.prototype.motors = [
       [ 0, { size: 5, price: 5645, name: 'EVE M2AC' } ]
       , [ 10, { size: 20, price: 5645, name: 'EVE M2AC' } ]
       , [ 20, { size: 40, price: 9690, name: 'EVE M3AC/4-L' } ]
       , [ 30, { size: 40, price: 9690, name: 'EVE M3AC/4-L' } ]
       , [ 40, { size: 100, price: 21400, name: 'EVO AFM-140' } ]
       , [ 50, { size: 100, price: 21400, name: 'EVO AFM-140' } ]
       , [ 65, { size: 100, price: 21400, name: 'EVO AFM-140' } ]
       , [ 80, { size: 200, price: 39800, name: 'EVO AFM-240' } ]
       , [ 100, { size: 200, price: 39800, name: 'EVO AFM-240' } ]
       ];

Calculator.prototype.lookup = function( x, arr ) {
    var r = arr[ 0 ][ 1 ];
    for( var i = 1; i < arr.length && x >= arr[ i ][ 0 ]; ++ i )
        r = arr[ i ][ 1 ];
    return r;
};

Calculator.prototype.calc = function( data ) {

  var r = {};
  var p = {};
  var t = {};
  var T = 0; var n;

  var waterlineLength = Math.min( Math.max( data.lwl, 20 ), 115 );
  var displacement = Math.min( Math.max( data.disp, 8000 ), 150000 );
  var speed = Math.min( Math.max( data.spd, 3 ), 12 );
  var hours = Math.min( Math.max( data.hrs, 0 ), 24 );
  var waterlineSpeed;
  var kWpreferred;
  var genCapacityNeeded;
  var battEfficiency;
  var battPricePerAmp;
  var minCellSize;
  var peakPower;
  var seriesCells;
  var parallelCells;
  var packSize;
  var maxGenHrs = 6;
  var dieselType = 2;
    
  r = { };
  t = { table: [] };
  for( var i = 0; i < 2; ++ i ) {
    t.table[ i ] = [];
    for( var j = 0; j < 9; ++ j )
      t.table[ i ][ j ] = Calculator.rowFunctions[ i ]( Calculator.cols[ j ], waterlineLength, displacement );
  }

  kWpreferred = Calculator.calc_kw( speed, waterlineLength, displacement);
  waterlineSpeed = 1.34 * Math.sqrt(waterlineLength);
  battEfficiency = this.battCharacteristics[data.batteryType].efficiency;
  battPricePerAmp = this.battCharacteristics[data.batteryType].pricePerAmp;
  peakPower = Calculator.calc_kw ( waterlineSpeed, waterlineLength, displacement );
  if (data.batteryType == 0) {
      r.battVoltage = peakPower > 12 ? 360 : 48;
      seriesCells = r.battVoltage == 360 ? 112 : r.battVoltage == 48 ? 14 : 7;
      packSize = 14;
      r.cellVoltage = 3.3;
  }
  else {
      r.battVoltage = peakPower > 12 ? 320 : 48;
      seriesCells = r.battVoltage == 320 ? 24 : r.battVoltage == 48 ? 4 : 2;
      packSize = 4;
      r.cellVoltage = 12.0;
  }
  r.waterlineSpeed = waterlineSpeed;
  r.kWpreferred = kWpreferred;
  r.kWHStorageRequired = hours * (kWpreferred / battEfficiency);
  r.battCurrent = 1000 * kWpreferred / r.battVoltage;
  r.maxBattCurrent = 1000 * peakPower / r.battVoltage;
  minCellSize = Math.max( Math.max( r.maxBattCurrent, r.battCurrent * 3), ( 1000 * r.kWHStorageRequired / r.battVoltage ));
  parallelCells = this.lookup( minCellSize, this.batteries[data.batteryType] ).parallel;
  r.nCells = seriesCells * parallelCells;
  r.LiFePO4size = this.lookup( minCellSize / parallelCells, this.batteries[data.batteryType] ).size;
  r.nBattGroups = (seriesCells / packSize) + "/" + packSize + "/" + parallelCells;
  
  genCapacityNeeded = (r.LiFePO4size / 2) / maxGenHrs;
  r.generator = this.lookup( genCapacityNeeded, this.generators[dieselType] ).name;
  r.generatorSize = this.lookup( genCapacityNeeded, this.generators[dieselType] ).size;
    
  p.Generator = accounting.formatMoney(maxGenHrs == 0 ? 0 : n = this.lookup( genCapacityNeeded, this.generators[dieselType] ).price); T += n;
  p.Conversion = accounting.formatMoney(n = (this.lookup(r.generatorSize, this.ACDC).price + this.lookup(data.peakPower, this.DCAC).price)); T += n;
  p.BMS = accounting.formatMoney(n = (((seriesCells / packSize) * 39) + r.nCells * 27 + 550)); T += n;
  p.Cells = accounting.formatMoney(n = (battPricePerAmp * r.LiFePO4size * r.nCells)); T += n;
  p.Motor = accounting.formatMoney(n = (this.lookup(peakPower, this.motors).price)); T += n;
  p.Total = accounting.formatMoney(T);

  r.motorsize = this.lookup(peakPower, this.motors).size + " kW";
  r.motor = this.lookup(peakPower, this.motors).name;
 
  r.battEfficiency = 100 * battEfficiency + "%";
  r.waterlineSpeed = (Math.round(r.waterlineSpeed * 100) / 100) + " kts";
  r.kWpreferred = r.kWpreferred + " kW";
  r.kWHStorageRequired = Math.round(r.kWHStorageRequired) + " kWH";
  r.battVoltage = r.battVoltage + " volts";
  r.maxBattCurrent = Math.round(r.maxBattCurrent) + " amps";
  r.cellVoltage = r.cellVoltage + " volts";
  r.generatorSize = r.generatorSize + " kWH";
  r.battCurrent = Math.round(r.battCurrent) + " amps";
  r.LiFePO4size = r.LiFePO4size + " AHr";
     
  return { results: r, prices: p, tables: t };
};

Calculator.cols = [ 3.0, 4.5, 6.0, 7.0, 8.0, 9.0, 10.0, 11.0, 12.0 ];

Calculator.calc_hp = function( knots, lwl, disp ) {
  var sl = knots / Math.sqrt( lwl );
  if( sl > 1.23 * 1.34 )
    return 'NA';
  return Math.round( .9 + disp / Math.pow( 10.665 / sl, 3 ) );    
};

Calculator.calc_kw = function( knots, lwl, disp ) {
  var sl = knots / Math.sqrt( lwl );
  if( sl > 1.23 * 1.34 )
    return 'NA';
  var shp = disp / Math.pow( 10.665 / sl, 3 );
  return Math.round( 10 * shp * 0.74567 ) / 10;
};

Calculato = [
  Calculator.calc_hp
, Calculator.calc_kw
];

module.exports = new Calculator();
