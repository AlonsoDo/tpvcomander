var express = require('express') ;
var http = require('http');
var app = express();
var server = http.createServer(app);
var mysql = require('mysql');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.static(__dirname + '/public'));
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require("socket.io").listen(server);

// Heroku setting for long polling
io.configure(function () { 
    io.set("transports", ["xhr-polling"]); 
    io.set("polling duration", 10); 
});

io.sockets.on('connection', function (socket) {
  
  socket.emit('news', { hello: 'world' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });  
    
  socket.on('CargarGrupos', function (data) {  
    console.log(data);
    var client = mysql.createConnection({
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',*/
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
    });
    
    //client.query('USE heroku_d6062326996f9df');
    client.query('USE datosnuevos');
    
    client.query('SELECT * FROM grupos',
      function selectGrupos(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);
        console.log(results);
        client.end();
        socket.emit('GruposBack',JSON.stringify(results));
    });
  });
  
  socket.on('CargarArticulos', function (data) {
    console.log(data);
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',*/
      
    }); 
    
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query('SELECT * FROM articulos WHERE CodGru='+data.codigogrupo,
      function selectArticulos(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);
        console.log(results);
        //console.log(JSON.stringify(results));
        client.end();
        socket.emit('ArticulosBack',JSON.stringify(results));
    });
  });
  
  socket.on('CargarDetalle', function (data) {
    console.log(data);
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query('SELECT * FROM detalles WHERE CodArt='+data.codigodetalle,
      function selectDetalles(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);
        console.log(results);
        //console.log(JSON.stringify(results));
        client.end();
        socket.emit('DetallesBack',JSON.stringify(results));
    });
  });
  
  socket.on('EnviarPedido', function (data) {
    
    //console.log(data);
        
    var date;
    date = new Date();
    date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' + 
    ('00' + date.getHours()).slice(-2) + ':' + 
    ('00' + date.getMinutes()).slice(-2) + ':' + 
    ('00' + date.getSeconds()).slice(-2);    
    
    var nCuantosArticulos = data.numeroarticulos; 
    var cCuenta = data.cuenta;
    var nCodTer = data.codterminal;
    var nSesion = 1;
    var nCodiLote;    
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',*/      
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("INSERT INTO lotes(Momento,Articulos,Cuenta,CodTer,Sesion) VALUES ('" + date + "'," + nCuantosArticulos + ",'" + cCuenta + "'," + nCodTer + ",1)",
      function getLote(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }        
        nCodiLote = results.insertId;
        client.end();
        socket.emit('EnviarPedidoBack', { codigolote: nCodiLote });
        
    });    
    
  });
  
  socket.on('EnviarPedido2', function (data) {
    
    //console.log(data.cuenta); ok
    var cCuenta = data.cuenta;
    var EstadoCodFac;
    var nCodFac;
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("SELECT CodFac FROM facturas WHERE Sesion=1 and Estado='A' and Nombre='" + cCuenta + "'",
          
      function getCodFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);            
        if (results.length==1) {
          EstadoCodFac = 'Encontrada';
          console.log(results[0].CodFac);
          nCodFac = results[0].CodFac;
        }else{
          EstadoCodFac = 'Nueva';
          nCodFac = -1;
        }
        console.log(EstadoCodFac);
        client.end();
        
        socket.emit('EnviarCodFac', { codigofact: nCodFac });
        
      });
        
  });
  
  socket.on('SolicitarCodiFact', function (data) {
    
    //console.log(data.cuenta); ok
    //Test
    var cCuenta = data.cuenta;
    var nCodPer = data.codigopersonal;
    var nCodTer = data.codigoterminal;
    var nCodFac;
    var date;
    date = new Date();
    date = date.getFullYear() + '-' +
    ('00' + (date.getMonth()+1)).slice(-2) + '-' +
    ('00' + date.getDate()).slice(-2) + ' ' + 
    ('00' + date.getHours()).slice(-2) + ':' + 
    ('00' + date.getMinutes()).slice(-2) + ':' + 
    ('00' + date.getSeconds()).slice(-2);
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("INSERT INTO facturas(Sesion,Estado,Nombre,TotalFac,Cantidad,Cambio,FechaHora,CodPersOpen,CodTermOpen) VALUES (1,'A','" + cCuenta + "',0,0,0,'" + date + "'," + nCodPer + "," + nCodTer + ")",
          
      function getCodFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        }         
        client.end();
        nCodFac = results.insertId;
        socket.emit('EnviarCodFac', { codigofact: nCodFac });        
      });
        
  });
  
  socket.on('GrabarDetalle', function (data) {
    
    console.log(data.datosgrid);
    console.log(data.cuenta);
    console.log(data.codilote);
    console.log(data.codifact);    
    console.log(data.codigoterminal);
    console.log(data.codigopersonal);
    
    var nCodFac = data.codifact;
    
    var dataJson = eval(data.datosgrid);
    var nCont = 0;    
        
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',*/
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    for(var j in dataJson){
      
      nCont = nCont + 1;
      var nUni = dataJson[j].Uni;
      var cDescripcion = dataJson[j].Descripcion;
      var nCodArt = dataJson[j].CodArt;
      var nPrecio = dataJson[j].Precio;
      var cNombre = dataJson[j].Nombre;
      var nImpEnFac = dataJson[j].ImpEnFac;
      var cTipoSalida = dataJson[j].TipoSalida;
      var cSalida = dataJson[j].Salida;
            
      client.query("INSERT INTO detafact(CodFac,Uni,Descripcion,CodArt,Importe,Nombre,ImpEnFac,Grabada,TipoSalida,NumSalida,PediProc,CodTerminal,CodPers,CodLote)" +
                   " VALUES (" + nCodFac + "," + nUni + ",'" + cDescripcion + "'," + nCodArt + "," + nPrecio + ",'" + cNombre + "'," + nImpEnFac + ",0,'" + cTipoSalida + "','" + cSalida + "',0," + data.codigoterminal + "," + data.codigopersonal + "," + data.codilote + ")",
            
        function InsertarArticulo(err, results, fields) { 
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }        
        });
    }
    
    console.log('Numero de registros: '+nCont);
    
    client.end();
    
    socket.emit('DetalleGrabadoBack', { codigofact: nCodFac }); 
    
  });
  
  socket.on('GrabarDetalleFactModi', function (data) {
    
    console.log(data.datosgrid);
    
    //console.log(data.codilote); 0
    console.log(data.codifact);    
    console.log(data.codigoterminal);
    console.log(data.codigopersonal);
    
    var nCodFac = data.codifact;
    
    var dataJson = eval(data.datosgrid);
    var nCont = 0;    
        
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',*/
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    for(var j in dataJson){
      
      nCont = nCont + 1;
      var nUni = dataJson[j].Uni;
      var cDescripcion = dataJson[j].Descripcion;
      var nCodArt = dataJson[j].CodArt;
      var nPrecio = dataJson[j].Precio;
      var cNombre = dataJson[j].Nombre;
      var nImpEnFac = dataJson[j].ImpEnFac;
      var cTipoSalida = dataJson[j].TipoSalida;
      var cSalida = dataJson[j].Salida;
            
      client.query("INSERT INTO detafact(CodFac,Uni,Descripcion,CodArt,Importe,Nombre,ImpEnFac,Grabada,TipoSalida,NumSalida,PediProc,CodTerminal,CodPers,CodLote)" +
                   " VALUES (" + nCodFac + "," + nUni + ",'" + cDescripcion + "'," + nCodArt + "," + nPrecio + ",'" + cNombre + "'," + nImpEnFac + ",0,'" + cTipoSalida + "','" + cSalida + "',0," + data.codigoterminal + "," + data.codigopersonal + ",0)",
            
        function InsertarArticulo(err, results, fields) { 
          if (err) {
            console.log("Error: " + err.message);
            throw err;
          }        
        });
    }
    
    console.log('Numero de registros: '+nCont);
    
    client.end();
    
    //socket.emit('DetalleGrabadoBack', { codigofact: nCodFac }); 
    
  });
  
  socket.on('CargarCuenta', function (data) {
    
    var nCodFac;
    var cEstadoFac = '';
    var dFechaHora ='';
    var nCodTer = '';
    var nCodPer = '';
    var nTotal = 0;
    var nEntrega = 0;
    var nCambio = 0;
    var cCuenta = data.cuenta;
    
    console.log(data.cuenta);
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("SELECT * FROM facturas WHERE Sesion=1 and Nombre='" + cCuenta + "' ORDER BY CodFac DESC", //ORDER BY CodFac DESC LIMIT 1
          
      function getCodFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);            
        if (results.length > 0) {          
          console.log('Codigo Factura: ' + results[0].CodFac);
          nCodFac = results[0].CodFac;
          cEstadoFac = results[0].Estado;
          dFechaHora = results[0].FechaHora;
          nCodPer = results[0].CodPersOpen;
          nCodTer = results[0].CodTermOpen;
          nTotal = results[0].TotalFac;
          nEntrega = results[0].Cantidad;
          nCambio = results[0].Cambio;
        }else{          
          nCodFac = -1;
          console.log('Factura no encontrada');
        }
        client.end();
        
        socket.emit('CargarCuentaBack', { codigofact: nCodFac , estado: cEstadoFac , fechahora: dFechaHora , codper: nCodPer , codter: nCodTer , total:nTotal , entrega:nEntrega , cambio:nCambio });
        
      });
    
  });
  
  socket.on('CargarDatosFact', function (data) {
    
    var nCodFac = data.codigofact;
    console.log('Codigo factura: ' + nCodFac);
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306',  */    
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("SELECT * FROM detafact WHERE CodFac=" + nCodFac,
          
      function getDetFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        console.log("Number of rows: "+results.length);
        console.log(JSON.stringify(results));
        client.end();
        
        socket.emit('CargarDetaFactBack', JSON.stringify(results) );
        
      });    
    
  });
  
  socket.on('SalvarCabezeraFact', function (data) {
    
    var nCodFac = data.codigofact;
    var cEstado = data.estado;
    var nTotal = data.total;
    var nEntrega = data.entrega;
    var nCambio = data.cambio;
    
    console.log('Codigo factura: ' + nCodFac);
    console.log('Estado: ' + cEstado);
    console.log('Total: ' + nTotal);    
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');
    
    client.query("UPDATE facturas SET Estado = '" + cEstado + "' , TotalFac = " + nTotal + " , Cantidad = " + nEntrega + " , Cambio = " + nCambio + " WHERE CodFac=" + nCodFac,
          
      function UpdateFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        
        client.end();
        
        socket.emit('SalvarCabezeraFactBack', {estado:cEstado} );
        
      });
    
  });
  
  socket.on('SalvarCambiosFact', function (data) {
    var nCodFac = data.codifact;
    console.log('Codigo factura: ' + nCodFac);
    
    var client = mysql.createConnection({
      
      user: 'root',
      password: 'charly',
      host: '',
      port: '3306',
      
      /*user: 'b8173383f00cf9',
      password: 'eef44ffc',
      host: 'us-cdbr-east-04.cleardb.com',
      port: '3306', */     
      
    }); 
    client.query('USE datosnuevos');
    //client.query('USE heroku_d6062326996f9df');    
    
    client.query("DELETE FROM DetaFact WHERE CodFac=" + nCodFac,
          
      function DelDetFac(err, results, fields) { 
        if (err) {
          console.log("Error: " + err.message);
          throw err;
        } 
        
        client.end();
        
        socket.emit('SalvarCambiosFactBack', {codifact:nCodFac} );
        
      });
    
  });

});