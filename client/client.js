on('onClientMapStart', resourceName => {
    console.log('Client map started! Resource name: %s', resourceName);
});

function HelpText(text) {
    SetTextComponentFormat("STRING");
    AddTextComponentString(text);
    DisplayHelpTextFromStringLabel(0, 0, 0, -1);
}

Config.Markers = [];
for (var i = 0; i < Config.JobInfo.length; i++) {
    var jobInfo = Config.JobInfo[i];
    var blip = AddBlipForCoord(jobInfo.Coord.x, jobInfo.Coord.y, jobInfo.Coord.z);
    SetBlipSprite(blip, Config.MarkerInfo.BlipSprite);
    SetBlipDisplay(blip, 4);
    SetBlipScale(blip, 0.9);
    SetBlipColour(blip, 2);
    SetBlipAsShortRange(blip, true);
    BeginTextCommandSetBlipName("STRING");
    AddTextComponentString(jobInfo.Type + " Train Job");
    EndTextCommandSetBlipName(blip);
	Config.Markers.push(blip);
	
	// Objectives
	for (var io = 0; io < jobInfo.WayPoints.length; io++) {
		var waypoint = jobInfo.WayPoints[io];
		blip = AddBlipForCoord(waypoint[0], waypoint[1], waypoint[3]);
		SetBlipSprite(blip, Config.MarkerInfo.BlipSprite);
		SetBlipDisplay(blip, 4);
		SetBlipScale(blip, 0.9);
		SetBlipColour(blip, 2);
		SetBlipAsShortRange(blip, true);
		BeginTextCommandSetBlipName("STRING");
		AddTextComponentString(jobInfo.Type + " Drop Off");
		EndTextCommandSetBlipName(blip);
		jobInfo.Markers.push(blip);
	}
}

var debugPos = false;
setTick(() => {
	if (IsControlJustReleased(0,214)) {
		debugPos = !debugPos;
	}
	
	if (debugPos) {
		HelpText(GetEntityCoords(GetPlayerPed(-1)));
	}
	
	
    for (var i = 0; i < Config.JobInfo.length; i++) {
        var playerCoord = GetEntityCoords(GetPlayerPed(-1), true); // array [x,y,z] 0 1 2
        var jobInfo = Config.JobInfo[i]; // Coord(x,y,z)/Type(Config.JobTypes)

		if (!Config.ObjectiveActive) {
			if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], jobInfo.Coord.x, jobInfo.Coord.y, jobInfo.Coord.z, false) < Config.MarkerInfo.DrawDistance) {
				DrawMarker(Config.MarkerInfo.MarkerType, jobInfo.Coord.x, jobInfo.Coord.y, jobInfo.Coord.z, 0.0, 0.0, 0.0, 0, 0.0, 0.0, Config.MarkerInfo.MarkerSize.x, Config.MarkerInfo.MarkerSize.y, Config.MarkerInfo.MarkerSize.z - 2.0, Config.MarkerInfo.MarkerColor.r, Config.MarkerInfo.MarkerColor.g, Config.MarkerInfo.MarkerColor.b, 100, false, true, 2, false, false, false, false);
			}
			if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], jobInfo.Coord.x, jobInfo.Coord.y, jobInfo.Coord.z, false) < Config.MarkerInfo.MarkerSize.x / 2) {
				HelpText("Press ~INPUT_DETONATE~ to start ~g~job");
				if (IsControlJustReleased(0, 58)) { // G
					exports.TrainSportation.createTrain(jobInfo.TrainID, jobInfo.TrainCoord.x, jobInfo.TrainCoord.y, jobInfo.TrainCoord.z)
					
					Config.ObjectiveCountMax = jobInfo.WayPoints.length;
					Config.ObjectiveCount = 0;
					Config.ObjectiveActive = true;
					
					HelpText("Job Started. ~g~0/" + Config.ObjectiveCountMax + " Drops");
				}
			}
		} else {
			for (var im = 0; im < jobInfo.WayPoints.length; im++) {
				if (!jobInfo.WayPointsFinished.includes(im)) {
					var playerCoord = GetEntityCoords(GetPlayerPed(-1), true); // array [x,y,z] 0 1 2
					var waypoint = jobInfo.WayPoints[im];
		
					if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], waypoint[0], waypoint[1], waypoint[2], false) < Config.ObjectiveInfo.DrawDistance) {
						DrawMarker(Config.ObjectiveInfo.MarkerType, waypoint[0], waypoint[1], waypoint[2], 0.0, 0.0, 0.0, 0, 0.0, 0.0, Config.ObjectiveInfo.MarkerSize.x, Config.ObjectiveInfo.MarkerSize.y, Config.ObjectiveInfo.MarkerSize.z - 2.0, Config.ObjectiveInfo.MarkerColor.r, Config.ObjectiveInfo.MarkerColor.g, Config.ObjectiveInfo.MarkerColor.b, 100, false, true, 2, false, false, false, false);
					}
					if (GetDistanceBetweenCoords(playerCoord[0], playerCoord[1], playerCoord[2], waypoint[0], waypoint[1], waypoint[2], false) < Config.ObjectiveInfo.MarkerSize.x / 2) {
						HelpText("Press ~INPUT_DETONATE~ to drop ~g~Cargo");
						if (IsControlJustReleased(0, 58)) { // G
							Config.ObjectiveCount++;
							HelpText("Droped Cargo ~g~" + Config.ObjectiveCount + "/" + Config.ObjectiveCountMax + " Drops");
							
							jobInfo.WayPointsFinished.push(im);
							
							if (Config.ObjectiveCount >= Config.ObjectiveCountMax) {
								HelpText("Finished Cargo run!");
								
								Config.ObjectiveCountMax = 1;
								Config.ObjectiveCount = 0;
								Config.ObjectiveActive = false;
							}
							// TODO give money, timers etc
						}
					}
				}
			}
		}
    }
});