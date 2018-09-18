var ConfigObject = function() {
	var self = this;
	
	this.JobTypes = {
		Cargo:"Cargo" // More later?
	}
	// Type []
	this.JobInfo = [{
		Coord:{x:678.129, y:-886.667, z:23.462}, 
		TrainCoord:{x:669.317, y:-885.729, z:22.47},
		Type:self.JobTypes.Cargo, TrainID: 23,
		WayPoints: [[-444.937,5372.586,81.689],[-21.719,6240.71,32.275],[2611.004,1658.612,28.113]],
		WayPointsFinished: [],
		Markers: []
	}];
	this.MarkerInfo = {
		MarkerType: 1,
		DrawDistance: 100.0,
		MarkerSize: {x:1.5,y:1.5,z:1.0},
		BlipSprite:79,
		EnterExitDelay:0,
		EnterExitDelayMax:600,
		MarkerColor: {r : 0, g : 255, b : 0}
	}
	
	this.ObjectiveInfo = {
		MarkerType: 1,
		DrawDistance: 100.0,
		MarkerSize: {x:5,y:5,z:5.0},
		BlipSprite:79,
		EnterExitDelay:0,
		EnterExitDelayMax:600,
		MarkerColor: {r : 0, g : 255, b : 0}
	}
	
	this.Markers = []; // Both Client and server will fill this up. Client will contain pos etc, server will contain amount of trains etc
	this.ObjectiveActive = false;
	this.ObjectiveCount = 0;
	this.ObjectiveCountMax = 1;
	
	this.debugMode = true;
}

var Config = new ConfigObject();