const fs = require('fs');
const path = require('path');
// console.log("File Executed");

// TODO: Check Line Arguments
const args = process.argv.slice(2);

// TODO: Help Message
function showHelp(){
    console.log(`\nText File Analyzer`);
    console.log(`Usage: node count.js <filename.txt> [options]`);
    console.log(`\nOptions`);
    console.log(`   -h, --help, show help`);
    console.log(`   -s, --summary, show summary`);
    console.log(`   -d, --detailed, show detailed statistics`);
    console.log(`\n Example`);
    console.log(` node count.js sample.txt --detailed `);
    process.exit(0);
}

// TODO: Show Help Messages if no Arguments or HELP FLAG
if(args.length == 0 || args.includes('--help') || args.includes('-h')){
    showHelp();
}

// TODO: Pass the Command Line Arguments
const filePath = args[0];
const showDetail = args.includes('--detailed') || args.includes('-d');

// TODO: Validate the File
if(!filePath.endsWith(".txt")){
    console.log(`Error: Please provide a .txt File`);
    process.exit(1);
}

// TODO: Check if the File Exists
if(!fs.existsSync(filePath)){
    console.log(`Error: Please provide a Existing file`);
    process.exit(1);
}

// TODO: Read the File Content
function readFile(filePath){
    try {
        const buffer = fs.readFileSync(filePath);
        return buffer;
    } catch (error) {
        console.log(`Error: Reading the File ${error}`);
        process.exit(1);
    }
}

// TODO: Count Statistics 
function countStatistics(buffer){
    //? Convert the Buffer to String for Text Analysis
    const content = buffer.toString();

    //? Find Character Count
    const characterCount = buffer.length;
    
    //? Count lines (split by newline Character)
    const lines = content.split(/\r?\n/);
    const lineCount = lines.length;

    //? Count Words
    const words = content.split(/\s+/).filter((word) => word.length > 0);
    const wordCount = words.length;

    //? Byte Size
    const byteSize = buffer.byteLength;

    //? Additional Statistics
    let stats = {
        characterCount,
        lineCount,
        wordCount,
        byteSize,
    };

    if(showDetail){
        //? Count non-whitespace Characters
        const nonWhiteSpaceCharCount = content.replace(/\s/g, "").length;

        //? Counting the Word Lengths of each word
        const wordLength = words.map((word) => word.length);
        const averageWordLength = wordLength.reduce((sum, length)=> sum + length, 0) / wordCount || 0;
        
        //? Count the Paragraphs (Seperated by two new Lines)
        const paragraphCount = content.split(/\r?\n\s*\r?\n/).filter((para)=>para.trim().length > 0).length;

        //? Find the most common words
        const wordFrequency = {};
        words.forEach((word)=>{
            const normalizedWord = word.toLowerCase().replace(/[^\w]/g, "");
            if(normalizedWord.length > 0){
                wordFrequency[normalizedWord] = (wordFrequency[normalizedWord] || 0) + 1;
            }
        }); 

        const sortedWords = Object.entries(wordFrequency).sort((a, b)=>b[1]-a[1]).slice(0, 10);

        //? Add Statistics
        stats = {
            ...stats,
            nonWhiteSpaceCharCount,
            averageWordLength,
            paragraphCount,
            mostCommonWords: sortedWords,
        }
    }

    return stats;
}

// TODO: Format the Byte Size to Human Readable Format
function formatByte(bytes, decimal = 2){
    if(bytes == 0) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat(bytes / Math.pow(k, i)).toFixed(decimal) + " " + sizes[i];
}

// TODO: Function to Display the Statistics
function displayStatistics(stats){
    console.log("\n===Text File Statistics===\n");

    //? Always show Basic Statisc
    console.log(`File : ${filePath}`);
    console.log(`Size : ${formatByte(stats.byteSize)}`);
    console.log(`Characters: ${stats.characterCount}`);
    console.log(`Words: ${stats.wordCount}`);
    console.log(`Lines: ${stats.lineCount}`);

    if(showDetail){
        console.log("\n===Detailed File Statistics===\n");
        console.log(`Non White Space Characters: ${stats.nonWhiteSpaceCharCount}`);
        console.log(`Paragraph Count: ${stats.paragraphCount}`);
        console.log(`Average word length: ${stats.averageWordLength}`);
        console.log(`\n===Most Common Words===\n`);
        stats.mostCommonWords.forEach(([word, count])=>{
            console.log(`"${word}" : ${count}`);
        })
    }
}

// TODO : Main Execution
const buffer = readFile(filePath);
const statistics = countStatistics(buffer);
displayStatistics(statistics);
