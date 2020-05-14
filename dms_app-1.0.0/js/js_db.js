

var db = openDatabase('db_dms_forms', '1.0', 'DB for DMS App Forms', 30 * 1024 * 1024);

db.transaction(function(cmd){
    
    var vFlag = 0;
    cmd.executeSql('CREATE TABLE IF NOT EXISTS users (id unique, pwd, name, phone, email, job_title, status, login, type, id_dms, license, id_pdv_dlr)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS params (id unique, dvalue)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_kmtrs (user, fech, lat1, lng1, kmtr)');      
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_forms (id unique, desc, type, version, dtos, scripts, udt_dt)');      
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_forms_filled (id_form, dtos, date, status, lat, lng)'); 
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_files (id_file, correl, name, type, strdtos)'); 
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_ventas(particion, anomes, id_dms, producto, unidad, meta, monto)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_nodos(nodo, coordenadas)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_horus_marcas_esp(LATITUD,LONGITUD,ID_PDV,FECHA_COMPLETA,USUARIO,NUMERO_CLIENTE,ESTADO_PAGO,METODO_PAGO,MONTO_PAGO )');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_plan_dms(aniomes, semana_anio, usuario, cod_empleado_dms, circuit, nombre_circuito, id_pdv, nombre_pdv, dias_semana, ymd_dia, monto_credito)');    
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_ficha_pdv(id_pdv unique, nombre_pdv, duenio, dir, mbl_epin, mbl_tmy, segmento_pop)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_visitas_pdv(id_pdv, fecha_ymd, usuario)');
    cmd.executeSql('CREATE TABLE IF NOT EXISTS tbl_ejec_sucursales(anomes, id_dealer, nombre_dealer, id_sucursal, nombre_sucursal, producto, ejecucion, meta, res, unidad)');

    db.transaction(function(cmd){   
        cmd.executeSql('SELECT * FROM users where id =?', ['admin'], function (cmd, results) {
            var len = results.rows.length, i;
            for (i = 0; i < len; i++) {
                //alert(results.rows.item(i).id);
                vFlag = 1;
            }
            if(vFlag == 0){
                cmd.executeSql('INSERT INTO users (id, pwd, name, phone, email, job_title, status,login,type, id_dms, license) VALUES (?,?,?,?,?,?,?,?,?,?,?)', ['admin','admin123', 'Administrador', '99999999','NA', 'NA', 1,0,'admin', 9, 99999999]); 
                cmd.executeSql('INSERT INTO params (id, dvalue) VALUES (?,?)', [1,30000]); 
            }
        //cmd.executeSql('INSERT INTO kpi_data_zonas_hist (id,zona, cnl, sub_cnl, ejecutado,forecast,budget,fecha,year,month,unit) VALUES (?,?,?,?,?,?,?,?,?,?,?)', ['1101','0', '1', '1','152325','15262','15626','20170502','2017','5','UND']);
        });
    });
    
});

function ejecutaSQL(vQuery, vFlag){
    db.transaction(function(cmd){              
            //console.log(vQuery);
            cmd.executeSql(vQuery, [], function(){ 

            },function(e){
                //alert('e');
                console.log('Error' + e.error);
                console.log(e);
                //window.plugins.toast.show('Error..', 1000, 'bottom');
            });
    });
}

function logInOut(vUser, vTipe){
    db.transaction(function(cmd){   
        cmd.executeSql('UPDATE users SET login=? where id=?', [vTipe, vUser]);
    });
}

function getIdSMS(vArrS)
{
    db.transaction(function(cmd){   
        cmd.executeSql("SELECT idsms FROM controlSMS where id=100", [], function (cmd, results) {
            if(results.rows.length>0){
                //window.plugins.toast.show(results.rows.length, 3000, 'bottom'); 
                vIdSMS = results.rows.item(0).idsms;
                administraDB(vArrS);
            }
        });
    });
}

function showUsers(){
    db.transaction(function(cmd){   
        cmd.executeSql('SELECT * FROM users', [], function (cmd, results) {
            var len = results.rows.length, i;

            if(len>0){
                //alert(len);
                for (i = 0; i < len; i++) {
                    //alert(results.rows.item(i).login);
                    alert(results.rows.item(i).id + '/Status:' + results.rows.item(i).status + '/LOG:' + results.rows.item(i).login + '/PWD:' + results.rows.item(i).pwd);                       
                    //alert(results.rows.item(i).id);          
                }
            }
        });
    });
}

// Funcion para eliminar data his
function deleteKPI(vFecha, vKPI){
    if(parseInt(vKPI) != 0){        
        db.transaction(function(cmd){   
            cmd.executeSql("delete from kpi_data_territorio where fecha < ? and id = ?", [vFecha, vKPI]);
            //cmd.executeSql("delete from kpi_data_canal where fecha < ? and id = ?", [vFecha, vKPI]);
        });
    }else{        
        db.transaction(function(cmd){   
            cmd.executeSql("delete from kpi_data_territorio where fecha < ?", [vFecha]);
            //cmd.executeSql("delete from kpi_data_canal where fecha < ?", [vFecha]);
            cmd.executeSql("delete from kpi_data_zonas where fecha < ?", [vFecha]);
            cmd.executeSql("delete from kpi_data_zonas_hist where fecha < ?", [vFecha]);
        });
    }
}