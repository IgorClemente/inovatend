/**
 * Created by root on 17/10/17.
 */

module.exports = function(req,res,next) {

    var mysql = require('mysql');

    var poolCon = mysql.createPool({
        connectionLimit: 5,
        host: 'us-cdbr-sl-dfw-01.cleardb.net',
        user: 'bfa33d68adf0e0',
        connectionEnqueue: true,
        password: '43fcef0e',
        database: 'ibmx_c5c727acd1722b7',
        multipleStatements: true
    });

    return poolCon;
}