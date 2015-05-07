/*
 *This file is part of flow2dhis2. The purpose if the program is to send data collected using Akvo FLOW to a DHIS2 instance
 *Copyright (C) 2015 Tohouri.com
 *flow2dhis2 is free software: you can redistribute it and modify it under the terms of the GNU Affero General Public License (AGPL) as published by the Free Software Foundation, either version 3 of the License or any later version.
 *flow2dhis2 is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License included below for more details.
 *ßThe license can also be seen at http://www.gnu.org/licenses/agpl.html.
 */

var crypto = require('crypto');
var http = require('http');
var qs = require("querystring");

function requestflowapi(query, postdata, callback) {

	query = query || '';
	var POST = qs.parse(postdata);
	var access_key = POST.access_key;
	var secret_key = POST.secret;
	var url = POST.flow_url;
	var resource = POST.resource;
	var path = '';
	path = "/api/v1/" + resource;
	if (query !== '') {
		path = "/api/v1/" + resource + '?' + query;
	}
	console.log("authentication module was called...");
	console.log("access_key: " + access_key + " secret_key: " + secret_key + " url: " + url + " path: " + path);

	function generateSignature(string_to_sign, shared_secret) {
		var hmac = crypto.createHmac('sha1', shared_secret);
		return hmac.update(string_to_sign).digest('base64');
	}

	var d = Math.floor(new Date() / 1000);
	var payload = "GET\n" + d + "\n" + "/api/v1/" + resource;
	var signature = generateSignature(payload, secret_key);

	var options = {
		host: url,
		port: 80,
		path: path,
		method: "GET",
		headers: {
			"Date": d,
			"Authorization": access_key + ":" + signature
		}
	};
	var request = http.request(options, function(response) {
		var body = "";
		console.log('STATUS: ' + response.statusCode);
		console.log('HEADERS: ' + JSON.stringify(response.headers));
		response.setEncoding('utf8');
		response.on('data', function(chunk) {
			body += chunk;
			//console.log('receiving chunk: ' + JSON.stringify(body));
		});

		response.on('end', function() {
			callback(body);
			//return( this );
		});
	}).on('error', function(e) {
		console.log("There was an error while connecting Flow API, please read following message: " + e.message);
	});
	request.end();
}

exports.requestflowapi = requestflowapi;