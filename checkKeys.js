/**
 * Created by Shivaji on 10/23/2015.
 */
fs = require('fs');
var esprima = require("esprima");
var options = {
    tokens: true,
    tolerant: true,
    loc: true,
    range: true
};
var exit = function(){
    process.exit(1);
}
var directory = "./";
fs.readdir(directory,function(err,files){
    if(err){
        console.log(err);
        process.exit(1);
    }
    jsFiles = [];
    for (x in files){
        if(files[x]=="checkKeys.js")
            continue;
        var file = files[x];
        file = file.toString();
        //console.log(file);
        if(file.indexOf(".js") > -1)
            jsFiles.push(file);
    }
    var result = "";
    var possibleCredentials = 0
    var reportLines = "";
    for (x in jsFiles){
        var buf = fs.readFileSync(jsFiles[x], "utf8")
        var lines = [];
        lines = buf.split("\n");
        for(j in lines){
            if(lines[j].indexOf("secret")> -1){
                possibleCredentials = 1;
                var k = parseInt(j)+1;
                //Report possible credential
                reportLines += "Line:"+k+" in file: "+jsFiles[x]+": "+lines[j].trim()+"\n";

            }
            if(lines[j].toLowerCase().indexOf("key")>-1 || lines[j].toLowerCase().indexOf("token")>-1 ){
                var words = [];
                words = lines[j].split(" ");
                for (i in words){
                    //Check if any word with length greater than 50 exist between double inverted commas
                    if(words[i].length > 50 && words[i].indexOf("\"") > -1){
                        possibleCredentials = 1;
                        var k = parseInt(j)+1;
                        reportLines += "Line:"+k+" in file: "+jsFiles[x]+": "+lines[j].trim()+"\n";
                    }
                }
            }
        }
    }

    if(possibleCredentials == 1){
        //Indicates possible credential leak
        //Error is not handled by any function. So process terminates wit code other than 0
        throw new Error("Possible credentials found at: \n"+reportLines);
    }
    //No credential leaks found
    else
        process.exit(0);

});