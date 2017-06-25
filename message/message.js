let g_errorMsg = require('./core/error.json')
let g_warningMsg = require('./core/warning.json')
let g_successMsg = require('./core/success.json')
let g_systemMsg = require('./core/system.json')

const UNKNOWN = '9999'
const TYPE_ERROR = '9000'
const SUCCESS = '0001'

function Message() {}

// ========== Static Method  ==========
// ====================================
Message.success = function(code) {

  if (typeof(code) !== 'string')
    code = TYPE_ERROR

  return send(code)
}

Message.error = function(code) {

	if (typeof(code) !== 'string')
		code = TYPE_ERROR

	return send(code)
}

Message.warning = function(code) {

	if (typeof(code) !== 'string')
		code = TYPE_ERROR

	return send(code)
}

Message.getResponse = function(target, code = null) {

	if (typeof(target) !== 'object') {
		code = TYPE_ERROR
		return send(code)
	}

	if (target.hasOwnProperty('status') !== false)
		return target

	return send(target, code)
}

function send(target, code = null) {

	if (typeof(target) === 'string') {
		code = target
	}

	let level = parseInt(code)/1000 | 0
	let msg = {}, err

	//console.log(`code: ${typeof(code)}, target: ${typeof(target)}, level: ${level}`)
	switch(level) {
		case 9: // system
			msg['status'] = g_systemMsg[code]
		break
		case 4: // error
			msg['status'] = g_errorMsg[code]
		break
		case 2: // warning
			msg['status'] = g_warningMsg[code]
		break
		case 0: // success
			if (typeof(target) === 'object' &&
					typeof(code) === 'string') {
			msg['status'] = g_successMsg[code]
			msg = extend({}, target, msg)
		}
		else if (typeof(target) === 'object') {
			msg['status'] = g_successMsg[SUCCESS]
			msg = extend({}, target, msg)
		}
		else {
			msg['status'] = g_successMsg[code] || g_successMsg[SUCCESS]
		}
		break
		default:
			break
	}

	if (msg['status'] == null) {
		msg['status'] = g_systemMsg[UNKNOWN]
	}

	return msg
}

function extend(target) {

	let sources = [].slice.call(arguments, 1);
	sources.forEach(function (source) {
		for (let prop in source) {
			target[prop] = source[prop];
		}
	});
	return target;
}

module.exports = Message
