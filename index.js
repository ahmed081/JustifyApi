console.log("ahmed")

var fs = require('fs')
let MaxLienLength = 80;
const wordCount = require("word-character-count");
let filename = "text.txt"

/* fs.readFile(filename, 'utf8', async(err, data)=> {
    if (err) throw err;
    console.log('OK: ' + filename);
    //split the text to the paragraphs array
    //split each paragraph to words
    
    //const result = await wordCount.WordCount(data);
    //console.log(result)
    console.log(JUSTIFY(data))

});  */



const JUSTIFY = (data)=>{
    paragraphs = data.split("\r\n\r\n").map(paragraph=>paragraph.split("\r\n").join('').trim().split(" "));
    let lines=[]
    let line = []
    let MaxLienLengthTmp = MaxLienLength;
    paragraphs = paragraphs.map(paragraph=>{
        lines = []
        line = []
        MaxLienLengthTmp = MaxLienLength;
        paragraph.map(word =>{
            
            if(word.length <=  MaxLienLengthTmp)
            {
                line=[...line,word]
                MaxLienLengthTmp = MaxLienLengthTmp-word.length-1
                
                return word
            }
            line=[...line,MaxLienLengthTmp]
            lines =[...lines,line]
            line = []
            line = [...line,word]
            MaxLienLengthTmp = MaxLienLength-word.length-1
            return word
        })
        if(line.length> 0)
        {
            line =[...line,MaxLienLengthTmp]
            lines =[...lines,line]
            line = []
        }
        return lines
    })
    paragraphs = paragraphs.map(lines =>{
        lines=  lines.map(line=>{
            extratSpace=line[line.length-1]+1
            line = [...line.slice(0,line.length-1)]
            while(extratSpace>0){
                if(line.length == 1) break;
                for(let i=0;i<line.length-1;i++)
                {
                    if(extratSpace==0) break;
                    line[i] = line[i]+" "
                    extratSpace--
                    
                }
                
               
            }
            return line.join(" ")
        })
        
        return lines.join("\n")
    })
    return paragraphs.join("\n")
}

module.exports = JUSTIFY