var Product = function(name, categoryId) {
    this.name = name;
    this.categoryId = categoryId;
}

var Category = function(name) {
    this.id = _.uniqueId();
    this.name = name;
    this.subcategories = [];
    this.products = [];
}

Category.prototype.addSubcategory = function(name) {
    var subcategory = new Category(name);
    this.subcategories.push(subcategory);
    return subcategory;
}

Category.prototype.addProduct = function(name) {
    var product = new Product(name, this.id);
    this.products.push(product);
    return this;
}

Category.prototype.flatten = function(category) {
    category = (category === undefined) ? this : category;
    if (category.subcategories.length === 0) {
        return [category];
    } else {
        var subcategories = [];
        for (var i=0; i < category.subcategories.length; i++) {
            var subcategory = category.subcategories[i];
            subcategories = subcategories.concat(Category.prototype.flatten(subcategory));
        }
        return subcategories.concat([category]);
    }
}

var Bundle = function(product, available) {
    this.product = product;
    this.available = available;
};

var Basket = function() {
    this.bundles = [];
};

Basket.prototype.remove = function(bundle) {
    this.bundles.splice(this.bundles.indexOf(bundle), 1);
}

var bikes = new Category("Bike");
    var forMan = bikes.addSubcategory("for men");
        forMan.addSubcategory("city bike").addProduct("Marin Fairfax SC6 DLX").addProduct("Four Peaks X State Bicycle Co. Deluxe");
        forMan.addSubcategory("mountain bike").addProduct("TOP FUEL 9.9 RACE SHOP LIMITED").addProduct("FARLEY 9.9");
    var forWoman = bikes.addSubcategory("for women");
        forWoman.addSubcategory("city bike").addProduct("Faraday Porteur").addProduct("Electra Townie Kids 7D");
        forWoman.addSubcategory("mountain bike").addProduct("REMEDY 9.8 WOMEN'S").addProduct("TOP FUEL 9.8 SL WOMEN'S").addProduct("mystery third product");

var tents = new Category("Tent");
    var single = tents.addSubcategory("single").addProduct("REI Quarter Dome Tent").addProduct("REI Quarter Dome Tent");
    var double = tents.addSubcategory("double").addProduct("REI Half Dome 2 Plus Tent").addProduct("NEMO Galaxi 2 Tent with Footprint");
    var triple = tents.addSubcategory("triple").addProduct("Big Agnes Copper Spur UL 3 mtnGLO Tent").addProduct("Kelty TraiLogic TN3 Tent");

var categories = [
    bikes,
    tents
];


var underscore = angular.module("underscore", []);
underscore.factory("_", ["$window", function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

var app = angular.module("simpleShop", ["underscore", "dndLists"]);

app.controller("shopController", function() {
    var self = this;
    this.categories = categories;//angular.copy(categories);
    
    this.basket = new Basket();
    this.selected = null;
    
    this.contentChecked = undefined;
    
    this.createBundle = function(product) {
        var inStock = Math.random() < 0.7;
        return new Bundle(product, inStock);
    }
    
    this.remove = function(bundle) {
        this.basket.remove(bundle);
        var categories = _.flatten(_.map(this.categories, Category.prototype.flatten));
        var category = _.find(categories, function(category) {return category.id === bundle.product.categoryId;});
        if (category !== undefined) {
            category.products.splice(bundle.index, 0, bundle.product);
        }
    };
    
    this.checkContent = function() {
        var validOrder = true;
        for(bundle in this.basket.bundles){
            console.log(this.basket.bundles[bundle], this.basket.bundles[bundle].available);
            if(!this.basket.bundles[bundle].available){
                validOrder = false;
            }
        }
        this.contentChecked = validOrder;
    }
    
    this.submitPurchase = function() {
        alert("You just spent your money on us!");
        while (this.basket.bundles.length > 0) {
            this.remove(this.basket.bundles[0]);
        }
    }
});

