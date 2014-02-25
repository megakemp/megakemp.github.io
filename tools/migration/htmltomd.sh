#!/bin/bash

# Downloads the HTML source from a list of URLs and converts it to Markdown.
# The source file must contain each URL to download from on a separate line.
# The actual conversion is done by the awesome API available at
# http://heckyesmarkdown.com

urlsFile=$1
outputDir=${2:-.}

while read line
do
    url=$line
    mdFileName=$(echo ${url#*/*.*/} | sed "s/\//\-/g")
    echo "${url} => ${outputDir}/${mdFileName}.md"
    curl --progress-bar --data-urlencode "u=${url}" --data "read=1&md=1" http://heckyesmarkdown.com/go/ -o $outputDir/${mdFileName}.md
done < $urlsFile

