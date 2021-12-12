/**
 * @version 0.0.1
 */

var http = require("http");
var fs = require("fs");

const conf = require("./server.json");
const var_template = conf.templates.var_template;

var server = http.createServer((req, res) => {});

/**
 * injects the given data into the given html string 
 * replacing the defined tag ('<var />')
 * @param {string} fileStr - html string to inject data into
 * @param {array} data - data to inject
 * @returns the string with the data injected into it
 */
function injectData(fileStr = "", data = [""]) {
  var a = fileStr.split("<var />");
  var res = a[0];
  for (let i = 1; i < a.length; i++) {
    const element = a[i];
    res += data[i - 1] + element;
  }
  return res;
}

/**
 * checks the given html string for the given tag
 * and replaces it with the given value
 * embedded in the given type of tag
 * @param {string} str - html string to check
 * @param {string} tag - tag to replace
 * @param {string} type - type of tag
 * @param {string} value - value to replace tag with
 * @returns the string with the tag replaced
 */
function replaceTag(str = "", tag = "", type = "", value = "") {
  return str.replace(`${tag}`, `<${type}>${value}</${type}>`);
}

/**
 * checks for tags in the given html string 
 * and replaces them with the defined values
 * @param {string} str - html string to check
 */
function checkTags(str = "") {
  var files = conf.check_tags_array;

  var res = str;

  for (let i = 0; i < files.length; i++) {
    const x = files[i];
    if (str.includes(x[0])) {
      var file = fs.readFileSync(x[1]).toString();
      res = replaceTag(res, x[0], x[2], file);
    }
  }

  return res;
}

/**
 * Runs the Server
 * @param {int} port - Port to listen on
 */
exports.run = function ({ port = 8080 }) {
  const paths = conf.paths;
  const frame = checkTags(fs.readFileSync(paths.frame_template).toString());
  const home = checkTags(fs.readFileSync(paths.home_template).toString());

  const app_template = checkTags(
    fs.readFileSync(paths.app_template).toString()
  );
  const app = injectData(frame, [
    conf.templates.app_title_template.replace("<t>", var_template),
    "",
    "",
    "active",
    injectData(app_template, [
      var_template,
      var_template,
      var_template,
      var_template,
    ]),
  ]);

  server = http
    .createServer(function (req, _res) {
      var res = "";

      function Return(_val) {
        _res.writeHead(200, { "Content-Type": "text/html" });
        _res.write(_val);
        //console.log(_val);
        console.log(req.method);
        console.log(req.url);
        return _res.end();
      }

      switch (req.url) {
        case "/":
        case "/home":
          res = injectData(frame, ["Home", "active", "", "", home]);
          break;
        case "/about":
          res = injectData(frame, [
            "About",
            "",
            "active",
            "",
            "About: ERROR: 404",
          ]);
          break;
        case "/app/map":
          res = injectData(app, ["Map", "Map: ERROR: 404", "active", "", ""]);
          break;
        case "/app/dashboard":
          res = "Dashboard: ERROR: 404";
          break;
        default:
          res = "ERROR: 404";
          break;
      }

      return Return(res);
    })
    .listen(port);
};
