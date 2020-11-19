/*****
*
*   IntersectionUtilities.js
*
*   copyright 2002, Kevin Lindsey
*
*****/



/*****
*
*   Clipper Paths
*
*****/
function loadClipperPath(svg, width, height) {
   

    (function () {

        loadScript("http://www.kevlindev.com/gui/2D.js", function () {
        var shape1 = new Path(svg.select("#PlanPath")[0][0]);
        var shape2 = new Path(svg.select("#ActualPath")[0][0]);
        
        var intersections = [];
        var overlays = Intersection.intersectShapes(shape1, shape2);
    
        for (i in overlays.points) {
            if (overlays.points[i].constructor.name == "Point2D" || overlays.points[i].constructor.name == "Vector2D") {
                intersections.push(overlays.points[i]);
            }
        }

        // The path will record 2 points for each intersection, so deduping is necessary
        var deduped_intersections = uniq(intersections);

        // clipper Rectangles
        var clip_green = svg.append("clipPath").attr("id", "clip-green")
        var clip_red = svg.append("clipPath").attr("id", "clip-red")
        var clip_yellow = svg.append("clipPath").attr("id", "clip-yellow")

        var prevx = 0;
        var temp = 0;

        deduped_intersections.map(p => {
            if (temp == 1) {
                clip_green.append("rect")
                .attr("x", prevx)
                .attr("y", 0)
                .attr("width", p.x - prevx)
                .attr("height", height);
            }
            else {
                clip_red.append("rect")
                    .attr("x", prevx)
                    .attr("y", 0)
                    .attr("width", p.x - prevx)
                    .attr("height", height);
            }
            prevx = p.x;
            temp++;
            
        });//intersection array loop


        clip_green.append("rect")
        .attr("x", prevx)
        .attr("y", 0)
        .attr("width", width - prevx)
        .attr("height", height);


    });})();// js Lib call back ended
   
};




/*****
*
*   showIntersections
*
*****/
function showIntersections(s) {
    if (shapes.length >= 2) {
        var intersections = [];
        var overlays = Intersection.intersectShapes(shapes[0], shapes[1]);

        for (i in overlays.points) {
            if (overlays.points[i].constructor.name == "Point2D" || overlays.points[i].constructor.name == "Vector2D") {
                intersections.push(overlays.points[i]);
            }
        }




        // The path will record 2 points for each intersection, so deduping is necessary
        var deduped_intersections = uniq(intersections);

        deduped_intersections.map(p => {
            var circle = document.createElementNS(svgns, 'circle');
            circle.setAttributeNS(null, 'cx', p.x);
            circle.setAttributeNS(null, 'cy', p.y);
            circle.setAttributeNS(null, 'r', 3);
            circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;');
            s.appendChild(circle);
        });


        /*for (var i = 0; i < inter.points.length; i++) {
            var coord = inter.points[i];

            if (i >= points.length) {
                var point = svgDocument.createElementNS(s, "point");

                point.setAttributeNS(
                    "http://www.w3.org/1999/xlink",
                    "href",
                    "#intersection"
                );
                svgDocument.documentElement.appendChild(point);
                points.push(point);
            }
            points[i].setAttributeNS(null, "x", coord.x);
            points[i].setAttributeNS(null, "y", coord.y);
            points[i].setAttributeNS(null, "display", "inline");
        }

        for (var i = inter.points.length; i < points.length; i++) {
            points[i].setAttributeNS(null, "display", "none");
        }*/
    }
}




/*****
*
*   Unique of Intersection Array
*
*****/


function uniq(a) {
    var prims = { "boolean": {}, "number": {}, "string": {} }, objs = [];

    return a.filter(function (item) {
        var type = typeof item;
        if (type in prims)
            return prims[type].hasOwnProperty(item) ? false : (prims[type][item] = true);
        else
            return objs.indexOf(item) >= 0 ? false : objs.push(item);
    });
}

/*****
*
*   Loading Script
*
*****/

function loadScript(url, callback) {

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}