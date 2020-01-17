$(document).ready(function(){
	var tm = new TimeMap(
  		document.getElementById("timeline"), 
		document.getElementById("map"),
		{}
    );
    
    var blueIcon = new GIcon(G_DEFAULT_ICON);
    blueIcon.image = "http://www.google.com/intl/en_us/mapfiles/ms/icons/blue-dot.png";
    blueIcon.iconSize = new GSize(32, 32);
    blueIcon.shadow = "http://www.google.com/intl/en_us/mapfiles/ms/icons/msmarker.shadow.png"
    blueIcon.shadowSize = new GSize(59, 32);
    
    var devcomm = tm.createDataset("devcomm", {});
    var developers = tm.createDataset("developers", {theme: TimeMapDataset.greenTheme()});
    developers.eventSource = devcomm.eventSource;
    
	var devTheme = Timeline.ClassicTheme.create();
	devTheme.event.track = {
            offset:         0.2, // em
            height:         1.2, // em
            gap:            0.2  // em
    };
    
	var bands = [
               
		Timeline.createBandInfo({
		             eventSource:    devcomm.eventSource,
		             width:          "80%", 
		             intervalUnit:   Timeline.DateTime.WEEK, 
		             intervalPixels: 150,
			     theme:	devTheme
		                                 }),
               /* 
		Timeline.createBandInfo({
		             eventSource:    devcomm.eventSource,
		             width:          "20%", 
		             intervalUnit:   Timeline.DateTime.YEAR, 
		             intervalPixels: 1000,
                             showEventText:  false,
		             trackHeight:    0.4,
		             trackGap:       0.2,
                             theme:          devTheme
                                         })
              */
    ];
	//bands[1].eventPainter.setLayout(bands[0].eventPainter.getLayout());
    
	tm.initTimeline(bands);
    
    // leave off callback function name!
    var feed = 'http://www.google.com/calendar/feeds/' +
      '1mh3bqmmn9gddo5mec519a1o80@group.calendar.google.com/public/full?' +
      'orderby=starttime&sortorder=ascending&singleevents=true&max-results=1000' +
      '&alt=json-in-script&callback=';
    
    var loaded = 0;
    var loadTarget = 1;
    
    JSONLoader.read(feed, function(result) {
        var entries = (result.feed.entry);
        var events = [];
        // delete events 
        for (var x=0; x<entries.length; x++) {
            entry = entries[x];
            var location = entry['gd$where'][0].valueString;
            var pattern = new RegExp(/@\s*([\-0-9.]+)\s*,\s*([\-0-9.]+)\s*/);
            var matches = pattern.exec(location);
            if (matches != null) events.push(entry);
        }
        devcomm.loadItems(events, transformGCal);
        if (++loaded == loadTarget) {
            tm.timeline.getBand(0).setCenterVisibleDate(devcomm.eventSource.getEarliestDate());
            tm.timeline.layout();
        }
    });
	
});

function transformGCal(entry) {
    var newData = {};
    newData["title"] = entry.title.$t;
    newData["options"] = {};
    // html for info window
    if (entry.content.$t.length > 120)
        var content = entry.content.$t.substring(0,120) + '...';
    else var content = entry.content.$t;
    newData["options"]["infoHtml"] = '<p><strong>' + entry.title.$t 
        + '</strong></p><p>' + content + ' ' +
        '<a href="' + entry.link[0].href + '" target=_blank>more &gt;&gt;</a></p>';
    newData["start"] = entry['gd$when'][0].startTime;
    // get geolocation
    var location = entry['gd$where'][0].valueString;
    var pattern = new RegExp(/@\s*([\-0-9.]+)\s*,\s*([\-0-9.]+)\s*/);
    var matches = pattern.exec(location);
    if (matches != null) {
        var lat = parseFloat(matches[1]);
        var lon = parseFloat(matches[2]);
        newData["point"] = {
    		"lat" : lat,
            "lon" : lon
        };
    }
    return newData;
}
