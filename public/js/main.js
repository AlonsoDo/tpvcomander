function CargarGrupos(data) {
    
    $('#ConteinerBotones').html('');
    
    var dataJson = eval(data);
    for(var j in dataJson){
        
	var cCodigo = dataJson[j].Codigo;
	var cNombre = dataJson[j].Nombre;
	
        var $btGrupos= $('<input/>')
            .attr({ type:'button' , name:'bt'+cNombre , value:cNombre })
            .addClass('botonesgrupos')
            .bind('click', { codigo: cCodigo }, function(event) {
                var data = event.data;                
                socket.emit('CargarArticulos', { codigogrupo: data.codigo });                
            });
        $('#ConteinerBotones').append($btGrupos);        
        
    }
    if (lFactCargada) {
	$('#ConteinerBotones').append('<label for="EditFac" style="float:left; margin-top:20px; margin-left:20px; color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">' + 'Hay modificaciones en la factura. Pulse boton -Salvar- para guardar los cambios.' + '</label>'); 				    
	$('#btOpciones').val('Salvar');
    }
    $('#ConteinerBotones').show();    
}

var nCodigoDetalle = 0;

function CargarArticulos(data) {
    
    $('#ConteinerBotones').html('');
    
    var $btDetalle = $btArticulos = $('<input/>')
        .attr({ type:'button' , name:'btDetalle' , value:'Detalle' })
        .addClass('botondetalle')
        .bind('click',{},function(event) {
            if (nCodigoDetalle!='0') {
                socket.emit('CargarDetalle', { codigodetalle: nCodigoDetalle });   
            }else{
                $('#Dialogo-Informacion').html(
					'<div id="Dialogo-Informacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">No hay detalle.</p>' +
					'</div>'
                );
                $('#Dialogo-Informacion').dialog('open');                                      
            }
        });        
        
    $('#ConteinerBotones').append($btDetalle); 
    
    var dataJson = eval(data);
    for(var j in dataJson){
        
	var cCodigo = dataJson[j].CodArt;
	var cNombre = dataJson[j].Nombre;
        var cPrecio = dataJson[j].Precio;
        var lImpEnFac = dataJson[j].ImpEnFac;
        var cSalida = dataJson[j].Salida;
        var cTipoSalida = dataJson[j].TipoSalida;
	
        var $btArticulos = $('<input/>')
            .attr({ type:'button' , name:'bt'+cNombre , value:cNombre })
            .addClass('botonesarticulos')
            .bind('click', { codigo: cCodigo , nombre: cNombre , precio: cPrecio , impenfac: lImpEnFac , salida: cSalida , tiposalida: cTipoSalida }, function(event) {
                var datos = event.data;
                IncluirArticulo(datos.codigo,datos.nombre,datos.precio,datos.impenfac,datos.salida,datos.tiposalida);
            });
        $('#ConteinerBotones').append($btArticulos);        
        
    }
    if (lFactCargada) {
	$('#ConteinerBotones').append('<label for="EditFac" style="float:left; margin-top:20px; margin-left:20px; color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">' + 'Hay modificaciones en la factura. Pulse boton -Salvar- para guardar los cambios.' + '</label>'); 				    
	$('#btOpciones').val('Salvar');
    }
    
}

function CargarDetalle(data) {
    
    var nCont = 0;
    
    var dataJson = eval(data);
    
    for(var j in dataJson){
        nCont = nCont + 1;
    }    
    
    if (nCont>0){
        $('#ConteinerBotones').html('');
        $('#ConteinerBotones').append('<table id="TablaDetalles">' +
                                        '<tr>' +
                                            '<td id="containerbotonesdetalle" class="paneles" style="width:842px; height:400px;">' +
                                            '</td>' +
                                        '</tr>' +
                                        '<tr>' +
                                            '<td id="containerdetallearticulo" class="paneles" style="width:842px; height:100px;">' +
                                                '<input id="tbdetallearticulo" class="txtgrande" style="margin-right:4px; width:530px; font-size:24px;" type="Text" Value="detalle">' + 
                                                '<input id="tbdetallearticulototal" class="txtgrande" style="margin-right:4px; width:100px;" type="Text" Value="0.00">' + 
                                                '<input id="btdetalleresect" class="botondetallestatus" type="button" value="Reset">' +								    
                                                '<input id="btdetalleok" class="botondetallestatus" type="button" value="Confirmar">' +                                                				
                                            '</td>' +
                                        '</tr>' +
                                      '</table>');
        $('#btdetalleok').click(function(event) {
		GrabarDetalle();
	    });
        
        $('#btdetalleresect').click(function(event) {
		$('#tbdetallearticulo').val('detalle');
                $('#tbdetallearticulototal').val('0.00');
	    });
        
        for(var j in dataJson){
            
            var cNombre = dataJson[j].Nombre;
            var nCodArt = dataJson[j].CodArt;
            var nPrecio = dataJson[j].Precio;            
            
            var $btDetalle = $('<input/>')
                .attr({ type:'button' , name:'btDet'+cNombre , value:cNombre })
                .addClass('botonesdetalles')
                .bind('click', { codigo: nCodArt , nombre: cNombre , precio: nPrecio }, function(event) {
                    
                    var datos = event.data;
                    var cLine = $('#tbdetallearticulo').val();
                    var nPrecioDetalle = parseFloat($('#tbdetallearticulototal').val());
                    if (cLine=='detalle'){
                        cLine = '';
                        $('#tbdetallearticulototal').val('0');
                        nPrecioDetalle = 0;
                    }
                    cLine = cLine + ' / ' + datos.nombre;
                    $('#tbdetallearticulo').val(cLine);
                    nPrecioDetalle = nPrecioDetalle + datos.precio;
                    $('#tbdetallearticulototal').val(nPrecioDetalle.toFixed(2));                    
                    
            });
            $('#containerbotonesdetalle').append($btDetalle);             
            
        }        
    }else{
        
        $('#Dialogo-Informacion').html(
					'<div id="Dialogo-Informacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">No hay detalle.</p>' +
					'</div>'
	);
        $('#Dialogo-Informacion').dialog('open');        
        
    }
    if (lFactCargada) {
	$('#containerbotonesdetalle').append('<label for="EditFac" style="float:left; margin-top:20px; margin-left:20px; color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">' + 'Hay modificaciones en la factura. Pulse boton -Salvar- para guardar los cambios.' + '</label>'); 				    
	$('#btOpciones').val('Salvar');
    }
}

function GrabarDetalle() {
    
    var tbdescripcion = $('#tbDescripcion').val();
    var tbprecio = parseFloat($('#tbPrecio').val());
    var tbdetallearticulototal = parseFloat($('#tbdetallearticulototal').val());
    var fTotalArt = tbprecio + tbdetallearticulototal;
    var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
    var rowSelData = $('#list').jqGrid('getRowData',selRowId);
    var nIndexSel = rowSelData['id'];
    var NuevaDescripcion = rowSelData['Nombre']+$('#tbdetallearticulo').val();
        
    if ($('#tbdetallearticulo').val()!='detalle') {
            
        $("#list").jqGrid('setRowData',nIndexSel,{Descripcion:NuevaDescripcion});
        
        $('#tbDescripcion').val(tbdescripcion+' (*) ');
        $('#tbPrecio').val(fTotalArt.toFixed(2));
        
        $("#list").jqGrid('setRowData',nIndexSel,{Precio:fTotalArt.toFixed(2)});
        
        CalcularTotal();
        
        $('#btdetalleok').hide();
        $('#btdetalleresect').hide();
        
        $('#tbdetallearticulo').css('width',700);
        $('#containerbotonesdetalle').html('');
	if (lFactCargada) {
	    $('#containerbotonesdetalle').append('<label for="EditFac" style="float:left; margin-top:20px; margin-left:20px; color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">' + 'Hay modificaciones en la factura. Pulse boton -Salvar- para guardar los cambios.' + '</label>'); 				    
	    $('#btOpciones').val('Salvar');
	}
        
        $('#Dialogo-Informacion').html(
					'<div id="Dialogo-Informacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">Detalle grabado.</p>' +
					'</div>'
	);
        $('#Dialogo-Informacion').dialog('open');
    
    }else{
        
        $('#Dialogo-Informacion').html(
					'<div id="Dialogo-Informacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:18px;">Ninguna accion.</p>' +
					'</div>'
	);
        $('#Dialogo-Informacion').dialog('open');
       
    }
    
}

var nControlRow = 0;

function IncluirArticulo(nCodigo,cNombre,nPrecio,lImpEnFac,cSalida,cTipoSalida){
    
    $('#tbUni').val('1');
    $('#tbPor').val('X');
    $('#tbDescripcion').val(cNombre);
    
    var nFormatDecPrecio = nPrecio;
    nPrecio = nFormatDecPrecio.toFixed(2);
    
    $('#tbPrecio').val(nPrecio);
    
    jQuery("#list").jqGrid('addRowData',nControlRow,{id:nControlRow,Uni:"1",Descripcion:cNombre,CodArt:nCodigo,Nombre:cNombre,Precio:nPrecio,ImpEnFac:lImpEnFac,Salida:cSalida,TipoSalida:cTipoSalida}); 
    
    jQuery('#list').jqGrid('setSelection',nControlRow);
    
    nIdFila = nControlRow;
    
    nControlRow = nControlRow + 1;
    
    nCodigoDetalle = nCodigo;
    
    CalcularTotal();      
    
}

var nIdFila = 0;

function CargarGrid() {
    
    jQuery("#list").jqGrid({
	datatype: "local",
	height: 392,
        width:245,
   	colModel:[
                {name:'id',index:'id',sorttype:"int",width:30,sortable:true,hidden:true},
   		{name:'Uni',index:'Uni',width:30,sortable:false},   				
   		{name:'Descripcion',index:'Descripcion',width:180,sortable:false},
                {name:'CodArt',index:'CodArt',width:30,sortable:false,hidden:true},
                {name:'Nombre',index:'Nombre',width:30,sortable:false,hidden:true},
                {name:'Precio',index:'Precio',width:30,sortable:false,hidden:true},
                {name:'ImpEnFac',index:'ImpEnFac',width:30,sortable:false,hidden:true},
                {name:'Salida',index:'Salida',width:30,sortable:false,hidden:true},
                {name:'TipoSalida',index:'TipoSalida',width:30,sortable:false,hidden:true}
   	],        
        
        onSelectRow: function(id){ 
            
            var ret = jQuery("#list").jqGrid('getRowData',id);
	    
            $('#tbUni').val(ret.Uni);
            $('#tbPor').val('X');
            $('#tbDescripcion').val(ret.Descripcion);            
            $('#tbPrecio').val(ret.Precio);
            
            nIdFila = id;
            
            nCodigoDetalle = ret.CodArt;
            
        }        
        
    });
    
}

function CalcularTotal() {
    
    nTotal = 0;
    
    var rows= jQuery("#list").jqGrid('getRowData');
    
    for(var i=0;i<rows.length;i++){
        var row=rows[i];
        nTotal = nTotal + ((Number(row['Precio'])*(Number(row['Uni']))));
    }
    
    $('#tbTotal').val(nTotal.toFixed(2));    
    
}

function AumentarUni() {
    var rowData = $('#list').jqGrid('getRowData',nIdFila);
    rowData.Uni = Number(rowData.Uni) + 1;
    $('#tbUni').val(rowData.Uni);
    $('#list').jqGrid('setRowData', nIdFila, rowData);
    CalcularTotal();
    if (lFactCargada) {
	$('#mensajehaycambios').show();
	AjustarCambio();
    }
}

function DisminuirUni(){
    var rowData = $('#list').jqGrid('getRowData',nIdFila);
    rowData.Uni = Number(rowData.Uni) - 1;
    $('#tbUni').val(rowData.Uni);
    $('#list').jqGrid('setRowData', nIdFila, rowData);
    CalcularTotal();
    if (lFactCargada) {
	$('#mensajehaycambios').show();
	AjustarCambio();
    }
}

function BorrarFila() {
    
    var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
    $('#list').jqGrid('delRowData',selRowId);
    
    var ids = $('#list').jqGrid("getDataIDs");
    if(ids && ids.length > 0){
        $('#list').jqGrid("setSelection", ids[(ids.length) -1]);
        var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
        var rowSelData = $('#list').jqGrid('getRowData',selRowId);
        nCodigoDetalle = rowSelData['CodArt'];
    }else{
        nCodigoDetalle = 0;
    }
    
    CalcularTotal();
    if (lFactCargada) {
	$('#mensajehaycambios').show();
	AjustarCambio();
    }
}

function SubirFila() {
    
    var nIndex = 0;
    var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
    var rowSelData = $('#list').jqGrid('getRowData',selRowId);
    var nIndexSel = rowSelData['id'];
    var row1,row2;
    var i1=0,i2=0;
    var tempId,row1Id,row2Id;
    
    var rows= jQuery("#list").jqGrid('getRowData');
    
    if (rows.length>1) {
        
        for(var i=0;i<rows.length;i++){
            var row=rows[i];
            nIndex = row['id'];
            if (nIndex==nIndexSel){
                i1 = i-1;
                i2 = i;                
                break;
            }        
        }
        
        if (i2>0){
            row1 = rows[i1];    
            row2 = rows[i2];            
            
            jQuery("#list").jqGrid('delRowData',row1['id']);
            jQuery("#list").jqGrid('delRowData',row2['id']);
            
            tempId = row1['id'];
            row1Id = row2['id'];
            row2Id = tempId;
            
            jQuery("#list").jqGrid('addRowData',row1Id,row1);
            jQuery("#list").jqGrid('addRowData',row2Id,row2);
            jQuery('#list').jqGrid('sortGrid', 'id', true, 'asc');
            
            jQuery('#list').jqGrid('setSelection',row2Id);            
            
        } 
                
    }   
    
}

function BajarFila() {
    
    var nIndex = 0;
    var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
    var rowSelData = $('#list').jqGrid('getRowData',selRowId);
    var nIndexSel = rowSelData['id'];
    var row1,row2;
    var i1=0,i2=0;
    var tempId,row1Id,row2Id;
    
    var rows= jQuery("#list").jqGrid('getRowData');
    
    if (rows.length>1) {
        
        for(var i=0;i<rows.length;i++){
            var row=rows[i];
            nIndex = row['id'];
            if (nIndex==nIndexSel){
                i1 = i;
                i2 = i+1;                
                break;
            }        
        }
        
        if (i2<rows.length){
            row1 = rows[i1];    
            row2 = rows[i2];            
            
            jQuery("#list").jqGrid('delRowData',row1['id']);
            jQuery("#list").jqGrid('delRowData',row2['id']);
            
            tempId = row2['id'];
            row2Id = row1['id'];
            row1Id = tempId;
            
            jQuery("#list").jqGrid('addRowData',row1Id,row1);
            jQuery("#list").jqGrid('addRowData',row2Id,row2);
            jQuery('#list').jqGrid('sortGrid', 'id', true, 'asc');
            
            jQuery('#list').jqGrid('setSelection',row1Id);            
            
        } 
                
    }   
    
}

function BotonNumerico(idBoton) {
    
    var nNumero = idBoton.substring(10);
    
    if (CualSeEdita=='Cuenta') {
        var nCuenta = $('#tbCuenta').val()+nNumero;
        if (nCuenta.length<4) {
            $('#tbCuenta').val(nCuenta);   
        }            
    }else if(CualSeEdita=='Uni') {
        var nUni = $('#tbUni').val()+nNumero;
        if (nUni.length<4) {
            $('#tbUni').val(nUni);
        }        
    }else if(CualSeEdita=='Precio') {
        var nPrecio = $('#tbPrecio').val()+nNumero;
        if (nPrecio.length<8) {
            $('#tbPrecio').val(nPrecio);
        }        
    }else if(CualSeEdita=='Entrega') {
	var nEntrega = $('#tbEntrega').val()+nNumero;
	if (nEntrega.length<8) {
            $('#tbEntrega').val(nEntrega);
        }
	if (nEntrega == '.' || nEntrega == '') {
	    nEntrega = 0;
	}
	nEntrega = parseFloat(nEntrega).toFixed(2);
	var nTotal = parseFloat($('#tbTotal').val()).toFixed(2);
	var nCambio = nEntrega - nTotal;
	nCambio = parseFloat(nCambio).toFixed(2);
	$('#tbCambio').val(nCambio);
    }
    
}

function BtCambio() {
    
    var cPrecio = $('#tbPrecio').val();
    if (cPrecio == '.' || cPrecio == '') {
	cPrecio = 0;
    }
    cPrecio = (parseFloat(cPrecio).toFixed(2));
    
    var cUni = $('#tbUni').val();
    if (cUni == '') {
        cUni = 0;
    }
    cUni = (parseInt(cUni,10));
    
    var selRowId = $('#list').jqGrid ('getGridParam', 'selrow');
    var rowSelData = $('#list').jqGrid('getRowData',selRowId);
    var nIndexSel = rowSelData['id'];    
    var NuevaDescripcion;
    
    if (CualSeEdita=='Precio') {
	NuevaDescripcion = $('#tbDescripcion').val() + ' (*) ';
    }else{
        NuevaDescripcion = $('#tbDescripcion').val();
    }
    $("#list").jqGrid('setRowData',nIndexSel,{Descripcion:NuevaDescripcion});
    $("#list").jqGrid('setRowData',nIndexSel,{Nombre:NuevaDescripcion});
    $("#list").jqGrid('setRowData',nIndexSel,{Uni:cUni});
    $("#list").jqGrid('setRowData',nIndexSel,{Precio:cPrecio});
    
    $('#tbDescripcion').val(NuevaDescripcion);
    
    CalcularTotal();
    if (lFactCargada) {
	$('#mensajehaycambios').show();
	AjustarCambio();
    }
    
}

function EnviarPedido() {
    
    var nCuenta = $('#tbCuenta').val();
    var DatosGrid = jQuery('#list').jqGrid('getRowData');					    		
    var nNumArt = DatosGrid.length;
    
    if (nCuenta=='') {
        $('#Dialogo-Informacion').html(
					'<div id="Dialogo-Informacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:28px;">Numero de cuenta vacio.</p>' +
					'</div>'
	);
        $('#Dialogo-Informacion').dialog('open');
        
    }else{
        $('#Dialogo-Confirmacion').html(
                                        '<div id="Dialogo-Confirmacion">' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:28px;">Se va ha enviar la orden de la cuenta:</p>' +
					'<p style="color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:32px;">' + nCuenta + '</p>' +
					'<p style="color:white; font-family:Arial,sans-serif; font-weight:bold; font-size:28px;">Numero de lineas:</p>' +
					'<p style="color:red; font-family:Arial,sans-serif; font-weight:bold; font-size:32px;">' + nNumArt + '</p>' +
					'</div>'
        );
        $('#Dialogo-Confirmacion').dialog({position:[240,70]});
	$('#Dialogo-Confirmacion').dialog('open');        
    }    
    
}

function EnviarPedido2() {
    
    var nCuenta = $('#tbCuenta').val();   
    
    if (nCuenta=='') {
        alert('Numero de cuenta vacio.');
    }else{
        socket.emit('EnviarPedido2', { cuenta: nCuenta });
    }    
    
}

function CargarCuenta(cCuenta) {    
    socket.emit('CargarCuenta', { cuenta: cCuenta });
}

function parse_date(dateStr) {
    var parts = String(dateStr).split(/[- :T]/);
    return parts[3] + ':' + parts[4];
}

var lFactCargada = false;

function CargarDetalleFactura(data) {
    
    jQuery('#list').jqGrid('clearGridData');
    
    var dataJson = eval(data);
    
    for(var j in dataJson){
        
	var nUni = dataJson[j].Uni;
	var cDescripcion = dataJson[j].Descripcion;
	var nCodArt = dataJson[j].CodArt;
	var cNombre = dataJson[j].Nombre;
	var nPrecio = parseFloat(dataJson[j].Importe).toFixed(2);
	var lImpEnFac = dataJson[j].ImpEnFac;
	var cNumTerImpSalida = dataJson[j].NumSalida;  //Barra,Cocina,Caja-Ter1,Ter2,etc...
	var cTipoSalida = dataJson[j].TipoSalida;      //Terminal o Impresora	
    
	jQuery("#list").jqGrid('addRowData',nControlRow,{id:nControlRow,Uni:nUni,Descripcion:cDescripcion,
					    CodArt:nCodArt,Nombre:cNombre,Precio:nPrecio,ImpEnFac:lImpEnFac,
					    Salida:cNumTerImpSalida,TipoSalida:cTipoSalida
			       });	
	
	jQuery('#list').jqGrid('setSelection',nControlRow);	
    
	nControlRow = nControlRow + 1;      
        
    }
    nIdFila = nControlRow-1;
    
    CalcularTotal();
    
    lFactCargada = true;
    
}

function SalvarCambiosFact(nCodFact){
    socket.emit('SalvarCambiosFact', { codifact: nCodFact });
}

function AjustarCambio() {
    
    var nEntrega = $('#tbEntrega').val();
    nEntrega = parseFloat(nEntrega).toFixed(2);
    var nTotal = parseFloat($('#tbTotal').val()).toFixed(2);
    var nCambio = nEntrega - nTotal;
    nCambio = parseFloat(nCambio).toFixed(2);
    $('#tbCambio').val(nCambio);
    
}
