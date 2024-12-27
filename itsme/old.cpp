#include <iostream>
#include <cstring>
#include <vector>
#include <cstdlib>
#include <cstdio>
#include <fstream>

using namespace std;

vector<string> split(string str)
{
     int index=0;
     std::vector<string>result;
     while(str.find(' ')!=string::npos)
     {
          int index = str.find(' ');
          result.push_back(str.substr(0,index));
          str.erase(0,index+1);
     }
     result.push_back(str);
     return result;
}

void exec(vector<string> args,std::string &cache,bool isFile)
{
     if (args[0]=="echo")
     {
          cache = "echo ";
          for (int i=1;i<args.size();i++)
          {    
               cache += args[i] +" ";
               cout << args[i] << " ";
          }
          cout <<'\n';
     }
     
     else if(args[0]=="exit")
     {
          int code = 0;
          try {
               code = stoi(args[1]); 
          } catch(...)
          {
               code = 0;
          }
          if((0<code) && (255>code))
          {
               exit(code);
          } else {
               //truncate to 8 bits 
               code = code % 255;
               exit(code);
          }
     }
     
     else if (args[0] == "!!") {
          if(cache != "" && cache != "\n") {
               if(!isFile) cout << cache << endl;
               vector<string> newArgs;
               newArgs = split(cache);
               exec(newArgs,cache,isFile);
          }
          else{
                
          }
     }
     else {
          std::string cmd = "";
          for (int i=0;i<args.size();i++)
          {    
               cmd += args[i] +" ";
          }
          int status = system(cmd.c_str());
          if (status != 0) {
               cout << "bad command" << endl;
          }
          else {
               cache = cmd;
          }
     }
}



int main(int argc,char* argv[]){
     vector<string> args;
     std::string cmd = "";
     std::string cache="";
     string line;

    if (argc == 2) {
        std::ifstream inFile(argv[1]);
        if (!inFile) {
            return 1;
        }
     
     while (std::getline(inFile, line)) {
          //cache = "";
          //remove all splace at the beginning
          while(line[0] == ' ') {
               line.erase(0,1);
          }
          if (line[0] != '#') {
               exec(split(line), cache,true);
          }
          //std::cout << line << std::endl;
     }
     inFile.close();
     } 
     else {
          while(cmd!="exit"){
          cout<<"icsh $ ";
          std::getline(std::cin,cmd);
          args = split(cmd);
          if (args[0].find(".sh") != string::npos) {
               ifstream out(args[0]);
               while(getline(out, line)) {
                    while(line[0] == ' ') {
                         line.erase(0,1);
                    }
                    if (line[0] != '#') {
                         exec(split(line), cache,true);
                    }
               }
               
               out.close();
     
               } else {
                    exec(args, cache,false);
               }
          }
     }
}

