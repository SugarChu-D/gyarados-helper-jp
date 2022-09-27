// Stat = floor(floor((2 * B + I + E) * L / 100 + 5) * N)

// Math.floor()

var stats = {
	cyndaquil: [39, 52, 43, 60, 50, 65],
	magikarp: [20, 10, 55, 15, 20, 80],
	gyarados: [95, 125, 79, 60, 100, 81]
}

var names = ['HP', 'Attack', 'Defense', 'Sp.Atk', 'Sp.Def', 'Speed']

var evs = {
	gyarados: {
		'53': [2, 3, 1, 6, 3, 20],	
		'55': [5, 9, 6, 8, 8, 25],
		'56': [5, 13, 14, 11, 8, 32],
		'56': [5, 13, 14, 11, 8, 32],
		'57': [6, 16, 22, 19, 8, 38],
		'58': [6, 30, 23, 22, 9, 58],
		'59': [8, 41, 24, 24, 11, 60],
		'60': [10, 43, 25, 34, 11, 65]
	}
}

function flailHP(hp) {
	return `<b>200: </b> ${Math.floor(hp/32)} | <b>150:</b> ${Math.floor(hp*3/32)} | <b>100:</b> ${Math.floor(hp*13/64)} | <b> 80: </b> ${Math.floor(hp*11/32)}`
}

function parseStat(stat, base, level, nat, hp) {
	if (stat == NaN) return undefined

	let results = {"0.9": [-1, -1], "1": [-1, -1], "1.1": [-1, -1]}
	let ev = 0
	let found = false

	for (var n = (nat == -1) ? 0.9 : nat; n < 1.2 && n != nat; n += 0.1) {
		for (var iv = 0; iv < 32; iv++) {
			var calcStat = hp ? Math.floor((2 * base + iv + ev) * level / 100.0 + level + 10): Math.floor(Math.floor((2 * base + iv + ev) * level / 100.0 + 5) * n)

			if (Math.abs(calcStat) == stat) {
				results[n.toString()][0 | results[n.toString()][0] != -1] = iv
				found = true
			}
		}
	}	
	return found ? results : undefined
}

function parseSyntax(data, stat, level, name) {
	var s = ''
	for (var i = 0.9; i < 1.2; i += 0.1) {
		var append = i == 1.1 ? '' : '/'

		if (data[i][0] == -1) {
			s += 'x' + append
		}
		else {
			if (data[i][1] == -1) {
				s += `${data[i][0]}+` + append 
			}
			else {
				s += `${data[i][0]}–${data[i][1]}` + append 
			}

		}

	}
	return `${name}: ${s} <br>`
}

function parseHTML() {
	for (let [name, mon] of Object.entries(stats)) {
		var output = ''
		var spans = Array.from(document.querySelectorAll(`.${name.toString()} input`).entries())
		var level = parseInt(document.getElementById("level").value)

		for (var i = 2; i < 7; i++) {
			if (spans[i] == undefined) {
				continue 
			}

			res = parseStat(parseInt(spans[i][1].value), mon[i-1], level, -1, i==0)
			if (res != undefined) {
				output += parseSyntax(res, spans[i][1].value, level, names[i-1])
			}
			if (!Number.isNaN(parseInt(spans[0][1].value))) {
				document.getElementById("flail").innerHTML = flailHP(parseInt(spans[0][1].value));
			}
		}
		document.getElementById("results").innerHTML = output;
	}
}


window.onload = function() {
	document.getElementById("level").addEventListener('oninput', parseHTML(false));
}

function liveTB(hp, spdef) {
	if (hp == 220) {
		return spdef >= 116
	}
	else if (hp >= 221 && hp <= 222) {
		return spdef >= 115
	}
	else if (hp >= 223 && hp <= 225) {
		return spdef >= 114
	}
	else if (hp == 226) {
		return spdef >= 113
	}
	else if (hp <= 228) {
		return spdef >= 112
	}
	else if (hp <= 231) {
		return spdef >= 111
	}
	else if (hp == 232) {
		return spdef >= 110
	}
	else if (hp == 233) {
		return spdef >= 109
	}
	else if (hp == 235) {
		return spdef >= 108
	}
	return false
}

function leadSnorlax(hp, def) {
	if (hp == 223) {
		return def >= 86
	}
	else if (hp == 225) {
		return def >= 85
	}
	else if (hp == 228) {
		return def >= 84
	}
	else if (hp == 231) {
		return def >= 83
	}
	else if (hp == 234) {
		return def >= 82
	}
	return false
}

function troll(def, spdef) {
	var trolls = [[70, 103], [71, 104], [72, 105], [72, 106], [73, 107], [74, 108], [74, 109], [75, 110], [76, 111], [76, 112], [77, 113], [78, 114], [78, 115], [79, 116], [79, 117], [80, 117], [81, 118], [81, 119], [82, 120], [82, 121], [83, 122], [83, 124], [84, 122], [85, 124], [85, 125], [86, 126], [87, 126], [88, 127], [88, 128], [88, 129], [88, 130]]
	for (var i = 0; i < trolls.length; i++) {
		if (spdef == trolls[i][1] && def >= trolls[i][0]) {
			return true;
		}
	}
	return false;
}


function goodHP(gyaraHP, snorlaxHP) {
	var t = false
	if (gyaraHP <= 119) {
		if (snorlaxHP <= 224 && snorlaxHP >= 222) 
			t = gyaraHP >= 114

		if (snorlaxHP <= 227 && snorlaxHP >= 225)
			t = gyaraHP >= 108

		if (snorlaxHP <= 230 && snorlaxHP >= 228) 
			t = gyaraHP >= 102


		if (snorlaxHP <= 233 && snorlaxHP >= 231) 
			t = gyaraHP >= 96


		if (snorlaxHP >= 234)
			t = gyaraHP >= 90
	}
	return t
}

function red() {
	var gyaraHP = parseInt(document.getElementById("gyara_hp").value)
	var gyaraMaxHP = parseInt(document.getElementById("gyara_max_hp").value)

	var snorlaxHP = parseInt(document.getElementById("snorlax_hp").value)
	var snorlaxDef = parseInt(document.getElementById("snorlax_def").value)
	var snorlaxSpdef = parseInt(document.getElementById("snorlax_spdef").value)

	var goodDef = leadSnorlax(snorlaxHP, snorlaxDef)
	var case3 = Math.floor(gyaraHP / 3.0) + Math.floor(snorlaxHP / 3.0) >= 141
	var case4 = Math.floor(gyaraMaxHP / 3.0) + Math.floor(snorlaxHP / 3.0) >= 157
	var case5 = Math.floor(gyaraMaxHP / 6.0) + Math.floor(2*snorlaxHP / 3.0) >= 186

	var isTroll = troll(snorlaxDef, snorlaxSpdef)

	var output = ''

	if (gyaraHP <= 80) {
		output += "Heal Gyarados to 117+ </br> </br>"
	}

	if (liveTB(snorlaxHP, snorlaxSpdef)) {
		if (goodDef) {
			if (case4) {
				output += "Heal Gyarados to full </br>"
				output += "Lead Snorlax, switch to Gyarados </br>" 
				output += "Send out Snorlax, switch to Kenya </br>"
				output += "Send out Snorlax, Max Revive Gyarados </br>"
				output += "Die, get Blastoise </br>"
			}
			else if (!case4) {
				if (case3) {
					output += "Lead Snorlax, switch to Gyarados </br>"
					output += "Send out Sentret, Max Revive Gyarados </br"
					output += "Send out Gyarados, switch to Quilava </br>"
					output += "Send out Snorlax, Giga Imact </br>"
				}
				else if (!case3) {
					output += "Lead Snorlax, switch to Gyarados. </br>"
					output += "Send out Snorlax, Max Revive Gyarados </br>"
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Send out Snorlax. Die, get Blastoise </br>"
				}
			}
		}
		else if (!goodDef) {
			output += "Lead Gyarados, let it die, send out Snorlax </br> </br>"

			output += "If Thunderbolt: </br>"
			if (case3) {
				if (case4) {
					output += "Switch to Kenya, send out Snorlax + Max Revive Gyarados </br>"
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Send out Snorlax, die, get Blastoise </br>"
				}
				else if (!case4) {
					if (isTroll) {
						output += "Switch to Kenya, send out Snorlax + switch to Quilava </br>"
						output += "Send out Snorlax + Max Revive Gyarados </br>"
						output += "Send out Sentret + Max Revive Snorlax </br>"
						output += "Send out Snorlax + die </br>"
					}
					else {
						output += "Revive Gyarados </br>"
						output += "Send out Sentret, Max Revive Snorlax </br>"
						if (!case5) {
							output += "Send out Snorlax, switch to Quilava </br>"
						}
						output += "Send out Snorlax, switch to Gyarados </br>"
						output += "Send out Snorlax, Crunch </br>"
						output += "Max Revive Gyarados </br>"
						}
					}
				}
			else if (!case3) { 
				if (isTroll) {
					output += "Switch to Kenya, send out Snorlax + switch to Quilava </br>"
					output += "Send out Snorlax + Max Revive Gyarados </br>"
					output += "Send out Sentret + Max Revive Snorlax </br>"
					output += "Send out Snorlax + die </br>"
				}
				else {
					output += "Revive Gyarados </br>"
					if (!case5) {
							output += "Send out Snorlax, switch to Quilava </br>"
					}
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Send out Snorlax, switch to Gyarados </br>"
					output += "Send out Snorlax, use Crunch </br>"
					output += "Send out Sentret, Max Revive Gyarados </br>"
				}
			}
			output += "</br> </br>"

			output += "If Volt Tackle: </br>"
			if (case3) {
				if (!case4) {
					output += "Max Revive Gyarados </br>"
					output += "Send out Gyarados + X Speed (if 21+/x/x) + Waterfall </br>"
				}
				else if (case4) {
					output += "Switch to Kenya, send out Snorlax + Max Revive Gyarados </br>"
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Send out Snorlax, die, get Blastoise </br>"
				}
			}
	 		else if (!case3) {
	 			if (gyaraHP >= 118 && goodHP(Math.floor(gyaraMaxHP/2), snorlaxHP)) {
					output += "Max Revive Gyarados </br>"
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Send out Snorlax, die, get Blastoise </br>"
	 			}
	 			else {
					output += "Max Revive Gyarados </br>"
					output += "Send out Sentret, Max Revive Snorlax </br>"
					output += "Gyara was too low HP: Send out Snorlax, switch to Quilava"
					output += "Send out Snorlax, die, get Blastoise </br>"
	 			}
	 		}

		}

	}
	else {
		output = "Snorlax can't live TB. </br>"
		if (!goodDef) {
			output += "Snorlax has bad defense. Lead Gyarados, swap to Snorlax. </br>"
			output += "Max Revive Snorlax + Giga Impact <br>"
		}

	}
	document.getElementById("red_strats").innerHTML = output;

}