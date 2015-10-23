#!/bin/bash
comments=$(node main.js | sed -n -e 's/Number of Comments://p')
totalLines=$(wc -l app.js | grep -Eo '[0-9]{1,}')
codeLines=`expr $totalLines - $comments`
echo $'\033[01;31m' "********************************************"
echo "Ratio of Comments to Code: "$comments"/"$codeLines
echo $'\033[01;31m' "********************************************"
echo $'\033[00m'
