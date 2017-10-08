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




var Interpreter = function () {

    db = new Database();

    this.parseDB = function (data) {

    }

    this.checkQuery = function (params) {

}
















module.exports = Interpreter;
