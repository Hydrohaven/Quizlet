async function printText() {
    var response = await fetch('/writer/words.txt');
    const t = await response.text();
    
    const text = document.getElementsByClassName("text")[0];
    var first = true;

    const collection = t.split("\n");

    //loops through words.txt and appends each date with strong and every date after the first date with a line break, not sure if this is like really slow or something
    //code doesnt detect by date or 년 so I can make whatever sort of titles i want if i want to change them
    for (let line of collection) { 
        if (!line.includes("-")) {
            var bold = document.createElement("STRONG");
            var date = document.createTextNode(line);
            bold.appendChild(date); //adds bold to the date
            bold.className = "date"

            if (!first) { 
                text.appendChild(document.createElement("BR"));
            } else {
                first = false;
            }

            text.appendChild(bold);
            text.appendChild(document.createElement("BR"));
            var ul = document.createElement("ul");

        } else {
            var li = document.createElement("li");
            var span = document.createElement("span");
            var term = line.substring(0, line.indexOf("-")-1);
            var definition = line.substring(line.indexOf("-")-1);

            span.appendChild(document.createTextNode(term));
            span.className = "term";

            li.appendChild(span);
            li.appendChild(document.createTextNode(definition));

            ul.appendChild(li);
            text.appendChild(ul); //ul has a built in line break at its end
        }
    }
}