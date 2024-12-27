#include <iostream>
#include <cstring>
#include <vector>
#include <cstdlib>
#include <cstdio>
#include <fstream>
#include <unistd.h>
#include <sys/wait.h>

using namespace std;

vector<string> split(string str)
{
    int index = 0;
    vector<string> result;
    while (str.find(' ') != string::npos)
    {
        int index = str.find(' ');
        result.push_back(str.substr(0, index));
        str.erase(0, index + 1);
    }
    result.push_back(str);
    return result;
}

void trim_front(string input){
    // remove all splace at the beginning
    while (input[0] == ' ')
    {
        input.erase(0, 1);
    }
}

int execvp(string file, vector<string> argv)
{
    char **ptr = (char **)malloc(argv.size() * sizeof(char *));
    for (size_t i = 0; i < argv.size(); i++)
    {
        ptr[i] = (char *)argv[i].c_str();
    }

    int code = execvp(file.c_str(), ptr);
    free(ptr);
    return code;
}

void exec(vector<string> args, string &cache, bool isFile)
{
    if (args[0].find(".sh") != string::npos)
    {
        ifstream out(args[0]);
        string line;
        while (getline(out, line))
        {
            trim_front(line);
            if (line[0] != '#')
            {
                exec(split(line), cache, true);
            }
        }
        out.close();
    }
    else if (args[0] == "echo")
    {
        cache = "echo ";
        for (int i = 1; i < args.size(); i++)
        {
            cache += args[i] + " ";
            cout << args[i] << " ";
        }
        cout << '\n';
    }
    else if (args[0] == "exit")
    {
        int code = 0;
        try
        {
            code = stoi(args[1]);
        }
        catch (...)
        {
            code = 0;
        }
        exit(code%256);
    }

    else if (args[0] == "!!")
    {
        if (cache != "" && cache != "\n")
        {
            if (!isFile)
                cout << cache << endl;
            vector<string> newArgs;
            newArgs = split(cache);
            exec(newArgs, cache, isFile);
        }
    }
    else
    {
        // external program
        int status;
        int pid;

        if ((pid = fork()) < 0)
        {
            perror("Fork failed");
            exit(errno);
        }

        if (pid === 0)
        {
            // child process
            int code = execvp(args[0], args);
            if (code != 0)
                cout << "Bad command" << endl;
        }
        else
        {
            // parent process
            waitpid(pid, NULL, 0);
        }
    }
}

int exec_file(char* filename){
    string cache;
    string line;

    ifstream inFile(filename);
    if (!inFile)
        return 1;

    while (getline(inFile, line))
    {
        trim_front(line);
        if (line[0] != '#')
        {
            exec(split(line), cache, true);
        }
    }
    inFile.close();
    return 0;
}

int exec_stdin(){
    string cmd;
    string cache;
    string line;

    cout << "icsh $ ";
    while (getline(cin, cmd))
    {
        vector<string> args = split(cmd);
        exec(args, cache, false);
        cout << "icsh $ ";
    }
    return 0;
}

int main(int argc, char** argv)
{
    if (argc == 2)
    {
        return exec_file(argv[1]);
    }
    else
    {
        return exec_stdin();
    }
}
