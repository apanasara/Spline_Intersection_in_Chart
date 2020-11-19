/*****
*
*   IntersectionUtilities.js
*
*   copyright 2002, Kevin Lindsey
*
*****/

/*****
*
*   globals
*
*****/

var svgns = "";//"http://www.w3.org/2000/svg";
var azap, mouser;
var points = new Array();
var shapes = new Array();
var info;


/*****
*
*   init
*
*****/
/*function init(e) {
    if ( window.svgDocument == null )
        svgDocument = e.target.ownerDocument;

    azap   = new AntiZoomAndPan();
    mouser = new Mouser();

    var infoElem = svgDocument.getElementById("info");
    var background = svgDocument.getElementById("background");

    info = infoElem.firstChild;
    
    azap.appendNode(infoElem);
    azap.appendNode(mouser.svgNode);
    azap.appendNode(background);

    loadShapes();
    showIntersections();
}*/


/*****
*
*   loadShapes
*
*****/
function loadShapes(s) {
    svgDocument = s;
    var svg_element = getElementByXpath("//html[1]/body[1]/div[1]/div[1]/div[1]/div[1]").childNodes[0];
    var children = svg_element.childNodes[4].childNodes[1].childNodes[2].childNodes;//.childNodes;//svgDocument.documentElement.childNodes;




    (function () {

        loadScript("http://www.kevlindev.com/gui/2D.js", function () {

            //jQuery loaded
            console.log('2D.js Loaded');
            for (var i = 0; i < children.length; i++) {
                console.log(i + 'of' + children.length);
                var child = children.item(i);

                if (child.nodeName == "path") {
                    var shape;
                    switch (child.localName) {
                        case "circle": shape = new Circle(child); break;
                        case "ellipse": shape = new Ellipse(child); break;
                        case "line": shape = new Line(child); break;
                        case "path": shape = new Path(child); break;
                        case "polygon": shape = new Polygon(child); break;
                        case "rect": shape = new Rectangle(child); break;
                        default:
                        // do nothing for now
                    }
                    if (shape != null) {
                        //shape.realize();
                        shape.callback = showIntersections;
                        shapes.push(shape);
                    }

                }
            }
            showIntersections(svg_element);
        });


    })();// js Lib call back ended








    
}


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
            
            deduped_intersections.map( p=> {
                var circle = document.createElementNS(svgns, 'circle');
                circle.setAttributeNS(null, 'cx', p.x);
                circle.setAttributeNS(null, 'cy', p.y);
                circle.setAttributeNS(null, 'r', 3);
                circle.setAttributeNS(null, 'style', 'fill: none; stroke: blue; stroke-width: 1px;' );
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
*   Getting path
*
*****/
function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
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