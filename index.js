/**
 *
 *
 * Author: Saad Irfan
 * GitHub: msaaddev
 * Twitter: https://twitter.com/msaaddev
 */

const { exec } = require('child_process')
const handleError = require('node-cli-handle-error')
const iconv = require('iconv-lite')
const jschardet = require('jschardet')

function fixEncoding (str) {
	const detected = jschardet.detect(str)
	if(!detected.encoding) {
		return str
	}
	return iconv.decode(str, detected.encoding)
}

/**
 *
 *
 * @param {cmd} - commands to run
 * @returns {Promise} - a promise that runs the command
 */
async function promise (cmd) {
	return new Promise((resolve, reject) => {
		exec(cmd, { encoding: 'buffer' }, (error, stdout, stderr) => {
			if (error) {
				handleError(error)
				const detected = jschardet.detect(stderr)
				reject({
					error,
					stderr: fixEncoding(stderr)
				})
			}
			resolve({ stdout: fixEncoding(stdout) })
		})
	})
}

module.exports = async (opt = {}) => {
	const defaultOptions = {
		path: ``,
		cmd: ``
	}

	const options = { ...defaultOptions, ...opt }

	const {
		path,
		cmd
	} = options

	// changes directory if a path exists
	path !== `` ? process.chdir(path) : null

	// checks if there is one command or array of commands
	if (typeof cmd !== 'object') {
		return promise(cmd)
	} else {
		for (let i = 0; i < cmd.length; i++) {
			await promise(cmd[i])

			let j = i + 1
			if (j === cmd.length) {
				return new Promise((resolve, reject) => {
					resolve()
				})
			}
		}
	}
}
