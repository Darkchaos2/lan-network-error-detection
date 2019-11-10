const OBSWebSocket = require('obs-websocket-js');
var ping = require('ping');
 
const obs = new OBSWebSocket();

obs.connect({
	address: 'localhost:4444',
	password: ''
});

maxTimeout = 5;
currentTimeout = 0;
    
function testConnection() {
	ping.sys.probe("192.168.0.25", function(isAlive) {
		if(isAlive) {
	        console.log(`Alive ${currentTimeout != 0 ? currentTimeout : ""}`);

	    	if(currentTimeout > 0) {
	    		currentTimeout--;
	    	}
	    	else if(currentTimeout == 0) {
	    		obs.send('SetSceneItemProperties', { 'item': "LAN Down", 'visible': false })
	    		.catch(err => console.log(err));
	    	}
		}
		else {
	        console.log (`Not alive. Timeout: ${currentTimeout}`);

		    if(currentTimeout < maxTimeout) {
	    		currentTimeout++;
		    }
		    else if(currentTimeout == maxTimeout) {
			    obs.send('SetSceneItemProperties', { 'item': "LAN Down", 'visible': true })
			    .catch(err => console.log(err));
			}
		}
    });
	
	setTimeout(() => { testConnection(); }, 1000)
}

testConnection();