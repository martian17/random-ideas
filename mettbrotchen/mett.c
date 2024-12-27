#include <stdlib.h>
#include <stdio.h>
#include <stdint.h>


typedef struct{
    char* filename;
} Arguments;

typedef struct{
    char* buffer;
    size_t size;
} StringBuffer;

StringBuffer readFile(char* filename){
    FILE* fp = fopen(filename,"r");
    if(fp == NULL) {
        perror("Error opening file\n");
        exit(1);
    }
    fseek(fp, 0, SEEK_END); // seek to end of file
    size_t size = ftell(fp); // get current file pointer
    fseek(fp, 0, SEEK_SET); // seek back to beginning of file
    char* buff = malloc(size);
    fread(buff, size, fp);
    StringBuffer res;
    res.buffer = buff;
    res.size = size;
    return res;
}

Arguments readArgs(int argc, char** argv){
    if(argc != 2){
        perror("Wrong number of arguments\n");
        exit(1);
    }
    Arguments res;
    res.filename = argv[1];
    return res;
}

int main(int argc, char** argv){
    Arguments args = readArgs(argc, argv);
    StringBuffer buff = readFile(args.filename);
    printf("%zu\n",buff.size);
    printf("%s\n",buff.buffer+40);
    return 1;
}

