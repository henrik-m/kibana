/*! kibana - v3.1.3 - 2017-01-02
 * Copyright (c) 2017 Rashid Khan; Licensed Apache-2.0 */

define([],function(){function a(a,b){var d=c.readFileSync(a,"utf8");0===d.indexOf("\ufeff")&&(d=d.substring(1)),b(d)}function b(a){return a.replace(/[\r\n]+/g," ").replace(/[\t]/g," ")}var c=require.nodeRequire("fs"),d={},e=!1,f={load:function(c,e,f,g){f(!0),a(g.baseUrl+c,function(a){d[c]=b(a)})},write:function(a,b,c,f){e||(e=!0,c("define('"+a+"-embed', function()\n{\n\tfunction embed_css(content)\n\t{\n\t\tvar head = document.getElementsByTagName('head')[0],\n\t\tstyle = document.createElement('style'),\n\t\trules = document.createTextNode(content);\n\t\tstyle.type = 'text/css';\n\t\tif(style.styleSheet)\n\t\t\tstyle.styleSheet.cssText = rules.nodeValue;\n\t\telse style.appendChild(rules);\n\t\t\thead.appendChild(style);\n\t}\n\treturn embed_css;\n});\n")),c("define('"+a+"!"+b+"', ['"+a+"-embed'], \nfunction(embed)\n{\n\tembed(\n\t'"+d[b].replace(/'/g,"\\'")+"'\n\t);\n\treturn true;\n});\n")},writeFile:function(a,b,c){},onLayerEnd:function(a,b){}};return f});