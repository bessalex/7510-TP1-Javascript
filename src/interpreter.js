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
    },
    print: function(){
        console.log("Name: " + this.name);
        this.values.forEach(function(element) {
                console.log("\t Element: " + element );
        });
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

    this.print = function(){
        console.log(_list);
    }

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
        return (total == actual == true);
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
        return (total == actual == true);
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
Rule.prototype.print = function(){
        console.log("Name: " + this.name);
        this.params.forEach(function(element) {
            console.log("\t Params: " + element);
        });
        this.values.forEach(function(element) {
            element.print();
        });
    };



var Interpreter = function () {

    db = new Database();

    this.parseDB = function (data) {

    }

    this.checkQuery = function (params) {

}
















module.exports = Interpreter;
