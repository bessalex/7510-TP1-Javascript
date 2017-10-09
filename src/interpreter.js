/* Singleton contiene toda la base de datos de Facts y Rules */
function Database() {

    var instance;
    Database = function Database() {
        return instance;
    };
    Database.prototype = this;
    instance = new Database();
    instance.constructor = Database;

    instance.facts = new DBList();
    instance.rules = new DBList();

    instance.isEmpty = function(){
       return (instance.facts.isEmpty() && instance.rules.isEmpty());
    };

    return instance;
};

/*  Elemento generico de DBList   */
var DBElement = function(){
    this.name = "";
    this.values = [];
};

DBElement.prototype = {
    getName: function(){
        return this.name;
    },
    addValue: function(value){
        this.values.push(value);
    },
    getValues: function(){
        return this.values;
    }

};

/*  Lista básica contenida de la Database  */
var DBList = function(){
    var _list = [];

    function filterByName(name, value, index, array){
        if (value.name == name){
            return true;
        }
        return false;
    };

    this.add = function(item){
        _list.push(item);
    };

    this.get = function(){
        return _list.pop();
    };

    this.get = function(name){
        return _list.filter(filterByName.bind(null,name));
    };
    this.isEmpty = function(){
        return (_list.length == 0);
    };
};

/* Definición de los Facts */
var Fact = function(name){
    this.name = name;
    this.values = [];
};
Fact.prototype = new DBElement();
Fact.prototype.verify= function(params){
    var listOfValues = this.getValues();
    var result = [];

    function getResult(total, actual){
        return (total && actual);
    }

    for (var key in params) {
        result.push(params[key] === listOfValues[key]);
    }

    return result.reduce(getResult);
};


/* Definición de los Rules */
var Rule = function(name,params){
    this.name = name;
    this.params = params;
    this.values = [];
};

Rule.prototype = new DBElement();
Rule.prototype.verify = function (posParams){
    var _result = [];

    function getValueOfParams(params){
        var valuePos = [];
        for (var key in params){
            valuePos[key] = posParams[params[key]];
        }
        return valuePos;
    }

    function getResult(total, actual){
        return (total && actual);
    }

    function verifyFacts(listOfFacts,params){
        for (var key in _listOfFacts){
            if (listOfFacts[key].verify(params)) return true;
        }
        return false;
    }

    var _db = new Database();

    for (var key in this.values){
        var _params = getValueOfParams(this.values[key].values);
        var _listOfFacts = _db.facts.get(this.values[key].name);

        _result.push(verifyFacts(_listOfFacts,_params));
    }
    return _result.reduce(getResult);
};

Rule.prototype.addValues = function(fname, fparams){
    var dbElement = new DBElement();
    dbElement.name = fname;

    for (var key in fparams){
        dbElement.values.push(this.params.indexOf(fparams[key]));
    }
    this.values.push(dbElement);
};


/*   Parseo de Elementos */
var parseNameAndParams= function (element){
    return element.match(/([^\(\., \)]+)/g);
};


var parseFact= function(element){
    var parts = parseNameAndParams(element);
    // console.log("Fact: " + parts[0]);

    var newFact = new Fact(parts[0]);

    for(var i=1; i<parts.length; i++){
        newFact.addValue(parts[i]);
        // console.log("\t partes: " + parts[i]);
    }
    return newFact;
};



var parseRule= function(element){

    // console.log("Rule: ");
    var parts = element.split(":-");
    // console.log("\t parts: " + parts);

    var ruleParts = parseNameAndParams(parts[0]);
    // console.log("\t ruleParts: " + ruleParts);

    var params = ruleParts.slice(1,ruleParts.length);
    // console.log("\t Params: " + params);

    var newRule = new Rule(ruleParts[0],params);
    // console.log("\t newRule: " + newRule.name + " " + newRule.params);


    var factContent = parts[1].split("),");
    // console.log("\t factContent: " + factContent);

    for (var key in factContent){
        var fact = parseNameAndParams(factContent[key]);
        var name = fact[0];
        // console.log("\t\t fact content Name: " + name);
        var values = [];

        for (var i=1; i<fact.length; i++){
            values.push(fact[i]);
        }
        newRule.addValues(name,values);
        // console.log("\t\t fact content params: " + values);

    }
    return newRule;
};




var is_rule = function (element){
    if (element.indexOf(":-") > 0 && (element.indexOf(".") == element.length -1 )){
        return (element.match(/[^.]+(:-){1}[^.]+\([^\(,.\)]+[^\(.\)]*\)./));
    }
    return false
};

var is_fact = function (element){
    if (element.indexOf("(")>0 && element.indexOf(")")>0 ){
        return element.match(/\([^\(,.\)]+[^\(.\)]*\)/);
    };
    return false;
};


/* Carga de la Database según patron chain of responsability */
var chargeDB = function() {
    var chargeRule = new ChargeElement(is_rule,parseRule,db.rules);
    var chargeFact = new ChargeElement(is_fact,parseFact,db.facts);

    chargeRule.setNextStack(chargeFact);

    this.chargeBD = chargeRule;
};

chargeDB.prototype.withdraw = function(element) {
    var result = false;
    result = this.chargeBD.withdraw(element);
    return result;
};


var ChargeElement = function(isThisType, parseType,dest) {
    this.next = null;
    this.withdraw = function(element) {
        if (isThisType(element)){
            var newElement = parseType(element);
            dest.add(newElement);
            return true;
        }else{
            if (this.next!=null){
                return this.next.withdraw(element);
            }
        }
    };

    this.setNextStack = function(stack) {
        this.next = stack;
    };
};


/****  query basado en el patron Chain of responsability ****/
var Query = function() {
    var queryRule = new makeQuery(db.rules);
    var queryFact = new makeQuery(db.facts);

    queryRule.setNextStack(queryFact);

    this.Query = queryRule;
};

Query.prototype.withdraw = function(element) {
    element.result = false;
    this.Query.withdraw(element);
    return element.result;
};

var makeQuery = function(dbList) {
    this.next = null;
    this.withdraw = function(element) {

        var dbListresult = dbList.get(element.name);
        for (var key in dbListresult) {
            if (dbListresult[key].verify(element.values)) element.result = true
        }

        if (~element.result){
            if (this.next!=null){
                this.next.withdraw(element);
            }
        }
    };

    this.setNextStack = function(stack) {
        this.next = stack;
    };
};





var Interpreter = function () {

    db = new Database();
    
    this.QueryError = function(){
    	throw new Error ('Query Error');
    }

    this.parseDB = function (data) {
        var parser = new chargeDB();
        var request = "";
        var result = false;
        for (key in data){
            request = data[key];
            result = parser.withdraw(data[key]);
            if (!result){
                console.log("Error en la carga de elemento: " + data[key] );
                return false;
            }
        }
        return true;
    }

    this.checkQuery = function (params) {
        if (db.isEmpty()) return null;
        if (!is_fact(params)) this.QueryError();

        var query = new Query();
        var request = "";
        var parserQuery = parseFact(params);
        return query.withdraw(parserQuery);
    }

}


module.exports = Interpreter;
