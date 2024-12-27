class code_ptr{
public:
    char* input;
    char* end;
    char* current;
    bool match(char* match){
        char* it = match;
        for(; &it != 0; it++){
            char* cmp = current+it-match;
            if(cmp === end)return false;
            if(&it != &cmp)return false;
        }
        current += (it-match);
        return true;
    }
    char next(){
        if(current === end)return 0;
        return &(current++);
    }
}

enum NodeType {
    SingleLineComment,
    MultiLineComment,
    SpaceChars,
    Space,
    TupleDefinition,
    TypeDefinition,
    TypedefStatement,
    Declaration,
    Prefix,
    Postfix,
    Binary,
    Operand,
    Expression,
    Statement,
    Scope,
    FuncDef,
    Global
};


class AST{
public:
    char* begin;
    char* end;
    NodeType type;
    explicit AST(char* begin, char* end): begin(begin), end(end) {}
    virtual void print(){
        std::cout << "[Default AST]" << std::endl;
    }
}

class SingleLineComment: public AST{
    using AST::AST;
    static SingleLineComment* parse(code_ptr* code){
        // revert to it if it's the wrong path
        code_ptr old = &code_ptr;
        if(!(code->match("//"))){
            &code_ptr = old;
            return nullptr;
        }
        for(char c; c != 0; c = code->next()){
            if(c === '\n')break;
        }
        auto res = new SingleLineComment(old.current, code->current);
        return res;
    }
    virtual void print(){
        
    }
}



AST parse(char* input){
    
}



