import Backbone from 'backbone';
import fetchStorage from './storages/fetch';

//Set the default storage to be Fetch
var RNBackbone = {
    storage: fetchStorage
};

//Override sync methods for Model and Collections

RNBackbone.Model = Backbone.Model.extend({
    addDelegate(delegate){
        this.on('change', function () {
            delegate.forceUpdate();
        })
    },
    sync: function () {
        return RNBackbone.sync.apply(this, arguments);
    },
    save: function () {
        var args = _.toArray(arguments)
        var attrs = _.isFunction(arguments[0]) ? this.attributes : arguments[0];
        var options = !arguments[1] || _.isFunction(arguments[1]) ? {} : arguments[1];

        return new Promise((resolve, reject) => {
            options.success = function (model, res, options) {
                resolve(res)
            };
            options.error = function (model, res, options) {
                reject(res)
            };
            var deferred = RNBackbone.Model.prototype.save.apply(this, [attrs, options])
            console.log(deferred)
            return deferred
        })
    },
});

RNBackbone.Collection = Backbone.Collection.extend({
    addDelegate(delegate){
        this.on('change', function () {
            delegate.forceUpdate();
        })
    },
    sync: function () {
        return RNBackbone.sync.apply(this, arguments);
    }
});

RNBackbone.sync = function () {
    if (!RNBackbone.storage) {
        throw 'A storage must be specified before using RNBackbone models or collections';
    }
    //Using the sync method provided by RNBackbone
    return RNBackbone.storage.sync.apply(this, arguments);
};

export default RNBackbone;