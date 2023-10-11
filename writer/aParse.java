package writer;

import java.util.Scanner;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class aParse { //Looks at words.txt and splits the terms and definitions into two txt files for javascript use
    //Used to split words.txt into two text files: term.txt and definition.txt, can reuse method whenever i add new definitions, method ignores set dates
    //Added later: Method now also splits the dates into a different file (date.txt) to be used for the dropdown menu in the sets gamemode
    public void splitWord() throws IOException {
        File file = new File("writer/words.txt");
        Scanner sc = new Scanner(file);
        FileWriter terms = new FileWriter("writer/term.txt");
        FileWriter definitions = new FileWriter("writer/definition.txt");
        FileWriter dates = new FileWriter("writer/date.txt");
        boolean firstTerm = true;
        boolean firstDate = true;

        while (sc.hasNextLine()) {
            String current = sc.nextLine();
            String term, definition, date;
            int index = current.indexOf("-"); //if entry has a dash in it, do the stuff, edit: this is how i differentiate titles between entries, just make sure no title has a dash in it

            if (index != -1) { //if '-' is in line, do this
                if (!firstTerm) {
                    term = "\n" + current.substring(0, index-1);
                    definition = "\n" + current.substring(index+2);
                    
                } else {
                    term = current.substring(0, index-1) ;
                    definition = current.substring(index+2);
                    firstTerm = false;
                }

                terms.write(term);
                definitions.write(definition);
            } else { 
                if (!firstDate) {
                    date = "\n" + current;
                } else {
                    date = current;
                    firstDate = false;
                }

                dates.write(date);
            }            
        }

        sc.close();
        terms.close();
        definitions.close();
        dates.close();
    }

    //Used to add term.txt and definition.txt together (not sure if this is ever used again) *wait why did I even make this one again? output.txt will be in replit if i ever need it for some reason
    public void addTexts() throws IOException {
        File term = new File("writer/term.txt");
        File definition = new File("writer/definition.txt");
        File output = new File("writer/output.txt");
        output.createNewFile();
        FileWriter writer = new FileWriter(output);
        Scanner tsc = new Scanner(term);
        Scanner dsc = new Scanner(definition);
        boolean first = true;

        while (tsc.hasNextLine()) {
            String currentTerm = tsc.nextLine().trim();
            String currentDef = dsc.nextLine().trim();

            if (first) {
                writer.write(currentTerm + " - " + currentDef);
                first = false;
            } else {
                writer.write("\n" + currentTerm + " - " + currentDef);
            }
        }

        tsc.close();
        dsc.close();
        writer.close();
    }

    //Used to trim words.txt and place that trimmed version in a newly created file, probably wont ever be used again (it was used to trim some of those words with extra spaces)
    public void trimFile() throws IOException {
        File file = new File("writer/words.txt");
        Scanner sc = new Scanner(file);
        File newWords = new File("writer/wordsTrimmed.txt");
        newWords.createNewFile();
        FileWriter fw = new FileWriter(newWords);
        boolean flag = true;
        
        while (sc.hasNextLine()) {
            String currentTerm = sc.nextLine().trim();

            if (flag) {
                fw.write(currentTerm);
                flag = false;
            } else {
                fw.write("\n" + currentTerm);
            }
        }

        sc.close();
        fw.close();
    }

    public static void main(String[] args) throws IOException {
        aParse par = new aParse();
        par.splitWord();
    }
}